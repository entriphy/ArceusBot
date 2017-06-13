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

        /* !m_play command */
        if (msg.content.startsWith("!m_play")) {
            // Get user-specified URL
            var url = msg.content.substring(8);

            // In the case there's a parameter in the URL
            if (url.includes("&")) {
                url.substring(0, url.indexOf("&"))
            }

            // Get voice channel to join
            const voiceChannel = msg.member.voiceChannel;

            // Return if the user is not in a voice channel
            if (!voiceChannel) {
                return msg.reply("Please be in a valid voice channel.");
            }

            msg.reply("Getting video/audio information...");

            youtubedl.getInfo(url, function (err, info) {
                if (err) {
                    // Invalid or unsupported link
                    return msg.reply("Please enter a valid link")
                }
                else {
                    // Get audio stream information using node-youtube-dl
                    var stream = youtubedl(url);

                    // Wait until stream loads
                    stream.on('info', function (info) {
                        // Join voice channel
                        voiceChannel.join()
                            .then(connection => {
                                msg.reply("Now playing: **" + info.title + "** in voice channel **" +
                                    msg.member.voiceChannel.name + "**.");

                                // Play audio in voice channel and all that stuff
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

        /* !m_pause command */
        if (msg.content.startsWith("!m_pause")) {
            // Return if there's no audio playing
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            msg.reply("Pausing audio playback... (use \"!m_resume\" to resume playback)");
            dispatcher.pause();
        }

        /* !m_resume command */
        if (msg.content.startsWith("!m_resume")) {
            // Return if there's no audio playing
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            msg.reply("Resuming audio playback...");
            dispatcher.resume();
        }

        /* !m_stop command */
        if (msg.content.startsWith("!m_stop")) {
            // Return if there's no audio playing
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            msg.reply("Stopping audio playback...");
            dispatcher.end();
        }

        /* !m_volume command */
        if (msg.content.startsWith("!m_volume")) {
            // Return if there's no audio playing
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            // Set audio to default
            if (msg.content.includes("default")) {
                dispatcher.setVolume(Config.defaultVolume);
                return msg.reply("Setting volume to default (" + Config.defaultVolume * 100 + "%)...")
            }

            // Parse to integer/float depending on what the user inputted
            if (msg.content.includes(".")) {
                var volume = parseFloat(msg.content.substring(10))
            } else var volume = parseInt(msg.content.substring(10));

            // Return if the number is negative
            if (volume < 0) {
                return msg.reply("Negative volume? I don't know how to do that.");
            }

            // Return if the number is not actually a number ( ͡° ͜ʖ ͡°)
            if (isNaN(volume)) {
                return msg.reply("Please enter a numerical value.")
            }

            // Set playback volume
            msg.reply("Setting volume of audio playback to " + volume * 100 + "%...");
            dispatcher.setVolume(volume);
        }

        /* !m_volume command */
        if (msg.content.startsWith("!m_whitelist")) {
            var tchannel = msg.content.substring(13);

            // Give user command reference if an argument wasn't given
            if (tchannel === "" || tchannel === null) {
                var _whitelistChannel = Config.musicChannel;
                if (_whitelistChannel === undefined) { _whitelistChannel = "ALL" }
                if (_whitelistChannel === null) {_whitelistChannel = "NONE"}
                return msg.reply("```!m_whitelist - Set music channel to whitelist. Current: " + _whitelistChannel + "```");
            }

            // Set whitelisted channel to none (disable music commands)
            if (tchannel === "NONE") {
                Config.musicChannel = null;
                return msg.reply("Setting music command whitelist to NONE.");
            }

            // Set whitelisted channel to all (enable music commands across all channels)
            if (tchannel === "ALL") {
                Config.musicChannel = undefined;
                return(msg.reply("Setting music command whitelist to ALL channels."));
            }

            // Set whitelisted channel to what the user specifies
            else {
                Config.musicChannel = tchannel;
                return msg.reply("Setting music command whitelist to #" + tchannel + ".");
            }
        }
    }
};