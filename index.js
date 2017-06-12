const Discord = require("discord.js");
const client = new Discord.Client();

const Config = require('./Config');
const music = require("./Music");
const misc = require("./Misc");


client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    console.log("Logged into channels: " + client.channels.array());
});

client.on('message', msg => {
    if (msg.content.startsWith("!m")) {
        music.musicHandler(msg);
    }
    if (msg.content.startsWith("!clean")) {
        misc.clean(msg);
    }
});

client.login(Config.token);