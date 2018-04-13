const ytdl = require("ytdl-core");

module.exports = {
    /**
     * Play audio stream from URL in specified voice channel
     *
     * @param {String} msg
     * @param {String} url
     */
    startVoiceStream: function (msg, url) {

        let voiceChannel = msg.member.voiceChannel;
        let stream = ytdl(url, { filter: "audioonly" })
        let dispatcher = msg.guild.settings.get("dispatcher", undefined);
        let queue = msg.guild.settings.get("queue", []);
        let queueTitles = msg.guild.settings.get("queueTitles", [])

        // Invalid URL
        stream.on("error", (err) => {
            return msg.reply("The URL you entered was invalid.")
        })

        voiceChannel.join()
            .then(connection => {
                dispatcher = connection.playStream(stream, {volume: 0.5, passes: 3})
                msg.guild.settings.set("dispatcher", dispatcher);
                msg.channel.send("Now playing: **" + queueTitles[0] + "**");
                dispatcher.on('end', () => {
                    // Remove last played song from queue
                    queue.shift();
                    queueTitles.shift();
                    msg.guild.settings.set("queue", queue);
                    msg.guild.settings.set("queueTitles", queueTitles);

                    // Cleanup if there are no more songs in the queue
                    if (queue.length === 0) {
                        voiceChannel.leave();
                        // Clear dispatcher so other commands work correctly
                        dispatcher.destroy();
                        dispatcher = undefined;
                    } else {
                        // Play next song in queue
                        this.startVoiceStream(msg, queue[0]);
                    }
                })
            }
        ).catch(console.error);
    },
}