const Discord = require("discord.js");
const client = new Discord.Client();
exports.client = client;
const process = require('process');

const configFile = require("./config");
const Config = require('./core/Config');
const music = require("./core/Music");
const misc = require("./core/Misc");

function checkConfig(callback) {
    // Check if defaultVolume is an integer/float
    var defaultVolume;

    if (String(configFile.defaultVolume).includes(".")) {
        defaultVolume = parseFloat(configFile.defaultVolume);
    } else defaultVolume = parseInt(configFile.defaultVolume);
    if (isNaN(defaultVolume)) {
        console.log("Please enter a correct value for option 'defaultVolume' (must be a number)");
        process.exit(1);
    }

    callback();
}

function cleanup() {
    console.log("Logging out...");
    client.destroy().then(process.exit(0))
}

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    console.log("Logged into " + client.guilds.array().length + " channels!");
});

client.on('message', msg => {
    if (msg.content.startsWith("!m")) {
        music.musicHandler(msg);
    }
    if (msg.content.startsWith("!clean")) {
        misc.clean(msg);
    }
    if (msg.content.startsWith("!config")) {
        Config.configHandler(msg);
    }
});

// On Ctrl+C, cleanly shutdown
process.on('SIGINT', cleanup.bind(true));

checkConfig(function() {
    client.login(configFile.token);
});