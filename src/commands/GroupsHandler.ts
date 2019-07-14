import * as Discord from 'discord.js';
import CommandHandler from "./CommandHandler";
import { createConnection, Connection, FindManyOptions, ConnectionManager, AdvancedConsoleLogger } from 'typeorm';
import { User } from '../models/User';
import { Game } from '../models/Game';
import { UserToGame } from '../models/UserToGame';

export default class GroupsHandler extends CommandHandler {
    client: Discord.Client;

    private static UPDATE_INTERVAL_WATCHER = 1000 * 5;
    //TODO: different orm connections
    static CONNECTION_NAME_WATCHER = 'groupHandler.watcher';
    static CONNECTION_NAME_MANAGER = 'groupHandler.manager';

    constructor(prefix: string, client: Discord.Client) {
        super(prefix);
        this.client = client;
        setInterval(watcherLoop, GroupsHandler.UPDATE_INTERVAL_WATCHER, client);
        //TODO: managing groups loop        

    }

    ping(message: Discord.Message): void {
        message.reply("pong");
    }
}

// TODO: Logging
async function watcherLoop(client: Discord.Client) {
    if (!client)
        throw new Error("Client is null");

    if (client.status !== 0)
        return;

    const connection = await createConnection();
    const guilds = client.guilds;

    guilds.forEach(async guild => {
        await guild.fetchMembers();
        guild.members.forEach(async member => {
            let user = await retrieveUser(connection, member);
            let game = member.presence.game ? await retrieveGame(connection, member.presence.game) : undefined;

            if (game && user) {
                const u2g = await updateU2G(connection, user, game);
            }
        });
    });

    connection.close();
}

async function retrieveUser(connection: Connection, member: Discord.GuildMember) {
    const userRepository = connection.getRepository(User);

    let user = await userRepository.findOne({ where: { discordId: member.id } });
    if (!user) {
        user = new User();
        user.discordId = member.id;
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

    u2g.lastSeen = new Date(Date.now());
    await connection.manager.save(u2g);

    return u2g;
}