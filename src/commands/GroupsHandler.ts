import * as Discord from 'discord.js';
import CommandHandler from "./CommandHandler";

export default class GroupsHandler extends CommandHandler {
    constructor(prefix: string) {
        super(prefix);
    }

    ping(message: Discord.Message): void {
        message.reply("pong");
    }
}