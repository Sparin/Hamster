"use strict";

const prefix = "!"
const Discord = require("discord.js");

var dialogs = {};

function clear(msg, state) {
    if (state == undefined) //если состояния не было, создай новое
        state = {
            command = "clear",
            isComplete = false,
            isNumberAsked = false
        }

    if (!state.isNumberAsked) {
        msg.reply("How many?") //спрашиваем сколько
        state.isNumberAsked = true;
        return state; // возвращаем обновленное состояние
    }

    let number = msg.content; // следующее сообщение по идее должно быть числом. 
    // проверь что это число

    // сделай действия, которые хочешь

    // возвращай состояние, обозначив, что диалог закончен
    state.isComplete = true;
    return state; 
}

function handle(msg) {
    var dialogState = dialogs[msg.author.id];
    if (dialogState != undefined) {
        if (dialogState.isComplete)  // Диалог завершен?
            dialogs[msg.author.id] = undefined; // Да - поставить, что диалога больше нет
        else
            dialogs[msg.author.id] = this[dialog.command](msg, dialogState);
        //Вызываем команду, подставляя state, и обновляем её в буфере
        //Команда должна возвратить состояние (state)!

        //Ничего не делай
        return;
    }

    if (!isCommand(msg))
        return;

    var command = msg.content.substring(prefix.length);
    var action = this[command];

    //Проверяет, что такая функция существует и вызывает её
    if (action != undefined)
        action(msg);
}

// Проверяет является ли это сообщение командой
function isCommand(msg) {
    return msg.content.startsWith(prefix);
}

/**
 * 
 * @param {Discord.Message} msg 
 */
function ping(msg) {
    msg.reply("Pong");
}

function about(msg) {
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