const Config = require('../config');

module.exports = {
    configHandler: function(msg) {
        // Get config option the user wants to change
        var option = msg.content.substring(8, msg.content.indexOf(" ", 8));
        // If user did not specify an argument
        if (option === "!config ") {
            // TODO: Cleaner version of whatever this is
            option = msg.content.substring(8);
        }

        /* musicChannel config */
        if (option === "musicChannel") {
            var tchannel = msg.content.substring(21);

            // Give user command reference if an argument wasn't given
            if (tchannel === "" || tchannel === null) {
                var _whitelistChannel = this.musicChannel;
                if (_whitelistChannel === true) { _whitelistChannel = "ALL" }
                if (_whitelistChannel === false) {_whitelistChannel = "NONE"}
                return msg.reply("```musicChannel - Set music channel to whitelist. Current: " + _whitelistChannel + "```");
            }

            // Set whitelisted channel to none (disable music commands)
            if (tchannel === "NONE") {
                this.musicChannel = false;
                return msg.reply("musicChannel: Setting music command whitelist to NONE.");
            }

            // Set whitelisted channel to all (enable music commands across all channels)
            if (tchannel === "ALL") {
                this.musicChannel = true;
                return msg.reply("Setting music command whitelist to ALL channels.");
            }

            // Set whitelisted channel to what the user specifies
            else {
                this.musicChannel = tchannel;
                return msg.reply("Setting music command whitelist to #" + tchannel + ".");
            }
        }

        /* defaultVolume config */
        if (option === "defaultVolume") {
            var volume = msg.content.substring(22);

            // Give user command reference if an argument wasn't given
            if (volume === "" || volume === null) {
                var _volume = this.defaultVolume;
                if (_volume === true) { _volume = "ALL" }
                if (_volume === false) {_volume = "NONE"}
                return msg.reply("```defaultVolume - Set default volume of audio playback. Current: " + _volume + "```");
            }

            // Turn volume argument into integer/float
            if (volume.includes(".")) {
                volume = parseFloat(volume);
            } else volume = parseInt(volume);

            // Return if volume is NaN
            if (isNaN(volume)) {
                return msg.reply("**defaultVolume:** Please enter a numerical value.")
            }

            // Return if volume is negative
            if (volume < 0) {
                return msg.reply("**defaultVolume:** Negative volume? I don't know how to do that.")
            }

            // Set default volume config
            this.defaultVolume = volume;
            msg.reply("**defaultVolume:** Setting default music volume to **" + volume * 100 + "%**...")
        }
    }
}