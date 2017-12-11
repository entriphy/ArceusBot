const config = require("../config");
const googleImages = require("google-images");
const wiki = require('wikijs').default;
var client;
if (config.googleCSE && config.googleCSE_APIKey) {
    client = new googleImages(config.googleCSE, config.googleCSE_APIKey);
}
const Discord = require("discord.js");

module.exports = {
    imageHandler: function(msg) {
        if (!client) return msg.reply("Google Custom Search is not set up properly.");
        const query = msg.content.substring(7);
        // ignore this lol
        if (msg.author.username === "WillyJ") { return msg.reply("No.") }
        client.search(query).then(images => msg.channel.send(images[0].url));
    },

    wikipediaHandler: function(msg) {
        var query = msg.content.substring(11);
        var embed = new Discord.RichEmbed()
            .setColor(0xFAFAFA)
            .setAuthor("Wikipedia", "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png")
            .setImage("https://n6-img-fp.akamaized.net/free-icon/wikipedia-logo_318-50187.jpg?size=180&ext=png");

        wiki().page(query).then(page => {
            embed.setTitle(page.raw.title).setURL(page.raw.canonicalurl);

            page.summary().then(summary => {
                if (summary.length > 1000) {summary = summary.substring(0, 1000) + "..."; }
                embed.setDescription(summary);

                page.mainImage().then(mainImage => {
                    embed.setThumbnail(mainImage);
                    msg.channel.send({embed});
                });
            });
        }, function() {
            return msg.reply("An article with that name was not found.")
        });
    }
};
