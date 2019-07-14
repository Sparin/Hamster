import * as Discord from 'discord.js';
import GroupsHandler from './commands/GroupsHandler'

export default class Bot {
    client: Discord.Client;
    token: string;

    /**
     * 
     * @param {string} token Bot API token 
     */
    constructor(token: string) {
        this.client = new Discord.Client();
        this.token = token;

        const groups = new GroupsHandler('!', this.client);

        this.client.on('message', msg => {
            groups.handle(msg);
        });

        this.client.on('ready', async () => {
            await this.client.user.setActivity('Rays of goodness', { type: 'STREAMING' });
        });
    }

    public async start() {
        await this.client.login(this.token);
    }

    public async stop() {
        await this.client.destroy();
    }
}