var Promise = require('bluebird');
var emoji = require('node-emoji').emoji;

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
            inline_keyboard: [ buttons, [{text: 'Invia posizione selezionata', callback_data: 'loc'}] ]
        })
    };
}

var placesNearby = function (bot, chatId, map, city, range, type, nome) {
	map.placesNearby(
		{
			location: city,
			radius: range,
			language: "it",var
			type: type,
			name: nome
		},
		function(err, response){
			if (!err) {
				//console.log(response.json.results);
				var messageArray = [];
				for (var i = 0; i < response.json.results.length; i++) {
					if(response.json.results[i].name != "Malga")
						messageArray.push({name: response.json.results[i].name, rate: Math.round(response.json.results[i].rating), indirizzo: response.json.results[i].vicinity, lat: response.json.results[i].geometry.location.lat, lng: response.json.results[i].geometry.location.lng});
				}
				// tutto in -------->>>>> messageArray
				console.log("Ho creato l'array con le posizioni! Elementi presenti: "+ messageArray.length);

				var star = "";
				var iterator = 0;
				if(isNaN(messageArray[0].rate)){
					star = "Nessuna Valutazione";
				}
				else {
					for(iterator = 0; iterator < messageArray[0].rate; iterator++){
						star += emoji.star;
					}
				}

				bot.sendMessage(chatId,messageArray[0].name + "\nIndirizzo: " + messageArray[0].indirizzo + "\nValutazione google maps: " + star, getPagination(1,messageArray.length)).then(() => {
					var prev = 1;

					bot.on('callback_query', function(msg) {

						if(msg.data == 'loc'){
							bot.sendLocation(msg.message.chat.id, messageArray[prev - 1].lat, messageArray[prev - 1].lng);
							bot.removeListener('callback_query');
						} else {
							if(prev!=parseInt(msg.data)){
								prev = parseInt(msg.data);

								var options = getPagination(parseInt(prev),messageArray.length);
								options.chat_id = msg.message.chat.id;
								options.message_id = msg.message.message_id;

								var star = "";
								var iterator = 0;
								console.log("Rate " + messageArray[prev - 1].rate)
								if(isNaN(messageArray[prev - 1].rate)){
									star = "Nessuna Valutazion";
								}
								else {
									for(iterator = 0; iterator < messageArray[prev - 1].rate; iterator++){
										star += emoji.star;
									}
								}

								bot.editMessageText(messageArray[prev - 1].name + "\nIndirizzo: " + messageArray[prev - 1].indirizzo + "\nValutazione google maps: " + star, options);
							}
						}
					});
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
