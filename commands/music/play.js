const commando = require("discord.js-commando");
const youtubedl = require("youtube-dl");
const players = require("../util/players");
const path = require("path");
const fs = require('fs');

module.exports = class PlayCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "play",
            group: "music",
            memberName: "play",
            description: "Plays the specfified URL in the user's current voice channel",
            args: [
                {
                    key: "url",
                    label: "URL",
                    prompt: "Enter a URL.",
                    type: "string"
                }
            ]
        })
    }

    async run(msg, args) {
        let url = args.url;
        if (!url.startsWith("http://")) url = `ytsearch:"${url}"`; // Search for video from YouTube
        let musicChannel = msg.guild.settings.get("musicChannel", true)
        let voiceChannel = msg.member.voiceChannel;
        let dispatcher = msg.guild.settings.get("dispatcher", undefined);
        let queue = msg.guild.settings.get("queue", [])
        let queueTitles = msg.guild.settings.get("queueTitles", [])

        // Do checks and stuff
        if ((!musicChannel) && (musicChannel != msg.channel.name)) {
            return msg.reply("Please use the #" + musicChannel + " channel to use music commands.");
        }

        if (queue.includes(url) && dispatcher !== undefined) {
            msg.react("❌");
            return msg.reply("Song already in queue!");
        }

        // Check if the user is in a voice channel
        if (!voiceChannel) {
            return msg.reply("You must be in a voice channel to use this command.")
        }

        // Remove paramaters from URL if there are any
        if (url.includes("&")) {
            url = url.substring(0, url.indexOf("&"))
        }

        // If the bot is not currently playing but has a queue (probably from an unclean shutdown), clear the queue
        if (dispatcher === undefined && queue) {
            queue = [];
            queueTitles = [];
        }

        youtubedl.getInfo(url, (err, info) => {
            if (err) return msg.reply("The URL you entered was invalid.");
            queue.push(url);
            queueTitles.push(info.title);
            msg.guild.settings.set("queue", queue);
            msg.guild.settings.set("queueTitles", queueTitles);
            if (queue.length > 1) {
                msg.react("✅");
                return msg.reply("Successfully added to queue: **" + info.title + "**");
            }
            msg.react("✅");
            players.startVoiceStream(msg, queue[0])
        })
    }
}