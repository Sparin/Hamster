const Discord = require("discord.js");
const CommandHandler = require("./CommandHandler");
const client = new Discord.Client


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
     * Clear last N messages in channel of caller
     * @param {Discord.Message} message 
     * @param {Array<string>} arguements
     */
    clear(message, arguements) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("no perms!.");
        if(!arguements[0]) return message.channel.send("!clear 1-100");
        message.channel.bulkDelete(arguements[0]).then(() => {
          message.channel.send(`Cleared ${arguements[0]} messages.`).then(msg => msg.delete(5000));
        });
    }

    /**
     * Kicked users !kick @user
     * @param {Discord.Message} message 
     * @param {Array<string>} arguements
     */
    kick(message, arguements) {
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguements[0]));
        if (!kUser) return message.channel.send("Can't find user!");
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No can do pal!");
        if (kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");
        let kickChannel = message.guild.channels.find(`name`, "bot-logs");
        if (!kickChannel) return message.channel.send("Can't find incidents channel.");
        let bUkick = message.author.username

        const kickEmbed = new Discord.RichEmbed()
        .setTitle(`${bUkick} kick ${kUser} user id`)
        .setAuthor(`Author: ${bUkick}`)
        .setColor(0x00AE86)
        .setDescription("kicked users")
        .setFooter(`created at`)
        .setTimestamp(`${message.createdAt}`)
        .addField("kicked",`${kUser}`)
        .addField("channel",`${message.channel}`)
        

        message.guild.member(kUser).kick();
        kickChannel.send(kickEmbed);
    }
      /**
     * Send message my info
     * @param {Discord.Message} message 
     */
    myinfo(message) {
        let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription("this is the user's info!")
        .setColor("#4834d4")
        .addField("Full Username", `${message.author.username}#${message.author.discriminator}`, true)
        .addField("ID", message.author.id, true)
        .addField("Created At", message.author.createdAt, true)
        .setThumbnail(message.author.avatarURL);
    
        message.channel.sendEmbed(embed);
    
    }
}

module.exports = ExampleHandler;