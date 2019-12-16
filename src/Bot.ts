import * as Discord from 'discord.js';
import GroupsHandler from './commands/GroupsHandler'
import BotOptions from './configuration/BotOptions';

export default class Bot {
    client: Discord.Client;
    options: BotOptions;

    constructor(options: BotOptions) {
        this.client = new Discord.Client();
        this.options = options;

        const groups = new GroupsHandler('!', this.client, options.groupManagement);

        this.client.on('message', msg => {
            groups.handle(msg);
        });

        this.client.on('ready', async () => {
            await this.client.user.setActivity('Rays of goodness', { type: 'STREAMING' });
        });
    }

    public async start() {
        await this.client.login(this.options.token);
    }

    public async stop() {
        await this.client.destroy();
    }
}