const Discord = require("discord.js");
const CommandHandler = require("./CommandHandler");

class ExampleHandler extends CommandHandler {
    constructor(prefix) {
        super(prefix);
    }

    /**
     * 
     * @param {Discord.Message} message 
     */
    ping(message) {
        message.reply("Pong");
    }

    /**
     * 
     * @param {Discord.Message} message 
     */
    about(message) {
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
            .setDescription("Bot Information")
            .setColor("#15f153")
            .setThumbnail(sicon)
            .addField("Server Name", message.guild.name)
            .addField("Created On", message.guild.createdAt)
            .addField("You Joined", message.member.joinedAt)
            .addField("Total Members", message.guild.memberCount);

        message.channel.send(serverembed);
    }
}

module.exports = ExampleHandler;