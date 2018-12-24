const Discord = require("discord.js");
const CommandHandler = require("./CommandHandler");
const client = new Discord.Client

class GroupManagementHandler extends CommandHandler {
    constructor(prefix) {
        super(prefix);
    }

    /**
     * Возвращает список доступных ролей
     * @param {Discord.Message} message 
     * @param {Array<string>} arguements 
     */
    games(message, arguements) {
        let template = `type "${this.prefix}game <name>" to get notifications on this group :D\r\n`;
        message.guild.roles.forEach(element => {
            if (element.name != "@everyone" && element.editable)
                template += element.name + "\r\n";
        });
        message.reply(template);
    }

    /**
     * Выдает роль по названию
     * @param {Discord.Message} message
     * @param {Array<string>} arguements
     */
    async game(message, arguements) {
        let roleName = arguements.join(" ");
        let role = message.guild.roles.find(role => role.name === roleName);
        let member = message.member;

        if (role == null) {
            await message.reply("there is no game with that name :C");
            return;
        }

        if (!member.roles.has(role.id)) {
            await member.addRole(role, `User with name ${message.author.name} asked to add game ${role.name}`);
            await message.reply(`asked to add role ${role.name}`);
        }
        else {
            await member.removeRole(role, `User with name ${message.author.name} asked to remove game ${role.name}`);
            await message.reply(`asked to remove role ${role.name}`);
        }
    }
}

module.exports = GroupManagementHandler;