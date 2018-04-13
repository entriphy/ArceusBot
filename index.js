const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const sqlite = require("sqlite");
const Commando = require("discord.js-commando");
const process = require('process');
const configFile = require("./config");

let client = new Commando.Client({
    owner: "131288302476197888"
});
client.registry.registerGroups([
	["fun", "Fun/other commands"],
	["moderation", "Moderation commands"],
	["music", "Music commands"],
]).registerDefaults().registerCommandsIn(path.join(__dirname, "commands"));
client.setProvider(sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))).catch(console.error);

// process.on('unhandledRejection', (error) => {
//     console.log('unhandledRejection', console.error(error));
// });

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
                const pull = require("child_process").execSync("git reset --mixed origin/master", {stdio: "ignore"});
                console.log("Update finished! Please relaunch the bot.");
                process.exit(0);
            }
            else return;
        }
        else console.log("The bot is up-to-date!");
    }
}

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + " on " + client.guilds.array().length + " channels!");
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

// On Ctrl+C, cleanly shutdown
process.on('SIGINT', cleanup.bind(true));

// Check for updates (if enabled)
checkForUpdates();

// Login bot to Discord!
client.login(configFile.token)