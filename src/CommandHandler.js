const Discord = require("discord.js");

class CommandHandler {
    constructor(prefix="") {
        this.prefix = prefix;
        this.dialogs = {};
    }

    /**
     * Handles the message as input command or dialog arguement
     * @param {Discord.Message} message 
     */
    handle(message) {
        let dialogState = this.dialogs[message.author.id];
        if (dialogState != undefined && dialogState.isComplete)
            dialogState = undefined;

        if (!isCommand(message, this.prefix) && dialogState == undefined)
            return;

        let command = message.content.substring(this.prefix.length);
        let arguements = getArguements(command);
        let action = this[arguements[0]];
        arguements = arguements.slice(1);

        if (action != undefined)
            this.dialogs[message.author.id] = action(message, arguements, dialogState);
    }
}

// Incapsulated functions (private) for avoid RCE

/**
 * Splits the complex input command to the logical words and phrases
 * @param {string} command Clear command without prefixes
 */
function getArguements(command) {
    // Splits the complex input command to the logical words and phrases
    // 'clear "typical complex" sooqa' => ["clear", "typical complex", "sooqa"]
    const pattern = /("{1}[^"]*"{1}|-{1,2}\w+|\w+)/ig;

    let arguements = command.match(pattern);
    return arguements;
}

/**
 * Returns true if message is a command like
 * @param {Discord.Message} message Input raw message
 */
function isCommand(message, prefix = "") {
    return message.content.startsWith(prefix) && message.content.length > prefix.length;
}

module.exports = CommandHandler;