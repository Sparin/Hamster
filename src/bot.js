const Discord = require('discord.js');
const fs = require('fs');
const ExampleHandler = require("./ExampleHandler");

class Bot {
    /**
     * 
     * @param {string} token Bot API token 
     */
    constructor(token) {
        this.client = new Discord.Client();
        this.token = token;

        this.commands = new ExampleHandler("!");

        this.client.on('message', msg => {
            this.commands.handle(msg);
        });
    }

    run() {
        this.client.login(this.token);
    }
}

module.exports = Bot;