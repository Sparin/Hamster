import * as Discord from 'discord.js';
import CommandHandler from "./CommandHandler";
import { createConnection, Connection, LessThan } from 'typeorm';
import { User } from '../models/User';
import { Game } from '../models/Game';
import { UserToGame } from '../models/UserToGame';
import GroupManagementOptions from '../configuration/GroupManagementOptions';

export default class GroupsHandler extends CommandHandler {
    client: Discord.Client;
    options: GroupManagementOptions;

    constructor(prefix: string, client: Discord.Client, options: GroupManagementOptions) {
        super(prefix);
        this.client = client;
        this.options = options;
        createConnection().then(connection => {
            setInterval(watcherLoop, this.options.managerLoopInterval, client, this.options, connection);
            setInterval(managerLoop, this.options.managerLoopInterval, client, this.options, connection);
        });
    }

    // ping(message: Discord.Message): void {
    //     message.reply("pong");
    // }
}

async function managerLoop(client: Discord.Client, options: GroupManagementOptions, connection: Connection) {

    console.log("-----===== { Manager Loop } =====-----");
    const u2gRepository = connection.getRepository(UserToGame);
    const gameRepository = connection.getRepository(Game);
    const expirationDate = Date.now() - options.membershipDuration;
    const guild = client.guilds.find(guild => guild.id === options.guildId);
    if (!guild)
        return;

    // Remove users from groups when they've got expired membership
    const expiredMemberships = await u2gRepository.find(
        {
            where: { lastSeen: LessThan(expirationDate) },
            relations: ['user', 'game']
        });
    expiredMemberships.forEach(async membership => {
        const user = await client.fetchUser(membership.user.discordId);
        const member = await guild.fetchMember(user);
        if (member) {
            const role = await guild.roles.find(x => x.name == membership.game.name);
            if (role)
                member.removeRole(role);
        }
    });

    // Clean up expired membership
    const res = await connection.createQueryBuilder()
        .delete()
        .from(UserToGame)
        .where('"user_to_game"."lastSeen" < :expirationDate', { expirationDate: expirationDate })
        .execute();

    // Clean up game roles 
    var emptyGames = await gameRepository.createQueryBuilder("game")
        .leftJoin("game.userToGames", 'utg')
        .groupBy("gameid")
        .having('COUNT(gameId) <= 0')
        .getMany();

    const roles = await guild.roles.filter(x => emptyGames.map(g => g.name).includes(x.name));
    roles.forEach(async (role) => {
        await role.delete();
    });
}

async function watcherLoop(client: Discord.Client, options: GroupManagementOptions, connection: Connection) {
    if (!client)
        throw new Error("Client is null");

    if (client.status !== 0)
        return;

    console.log("-----===== { Watcher Loop } =====-----");
    const guild = client.guilds.find(guild => guild.id === options.guildId);
    if (!guild)
        return;

    await guild.fetchMembers();
    guild.members.forEach(async member => {
        let user = await retrieveUser(connection, member);
        let game = member.presence.game && member.presence.game.name != "Custom Status"
            ? await retrieveGame(connection, member.presence.game)
            : undefined;


        if (game && user) {
            console.log(`Update U2G ${user.name} for ${game.name}`);
            await updateU2G(connection, user, game);
            const gameName = game!.name.trim();
            let role = await guild.roles.find(x => x.name == gameName);

            if (!role)
                role = await guild.createRole({ name: gameName, mentionable: true, color: 'GOLD' });

            if (!member.roles.has(role.id)) {
                console.log(`Adding role ${role.name} for ${member.displayName}`);
                member.addRole(role, "Hamster group management membership system");
            }

        }
    });
}

async function retrieveUser(connection: Connection, member: Discord.GuildMember) {
    const userRepository = connection.getRepository(User);

    let user = await userRepository.findOne({ where: { discordId: member.id } });
    if (!user) {
        user = new User();
        user.discordId = member.id;
        user.name = member.displayName;
        await connection.manager.save(user);
    }

    return user;
}

async function retrieveGame(connection: Connection, dGame: Discord.Game) {
    const gameRepository = connection.getRepository(Game);

    let game = await gameRepository.findOne({ where: { name: dGame.name } });
    if (!game) {
        game = new Game();
        game.name = dGame.name;
        await connection.manager.save(game);
    }

    return game;
}

async function updateU2G(connection: Connection, user: User, game: Game) {
    const u2gRepository = connection.getRepository(UserToGame);

    let u2g = await u2gRepository.findOne({
        where: {
            game: { id: game.id },
            user: { id: user.id }
        }
    });
    if (!u2g) {
        u2g = new UserToGame();
        u2g.game = game;
        u2g.user = user;
    }

    u2g.lastSeen = Date.now();
    await connection.manager.save(u2g);

    return u2g;
}