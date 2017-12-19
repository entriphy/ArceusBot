const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
exports.client = client;
const process = require('process');

const configFile = require("./config");
const Config = require('./core/Config');
const music = require("./core/Music");
const misc = require("./core/Misc");
const google = require("./core/Google");

function cleanup() {
    console.log("Logging out...");
    client.destroy().then(process.exit(0))
}

function checkForUpdates() {
    if (configFile.checkForUpdates === false) return;
    console.log("Checking for updates...");
    if (fs.existsSync(".git")) {
        const fetch = require("child_process").execSync("git fetch origin", {stdio: "ignore"});
        const localCommit = require("child_process").execSync("git rev-parse HEAD").toString().trim();
        const latestCommit = require("child_process").execSync("git rev-parse origin/master").toString().trim();
        if (localCommit !== latestCommit) {
            let answer = require("readline-sync").question("A newer commit is available! Would you like to update? [y/n] ");
            if (answer.toLowerCase() === "y") {
                console.log("Updating to latest commit...");
                const pull = require("child_process").execSync("git reset --hard origin/master", {stdio: "ignore"});
                console.log("Update finished! Please relaunch the bot.");
                process.exit(0);
            }
            else return;
        }
        else console.log("The bot is up-to-date!");
    }
}

client.on('ready', () => {
    console.log("Making sure all configs are ready...");
    for (var i = 0; i < client.guilds.array().length; i++) {
        const id = client.guilds.array()[i].id;
        fs.exists("configs/" + id + ".json", function(exists) {
            if (!exists) {
                // Create configs if they don't exist
                fs.createReadStream("./configs/default.json").pipe(fs.createWriteStream("./configs/" + id +".json"))
            }
        })
    }

    console.log("Logged in as " + client.user.tag + "!");
    console.log("Logged into " + client.guilds.array().length + " channels!");
});

client.on("guildCreate", guild => {
    const id = guild.id;
    fs.exists("configs/" + id + ".json", function(exists) {
        if (!exists) {
            // Create config if it doesn't exist
            console.log("[config] Creating " + id + ".json...");
            fs.createReadStream("./configs/default.json").pipe(fs.createWriteStream("./configs/" + id +".json"))
        }
    })
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
    if (msg.content.startsWith("!image")) {
        google.imageHandler(msg);
    }
    if (msg.content.startsWith("!wikipedia")) {
        google.wikipediaHandler(msg);
    }
});

// On Ctrl+C, cleanly shutdown
process.on('SIGINT', cleanup.bind(true));

// Check for updates
checkForUpdates();

// Check for updates and login bot to Discord!
client.login(configFile.token)