const Discord = require('discord.js');
const fs = require('fs');
const ExampleHandler = require("./ExampleHandler");
const GroupManagementHandler = require("./GroupManagementHandler");

class Bot {
    /**
     * 
     * @param {string} token Bot API token 
     */
    constructor(token) {
        this.client = new Discord.Client();
        this.token = token;

        this.commands = new ExampleHandler("!");
        this.groups = new GroupManagementHandler("!");

        this.client.on('message', msg => {
            this.commands.handle(msg);
            this.groups.handle(msg);
        });

        this.client.on('ready', async () => {
            await this.client.user.setActivity('на Машу', { type: 'WATCHING' });
        });
    }

    run() {
        this.client.login(this.token);
    }
}

module.exports = Bot;