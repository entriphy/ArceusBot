const youtubedl = require('youtube-dl');
const Config = require('./Config')

var dispatcher;


module.exports = {
    musicHandler: function(msg) {
        if (Config.musicChannel !== undefined) {
            if (msg.channel.name !== Config.musicChannel) {
                return msg.reply("You must be in the #" + Config.musicChannel + " channel for music commands to work.")
            }
        }

        if (msg.content.startsWith("!m_play")) {
            var url = msg.content.substring(8);
            if (url.includes("&")) {
                url.substring(0, url.indexOf("&"))
            }

            const voiceChannel = msg.member.voiceChannel;

            if (!voiceChannel) {
                return msg.reply("Please be in a valid voice channel.");
            }

            voiceChannel.join()
                .then(connection => {
                    youtubedl.getInfo(url, function (err, info) {
                        if (err) {
                            return msg.reply("Please enter a valid link")
                        }
                        else {
                            var stream = youtubedl(url);

                            stream.on('info', function (info) {
                                console.log(stream);
                                console.log(info);
                                msg.reply("Now playing: " + info.title);

                                dispatcher = connection.playStream(stream);
                                dispatcher.setVolume(Config.defaultVolume);
                                dispatcher.on('end', () => {
                                    voiceChannel.leave();
                                })
                            });
                        }
                    });
                });
        }

        if (msg.content.startsWith("!m_pause")) {
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            msg.reply("Pausing audio playback... (use \"!m_resume\" to resume playback)");
            dispatcher.pause();
        }

        if (msg.content.startsWith("!m_resume")) {
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            msg.reply("Resuming audio playback...");
            dispatcher.resume();
        }

        if (msg.content.startsWith("!m_stop")) {
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            msg.reply("Stopping audio playback...");
            dispatcher.end();
        }

        if (msg.content.startsWith("!m_volume")) {
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            if (msg.content.includes("default")) {
                dispatcher.setVolume(Config.defaultVolume);
                return msg.reply("Setting volume to default (" + Config.defaultVolume * 100 + "%)...")
            }

            if (msg.content.includes(".")) {
                var volume = parseFloat(msg.content.substring(10))
            } else var volume = parseInt(msg.content.substring(10));

            if (volume < 0) {
                return msg.reply("Negative volume? I don't know how to do that.");
            }

            if (isNaN(volume)) {
                return msg.reply("Please enter a numerical value.")
            }
            
            msg.reply("Setting volume of audio playback to " + volume * 100 + "%...");
            dispatcher.setVolume(volume);
        }
    }
};