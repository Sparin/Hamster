"use strict";

const prefix = "!"
const Discord = module.require("discord.js");
const fs = require("fs");


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
// Простая команда ping-pong
function ping(msg) {
    msg.reply(msg.client.ping);
}
// Выдает информацию о боте
function about(msg) {
    let bicon = msg.client.user.displayAvatarURL;
    let serverembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor("#15f153")
        .setThumbnail(bicon)
        .addField("Server Name", msg.guild.name)
        .addField("Bot Name", msg.client.user.username)
        .addField("Created On", msg.client.user.createdAt);

    msg.channel.send(serverembed);
}
// Удаляет 100 последних сообщений
function clear(msg) {
    if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
        msg.reply("Nope!");
        console.log(msg.content);
    }
    else {
        msg.channel.fetchMessages({ limit: 100 })
            .then(messages => messages.forEach((item, i, array) => { item.delete(); }));

        msg.channel.send('chat is clear!')
    }

}
// Команда шаблон для создания (к релизу удалить!!!!)
function test(msg) {

  }
  


// Сюда добавлять новые команды-функции
module.exports = {
    handle: handle,
    ping: ping,
    about: about,
    clear: clear,
    test: test
};