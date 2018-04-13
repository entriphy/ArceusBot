const commando = require("discord.js-commando");
const config = require("../../config");
const googleImages = require("google-images");
let client;
if (config.googleCSE && config.googleCSE_APIKey) {
    client = new googleImages(config.googleCSE, config.googleCSE_APIKey);
}

module.exports = class ImageCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "image",
            group: "fun",
            memberName: "image",
            description: "Searches for an image and replies with the result",
            argsCount: 1,
            args: [{
                key: "query",
                label: "query",
                prompt: "Enter your search query.",
                type: "string",
            }]
        })
    }

    async run(msg, args) {
        let query = args.query;

        if (!client) return msg.reply("Google Custom Search is not set up properly.");
        client.search(query).then(images => msg.channel.send(images[0].url));
    }
}