'use strict';

var telegram = require('../bot/telegram.js');

exports.function = function(req, response) {
<<<<<<< HEAD
	console.log("Request handler function was called.");
	response.writeHead(200, {"Content-Type": "application/json"});
	var otherArray = ["item1", "item2"];
	var otherObject = { item1: "ciao come stai qui tutt", item2: "item2val" };
=======
	console.log("Request handler list_all_tasks was called.");
	response.writeHead(200, {"Content-Type": "application/json"});
	var otherArray = ["item1", "item2"];
	var otherObject = { item1: "item1val", item2: "item2val" };
>>>>>>> 6673c6f... .
	var json = JSON.stringify({
	anObject: otherObject,
	anArray: otherArray,
	another: "item"
	});
	response.end(json);

	//res.json(task);
};

exports.start = function(req, res, next) {

    var telegramUpdate = req.body;

    var telegramMessage = telegramUpdate.message.text;
    if (telegramMessage.lastIndexOf('/start', 0) === 0) {

        // Get the chat id and message id to reply to
        var chat_id = telegramUpdate.message.chat.id;
        var reply_to_message_id = telegramUpdate.message.message_id;

        telegram.sendMessage(chat_id, 'Hello this is the bot message :)', reply_to_message_id);
    }

    // Send response to Telegram, always OK
    res.statusCode = 200;
    res.end();
};
