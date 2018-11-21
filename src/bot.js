"use strict";
const Discord = require('discord.js');
const fs = require('fs');
const commands = require('./commands.js');

const client = new Discord.Client();
const config = JSON.parse(fs.readFileSync('botsettings.json', 'utf8'));


client.on('message', msg =>{
    commands.handle(msg);
});


client.login(config.Token);
console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);