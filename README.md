# ArceusBot - A Node.js-based Discord bot

## Usage
### Requirements:
* [Node.js](https://nodejs.org/en/)
* Discord Bot Token (from [here](https://discordapp.com/developers/applications/me))

### To start:
In a terminal session: 

```bash
$ git clone https://github.com/evilarceus/ArceusBot
$ cd ArceusBot/
$ npm install
$ npm start
```

## Commands
### Music Commands
* ```!m_play <link>``` - Play audio from link on current voice channel
    * You can search for a certain song by using "ytsearch:search_query" instead of a link
* ```!m_pause``` - Pause current audio playback
* ```!m_resume``` - Resume audio playback
* ```!m_stop``` - Stop audio playback
* ```!m_volume <number>``` - Set volume of current audio playback
* ```!m_whitelist <channel>``` - Set whitelisted channel for music commands
    * Can be set to NONE and ALL channels (case-sensitive)

### Miscellaneous
* ```!clean <messages>``` - Delete last specified number of messages
