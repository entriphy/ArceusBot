const commando = require("discord.js-commando");
const wiki = require('wikijs').default;
const Discord = require("discord.js");

module.exports = class WikipediaCommand extends commando.Command {
    constructor(client) {
        super (client, {
            name: "wikipedia",
            group: "fun",
            memberName: "wikipedia",
            description: "Searches for an article on Wikipedia and responds with the summary",
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
        let embed = new Discord.RichEmbed()
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
        }, () => {
            return msg.reply("An article with that name was not found.")
        });
    }
}