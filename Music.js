const youtubedl = require('youtube-dl');
const Config = require('./Config')

var dispatcher;


module.exports = {
    musicHandler: function(msg) {
        if (Config.musicChannel !== undefined) {
            if (Config.musicChannel === null && !msg.content.startsWith("!m_whitelist")) {
                return msg.reply("Music commands are currently disabled.");
            }
            if (msg.channel.name !== Config.musicChannel && !msg.content.startsWith("!m_whitelist")) {
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

            msg.reply("Getting video/audio information...");

            youtubedl.getInfo(url, function (err, info) {
                if (err) {
                    return msg.reply("Please enter a valid link")
                }
                else {
                    var stream = youtubedl(url);

                    stream.on('info', function (info) {
                        voiceChannel.join()
                            .then(connection => {
                                msg.reply("Now playing: " + info.title);

                                dispatcher = connection.playStream(stream);
                                dispatcher.setVolume(Config.defaultVolume);
                                dispatcher.on('end', () => {
                                    voiceChannel.leave();
                                })
                            })
                    });
                }
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

        if (msg.content.startsWith("!m_whitelist")) {
            var tchannel = msg.content.substring(13);

            if (tchannel === "" || tchannel === null) {
                var _whitelistChannel = Config.musicChannel;
                if (_whitelistChannel === undefined) { _whitelistChannel = "ALL" }
                if (_whitelistChannel === null) {_whitelistChannel = "NONE"}
                return msg.reply("```!m_whitelist - Set music channel to whitelist. Current: " + _whitelistChannel + "```");
            }

            if (tchannel === "NONE") {
                Config.musicChannel = null;
                return msg.reply("Setting music command whitelist to NONE.");
            }

            if (tchannel === "ALL") {
                Config.musicChannel = undefined;
                return(msg.reply("Setting music command whitelist to ALL channels."));
            }

            else {
                Config.musicChannel = tchannel;
                return msg.reply("Setting music command whitelist to #" + tchannel + ".");
            }
        }
    }
};