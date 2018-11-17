"use strict";

const prefix = "!"

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
    msg.reply("Hi! My name is Hamster and I'm ready to serve you!");
}

// Сюда добавлять новые команды-функции
module.exports = {
    handle: handle,
    ping: ping,
    about: about
};