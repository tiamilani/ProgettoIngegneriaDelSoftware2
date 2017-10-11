var Promise = require('bluebird');

//-------------- FUNCTIONS --------------

function sendMessagesComplex(bot, chatId, messages) {
    return Promise.mapSeries(messages, function(message) {
		bot.sendMessage(chatId, message.name);
	    return bot.sendLocation(chatId, message.lat, message.lng);
    });
}

function getPagination( current, maxpage ) {
    var buttons = [];

    if (current > 1)
        buttons.push( { text: '«1', callback_data: '1' } );

    if (current > 2)
        buttons.push( { text: `‹${current-1}`, callback_data: (current - 1).toString() } );

    buttons.push( { text: `-${current}-`, callback_data: current.toString() } );

    if (current < maxpage-1)
        buttons.push( { text: `${current+1}›`, callback_data: (current + 1).toString() } );

    if (current < maxpage)
        buttons.push( { text: `${maxpage}»`, callback_data: maxpage.toString() } );

    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [ buttons ]
        })
    };
}

var placesNearby = function (bot, chatId, map, city, range, type, nome) {
	map.placesNearby(
		{
			location: city,
			radius: range,
			language: "it",
			type: type,
			name: nome
		},
		function(err, response){
			if (!err) {
				//console.log(response.json.results);
				var messageArray = [];
				for (var i = 0; i < response.json.results.length; i++) {
					if(response.json.results[i].name != "Malga")
						messageArray.push({name: nome + ": " + response.json.results[i].name, lat: response.json.results[i].geometry.location.lat, lng: response.json.results[i].geometry.location.lng});
				}
				// tutto in -------->>>>> messageArray
				bot.sendMessage(chatId, messageArray[0].name, getPagination(1,messageArray.length())).then(() => {
					bot.on('callback_query', function(msg) {
						var options = getPagination(parseInt(msg.data),messageArray.length());
						options.chat_id = msg.message.chat.id;
						options.message_id = msg.message.message_id;

						bot.editMessageText(messageArray[parseInt(msg.data)].name, options);
					})
				});
				/*sendMessagesComplex(bot, chatId, messageArray)
					.then(function() {
						console.log("All messages sent, in series!");
					});*/
			}
		}
	);
}

//-------------- EXPORTS ----------------
exports.placesNearby = placesNearby;
