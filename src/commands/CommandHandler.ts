import * as Discord from 'discord.js';

abstract class CommandHandler {
    prefix: string;
    dialogs: any;

    constructor(prefix = "") {
        this.prefix = prefix;
        this.dialogs = {};
    }

    /**
     * Handles the message as input command or dialog arguement
     * @param {Discord.Message} message 
     */
    handle(message: Discord.Message) {
        let dialogState = this.dialogs[message.author.id];
        if (dialogState != undefined && dialogState.isComplete)
            dialogState = undefined;

        if (!isCommand(message, this.prefix) && dialogState == undefined)
            return;
        let command = message.content.substring(this.prefix.length);
        let args = getArguments(command) as Array<string>;
        let action = this[args[0]];
        args = args.slice(1);

        if (action !== undefined)
            this.dialogs[message.author.id] = action.call(this, message, args, dialogState);
    }
}

/**
 * Splits the complex input command to the logical words and phrases
 * @param {string} command Clear command without prefixes
 */
export function getArguments(command: string) {
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
export function isCommand(message: Discord.Message, prefix: string = "") {
    return message.content.startsWith(prefix) && message.content.length > prefix.length;
}

export default CommandHandler;
