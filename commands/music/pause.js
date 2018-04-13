const commando = require("discord.js-commando");

module.exports = class ClearCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "pause",
            group: "music",
            memberName: "pause",
            description: "Pauses the current audio playback",
        })
    }

    async run(msg) {
        let dispatcher = msg.guild.settings.get("dispatcher", undefined);
        let voiceChannel = msg.member.voiceChannel;
        
        // Check if the user is in a voice channel
        if (!voiceChannel) {
            return msg.reply("You must be in a voice channel to use this command.")
        }

        // Return if there's no audio playing
        if (dispatcher === undefined) {
            return msg.reply("No audio is currently playing.")
        }

        msg.reply("Pausing audio playback... (use \"!resume\" to resume playback)");
        dispatcher.pause();
        msg.guild.settings.set("dispatcher", dispatcher).catch();
    }
}