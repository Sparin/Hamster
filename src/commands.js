"use strict";

const prefix = "!"
const Discord = require("discord.js");

// Машрутизирует сообщение к команде
function handle(msg) {
    // Если это не команда, то ничего не делай
    if (!isCommand(msg))
        return;

    // Получает команду без префикса
    var command = msg.content.substring(prefix.length);

    // Получает функцию по команде
    var action = this[command];

    //Проверяет, что такая функция существует и вызывает её
    if (action != undefined)
        action(msg);
}

// Проверяет является ли это сообщение командой
function isCommand(msg) {
    return msg.content.startsWith(prefix);
}

function ping(msg) {
    msg.reply("Pong");
}

function about(msg){
    let sicon = msg.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#15f153")
    .setThumbnail(sicon)
    .addField("Server Name", msg.guild.name)
    .addField("Created On", msg.guild.createdAt)
    .addField("You Joined", msg.member.joinedAt)
    .addField("Total Members", msg.guild.memberCount);

    msg.channel.send(serverembed);
}

// Сюда добавлять новые команды-функции
module.exports = {
    handle: handle,
    ping: ping,
    about: about
};