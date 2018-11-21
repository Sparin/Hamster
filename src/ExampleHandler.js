const Discord = require("discord.js");
const CommandHandler = require("./CommandHandler");

class ExampleHandler extends CommandHandler {
    constructor(prefix) {
        super(prefix);
    }

    /**
     * Prints the client's latency
     * @param {Discord.Message} message 
     */
    ping(message) {
        message.reply(message.client.ping);
    }

    /**
     * Print's description of the bot
     * @param {Discord.Message} message 
     */
    about(message) {
        let bicon = message.client.user.displayAvatarURL;
        let serverembed = new Discord.RichEmbed()
            .setDescription("Bot Information")
            .setColor("#15f153")
            .setThumbnail(bicon)
            .addField("Server Name", message.guild.name)
            .addField("Bot Name", message.client.user.username)
            .addField("Created On", message.client.user.createdAt);

        message.channel.send(serverembed);
    }

    /**
     * Clear last 100 message in channel of caller
     * @param {Discord.Message} message 
     * @param {Array<string>} arguements
     */
    clear(message, arguements) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.reply("Nope!");
        }
        else {
            let numberToDelete = 0;
            if (arguements.length == 0) {
                message.reply("specify number of message to clean. For example: !clear 100");
                return;
            }
            else {
                numberToDelete = parseInt(arguements[0]);
                if (Number.isNaN(numberToDelete)) {
                    message.reply("пошел нахуй");
                    return;
                }
            }

            message.channel.fetchMessages({ limit: numberToDelete })
                .then(messages => messages.forEach((item, i, array) => { item.delete(); }));

            message.channel.send('chat is clear!')
        }
    }

    /**
     * Маша очень просит не удалять, потому что ей лениво прописывать и удалять каждый раз эту команду. Вооооут ._.
     * @param {Discord.Message} message 
     */
    test(message) {

    }
}

module.exports = ExampleHandler;