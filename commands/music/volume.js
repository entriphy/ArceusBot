const commando = require("discord.js-commando");

module.exports = class VolumeCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "volume",
            group: "music",
            memberName: "volume",
            description: "Changes the volume of the current audio stream",
            args: [{
                key: "volume",
                label: "Volume",
                prompt: "Enter a numerical value to change the volume.",
                type: "float"
            }]
        })
    }

    async run(msg, args) {
        let voiceChannel = msg.member.voiceChannel;
        let dispatcher = msg.guild.settings.get("dispatcher", undefined);
        let volume = args.volume;
        
        // Check if the user is in a voice channel
        if (!voiceChannel) {
            return msg.reply("You must be in a voice channel to use this command.")
        }

        // Set playback volume
        msg.reply("Setting volume of audio playback to " + volume * 100 + "%...");
        dispatcher.setVolume(volume);
        msg.guild.settings.set("dispatcher", dispatcher);
    }
}