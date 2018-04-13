const commando = require("discord.js-commando");

module.exports = class CleanCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "clean",
            group: "moderation",
            memberName: "clean",
            description: "Cleans the last messages based on the number given",
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"],
            args: [{
                key: "messages",
                label: "number of messages to clean",
                prompt: "Enter the number of messages to clean.",
                type: "integer",
                max: "99"
            }]
        })
    }

    async run(msg, args) {
        let messages = args.messages;

        msg.channel.bulkDelete(messages + 2)
            .catch(console.error);
        msg.reply("Cleaned " + messages + " message(s). " +
            "```" + msg.author.username + ": " + msg.content + "```");
    }
}