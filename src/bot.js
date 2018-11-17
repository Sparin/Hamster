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
console.log("Bot initialized with settings from botsettings.json");