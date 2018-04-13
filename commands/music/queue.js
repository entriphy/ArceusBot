const commando = require("discord.js-commando");

module.exports = class QueueCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "queue",
            group: "music",
            memberName: "queue",
            description: "Prints the current queue for the audio stream",
        })
    }

    async run(msg) {
        let voiceChannel = msg.member.voiceChannel;
        let queue = msg.guild.settings.get("queue", [])
        let queueTitles = msg.guild.settings.get("queueTitles", "")

        // Return if there are no songs in the queue
        if (queueTitles.length === 0) {
            return msg.reply("There were no songs found in the queue.");
        }

        // Get all songs in the queue
        let currentQueue = "";
        for (var i = 0; i < queueTitles.length; i++) {
            currentQueue += "**[" + i + "]** " + queueTitles[i] + "\n";
        }

        msg.reply("**Queue:**\n" + currentQueue);
    }
}