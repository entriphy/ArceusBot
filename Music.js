const youtubedl = require('youtube-dl');
const Config = require('./Config');
const client = require('./index').client;

var dispatcher;
var queue = [];
var queueTitles = [];

/**
 * Play audio stream from URL in specified voice channel
 *
 * @param {String} url
 * @param {VoiceChannel} voiceChannel
 * @param {TextChannel} textChannel
 */
function startVoiceStream(url, voiceChannel, textChannel) {

    // Get audio stream information using node-youtube-dl
    var stream = youtubedl(url, ["-f", "bestaudio"], {maxBuffer: 1024 * 500});

    stream.on('info', function (info) {
        // Join voice channel
        voiceChannel.join()
            .then(connection => {
                textChannel.send("Now playing: **" + info.title + "** (" + info.webpage_url + ") in voice channel **" +
                    voiceChannel.name + "**.");
                // Set game title to current song title
                client.user.setGame(info.title);

                // Play audio in voice channel and all that stuff
                dispatcher = connection.playStream(stream);
                dispatcher.setVolume(Config.defaultVolume);
                dispatcher.on('end', () => {
                    // Remove last played song from queue
                    queue.shift();
                    queueTitles.shift();

                    // Cleanup if there are no more songs in the queue
                    if (queue.length === 0) {
                        client.user.setGame("");
                        voiceChannel.leave();
                        // Clear dispatcher so other commands work correctly
                        dispatcher = undefined;
                    } else {
                        // Play next song in queue
                        startVoiceStream(queue[0], voiceChannel, textChannel);
                    }
                })
            })
    });

}

module.exports = {
    musicHandler: function(msg) {
        // Handle music command whitelisting
        if (Config.musicChannel !== true) {
            if (Config.musicChannel === false) {
                return msg.reply("Music commands are currently disabled.");
            }

            if (msg.channel.name !== Config.musicChannel) {
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

            // Prevent duplicate songs in the queue
            if (queue.includes(url)) {
                msg.react("❌");
                return msg.reply("Song already in queue!");
            }

            // Get voice channel to join
            const voiceChannel = msg.member.voiceChannel;

            // Return if the user is not in a voice channel
            if (!voiceChannel) {
                msg.react("❌");
                return msg.reply("Please be in a valid voice channel.");
            }

            msg.reply("Getting video/audio information...");

            youtubedl.getInfo(url, null, {maxBuffer: 1024 * 500}, function (err, info) {
                if (err) {
                    // Invalid or unsupported link
                    msg.react("❌");
                    return msg.reply("Please enter a valid link")
                }
                else {
                    queue.push(url);
                    queueTitles.push(info.title);
                    if (queue.length > 1) {
                        msg.react("✅");
                        return msg.reply("Successfully added to queue: **" + info.title + "**");
                    }
                    msg.react("✅");
                    startVoiceStream(queue[0], voiceChannel, msg.channel);
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

        /* !m_stop + !m_skip command */
        if (msg.content.startsWith("!m_stop") || msg.content.startsWith("!m_skip")) {
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
            dispatcher.end();
        }

        /* !m_clear command */
        if (msg.content.startsWith("!m_clear")) {
            // Return if there's no audio playing
            if (dispatcher === undefined) {
                return msg.reply("No audio is currently playing.")
            }

            // Clear queue
            queue = [];

            msg.reply("Clearing queue and stopping audio playback...");
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

        /* !m_queue command */
        if (msg.content.startsWith("!m_queue")) {
            // Return if there are no songs in the queue
            if (queueTitles.length === 0) {
                return msg.reply("There were no songs found in the queue.");
            }

            // Get all songs in the queue
            var currentQueue = "";
            for (var i = 0; i < queueTitles.length; i++) {
                currentQueue += "**[" + i + "]** " + queueTitles[i] + "\n";
            }

            msg.reply("**Queue:**\n" + currentQueue);
        }
    }
};