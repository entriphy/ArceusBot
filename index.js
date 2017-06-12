const Discord = require("discord.js");
const client = new Discord.Client();

const Identity = require('./Identity');
const music = require("./Music");


client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    console.log("Logged into channels: " + client.channels.array());
});

client.on('message', msg => {
    if (msg.content.startsWith("!m")) {
        music.musicHandler(msg);
    }
});

client.login(Identity.token);