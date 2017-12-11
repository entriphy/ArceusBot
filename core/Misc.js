module.exports = {
    clean: function(msg) {
        // Get argument, convert to integer
        var _messages = msg.content.substring(7);
        var messages = parseInt(_messages);

        // If argument given was not a valid number
        if (isNaN(messages) || messages === 0 || messages > 99) {
            return msg.reply("Please enter a valid, numerical value (at least 1, fewer than 100).")
        }

        // If argument is 1, use msg.delete
        if (messages === 1) {
            msg.delete(2)
                .catch(console.error);
            return msg.reply("Deleted 1 message. " +
                "```" + msg.author.username + ": " + msg.content + "```");
        }

        // If argument is 2 or higher, use msg.channel.bulkDelete
        if (messages >= 2 && messages < 100) {
            msg.channel.bulkDelete(messages + 1)
                .catch(console.error);
            msg.reply("Cleaned last " + messages + " messages. " +
                "```" + msg.author.username + ": " + msg.content + "```");
        }
    }


};