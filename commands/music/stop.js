const commando = require("discord.js-commando");

module.exports = class StopCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "stop",
            group: "music",
            memberName: "stop",
            description: "Stops audio playback in the voice channel",
            aliases: ["skip"]
        })
    }

    async run(msg) {
        let voiceChannel = msg.member.voiceChannel;
        let dispatcher = msg.guild.settings.get("dispatcher", undefined);
        let queue = msg.guild.settings.get("queue", [])

        // Check if the user is in a voice channel
        if (!voiceChannel) {
            return msg.reply("You must be in a voice channel to use this command.")
        }

        // Return if there's no audio playing
        if (dispatcher === undefined) {
            return msg.reply("No audio is currently playing.")
        }

        // Change reply based on if there's a song left in the queue
        if (queue.length === 1) {
            msg.reply("No more songs left in queue; stopping audio playback...")
        } else {
            msg.reply("Skipping current song...");
        }
        dispatcher.destroy();
        msg.guild.settings.set("dispatcher", dispatcher);
    }
}