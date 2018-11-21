const Bot = require('./Bot');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('botsettings.json', 'utf8'));

var bot = new Bot(config.Token);
bot.run();
console.log("Bot started with settings from botsettings.json");