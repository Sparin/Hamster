import Bot from './Bot';
import BotOptions from './configuration/BotOptions';
import "reflect-metadata";

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('botsettings.json', 'utf8'));

var bot = new Bot(config);
bot.start();
console.log("Bot started with settings from botsettings.json");