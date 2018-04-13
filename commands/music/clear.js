const commando = require("discord.js-commando");

module.exports = class ClearCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "clear",
            group: "music",
            memberName: "clear",
            description: "Clears the music playlist and stops audio playback",
        })
    }

    async run(msg) {
        let voiceChannel = msg.member.voiceChannel;
        let dispatcher = msg.guild.settings.get("dispatcher", undefined);
        let queue = msg.guild.settings.get("queue", []);
        let queueTitles = msg.guild.settings.get("queueTitles", []);
        
        // Check if the user is in a voice channel
        if (!voiceChannel) {
            return msg.reply("You must be in a voice channel to use this command.")
        }

        if (dispatcher === undefined && queue.length === 0) {
            return msg.reply("No audio is currently playing.")
        }

        if (queue.length !== 0) {
            msg.reply("Clearing queue and stopping any audio playback...");
            queue = [];
            queueTitles = [];
            msg.guild.settings.set("queue", queue);
            msg.guild.settings.set("queueTitles", queueTitles)
            if (dispatcher !== undefined) dispatcher.destroy(); msg.guild.settings.set("dispatcher", dispatcher);
        } else {
            return msg.reply("There's nothing in the queue.")
        }
    }
}