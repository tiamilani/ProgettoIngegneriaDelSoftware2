// ---------- REQUIRE ----------
const db = require('./sectionDevelop.js');
var emoji = require('node-emoji').emoji;

// ---------- FUNCTIONS ----------


function getPaginationFull( current, maxpage ) {
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

function responseLuogo(result){
	return result.name + "\nIndirizzo: " + result.indirizzo + "\nValutazione google maps: " + result.rate;
}

function placesNearby(bot, chatId, map, city, range, type, nome, con) {
	console.log("placesNearby");
	map.placesNearby({
			location: JSON.parse(city),
			radius: range,
			language: "it",
			type: type,
			name: nome
		}, function(err, response){
			if (!err) {
				//console.log(response.json.results);
                if(response.json.results.length > 0) {
					var messageArray = [];
					for (var i = 0; i < response.json.results.length; i++) {

						var rate = Math.round(response.json.results[i].rating);
						var star = "";
						var iterator = 0;
						if(isNaN(rate)){
							star = "Nessuna Valutazione";
						}
						else {
							for(iterator = 0; iterator < rate; iterator++){
								star += emoji.star;
							}
						}

						var uno = response.json.results[i].name;
						var due = response.json.results[i].vicinity;
						uno = uno.replace(/'/g, "\\'");
						due = due.replace(/'/g, "\\'");
						uno = uno.replace(/"/g, "\\"+ "\"" +"");
						due = due.replace(/"/g, "\\"+ "\"" +"");
						messageArray.push({name: uno,rateGoogle: response.json.results[i].rating, rate: star, indirizzo: due, lat: response.json.results[i].geometry.location.lat, lng: response.json.results[i].geometry.location.lng});
					}
					// tutto in -------->>>>> messageArray
					var testo = JSON.stringify(messageArray);
					testo = testo.replace(/\\\\'/g,"\\'");
					testo = testo.replace(/\\\\\\"/g,"\\\\"+"\""+"");

					var query = "UPDATE users SET lastResult='" + testo + "' WHERE ChatID='" + chatId + "'";
					con.query(query, function (err, result) {
						if (err) throw err;
						checkID(chatId, 'Luoghi_F3', con)
							.then((result) => {
								bot.sendMessage(chatId,responseLuogo(messageArray[0]), getPaginationFull(1,messageArray.length));
							})
							.catch(err => {
								console.error(err);
							});
					});
                } else {
                    checkID(chatId, '/start', con)
                        .then((result) => {
                            bot.sendMessage(chatId, "Non sono stati trovati luoghi corrispondenti alla ricerca!");
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }
			}
		}
	);
}

function Luoghi_F4 (bot, msg, connection) {
	console.log("Luoghi_F4");
    if(msg.message != undefined) {
    	db.initiateConnection(connection)
    		.then((con) => {
    			var query = "SELECT * FROM users WHERE ChatID='" + msg.message.chat.id + "'";
    			con.query(query, function (err, result) {
    				if (err) throw err;

    				var res = result[0];
    				var prevChoice = res.prevChoice;
    				res = JSON.parse(res.lastResult);

                    if(msg.data == 'loc') {
    					checkID(msg.message.chat.id, '/start', con)
    						.then((result) => {
    							bot.editMessageText(responseLuogo(res[prevChoice-1]), {chat_id: msg.message.chat.id,message_id: msg.message.message_id});

    							bot.sendMessage(msg.message.chat.id, "Ecco la posizione selezionata!", db.createHome());
    				            bot.sendLocation(msg.message.chat.id, res[prevChoice-1].lat, res[prevChoice-1].lng);
    						})
    						.catch(err => {
    							console.error(err);
    						});
                    } else {
                        if(prevChoice != parseInt(msg.data)) {
    						prevChoice = parseInt(msg.data);

    						var options = getPaginationFull(prevChoice, res.length);
    						options['chat_id'] = msg.message.chat.id;
    						options['message_id'] = msg.message.message_id;

    						var query = "UPDATE users SET prevChoice='" + prevChoice + "' WHERE ChatID='" + msg.message.chat.id + "'";
    			            con.query(query, function (err, result) {
    			                if (err) throw err;

    		                	bot.editMessageText(responseLuogo(res[prevChoice-1]), options);
    						});
    					}
                    }
                });
    		})
    		.catch(err => {
    			bot.sendMessage(msg.message.chat.id, err);
    		});
    } else
		bot.sendMessage(msg.chat.id, "Valore non consentito, prima di effettuare un'altra ricerca fatti inviare la posizione della ricerca precedente!");

}



function checkID (id, lastCommand, connection) {
	return new Promise((resolve, reject) => {
		db.initConnectionLess(connection)
			.then((con) => {
		        var query = "SELECT ChatID FROM users WHERE ChatID='" + id + "'";
		        con.query(query, function (err, result) {
		            if (err) return reject(err);

					if(result.length == 0) {
						var query = "INSERT INTO users (ChatID) VALUES ('" + id + "')";
				        con.query(query, function (err, result) {
				            if (err) return reject(err);

							return resolve("Success");
						});
					}
					else {
						if(lastCommand == '/start') {
							var query = "UPDATE users SET keyboard=null, location=null WHERE ChatID='" + id + "'";
							con.query(query, function (err, result) {
								if (err) return reject(err);

								return resolve("Success");
							});
						}
						else {
							var query = "UPDATE users SET last_command='" + lastCommand + "' WHERE ChatID='" + id + "'";
					        con.query(query, function (err, result) {
					            if (err) return reject(err);

								return resolve("Success");
							});
						}
					}
				});
			})
			.catch(err => {
				bot.sendMessage(id, err);
			});
	});
}

function createChoice (array, npr, requestPosition) {
	let elements = [];

    if(array != undefined) {
        let rest = array.length % npr;
        for(let i = 0; i < (array.length - rest); i += npr) {
            var item = [];
            for(let j = 0; j < npr; j++)
                item.push(array[i+j]);

            elements.push(item);
        }

        var item = [];
        for(let j = array.length - rest; j < array.length; j++)
            item.push((array[j])[argument]);

        elements.push(item);
    }
    if(requestPosition)
        elements.unshift(['Home'],[{ text: 'Invia Posizione', request_location: true }]);
	else
		elements.unshift(['Home']);

    return {
        reply_markup: JSON.stringify({
            keyboard: elements,
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };
}

function Luoghi_F1 (bot, msg, connection) {
	console.log("Luoghi_F1");
	db.initiateConnection(connection)
		.then((con) => {
			var text = "In questa sezione puoi ottenere le posizioni di alcuni luoghi di interesse!\nInizia con dirmi in che città cercare";
			var choices = ['Trento','Mesiano','Povo'];
		    var keyboard = createChoice(choices, 1, true);

			var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
			var stringKeyboard = [].concat.apply([], keyboardString);

			var query = "UPDATE users SET keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				checkID(msg.chat.id, 'Luoghi_F1', con)
					.then((result) => {
						bot.sendMessage(msg.chat.id, text, keyboard);
					})
					.catch(err => {
						console.error(err);
					});
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Luoghi_F2 (bot, msg, connection) {
	console.log("Luoghi_F2");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				var cittaCoord;
				var citta;

				if(msg.text != undefined) {
					if(JSON.parse(result[0].keyboard).includes(msg.text)) {
						switch (msg.text) {
							case 'Trento':
							 	cittaCoord = {lat: 46.0702531, lng: 11.1216386};
								break;
							case 'Mesiano':
							 	cittaCoord = {lat: 46.0659393, lng: 11.1395838};
								break;
							case 'Povo':
							 	cittaCoord = {lat: 46.066294, lng: 11.153842};
								break;
						}
						citta = msg.text;
					}
				} else{
					cittaCoord = { lat: msg.location.latitude, lng: msg.location.longitude };
					citta = "Position"
				}

				var text = "Hei sei nella sezione luoghi utili :), Cosa vorresti cercare?";
				var choices = ['Biblioteche','Mense','Facoltà','Copisterie'];
				var keyboard = createChoice(choices, 1, false);

				var query = "UPDATE users SET location='" + JSON.stringify(cittaCoord) + "', lastResult='" + citta + "' WHERE ChatID='" + msg.chat.id + "'";
				con.query(query, function (err, result) {
					if (err) throw err;

					checkID(msg.chat.id, 'Luoghi_F2', con)
						.then((result) => {
							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				});
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Luoghi_F3 (bot, msg, connection) {
	console.log("Luoghi_F3");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				var struttura = msg.text;
				var position = result[0].location;

				var citta = result[0].lastResult;

				var map = require('@google/maps').createClient({
					key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU'
				});

				var text = "Ecco i luoghi che sono riuscito a trovare :)";

				if(citta != "Position") {
					switch (struttura) {
						case 'Biblioteche':
							placesNearby(bot, msg.chat.id, map, position, 1000, "library","Biblioteca", con);
							break;
						case 'Mense':
							if(['Mesiano','Povo'].includes(citta))
								placesNearby(bot, msg.chat.id, map, position, 300, "","mensa opera universitaria", con);
							else if (citta == "Trento")
								placesNearby(bot, msg.chat.id, map, position, 750, "restaurant","mensa opera universitaria", con);
							else
								placesNearby(bot, msg.chat.id, map, position, 750, "restaurant","mensa", con);
							break;
						case 'Facoltà':
							if(['Mesiano','Povo'].includes(citta))
								placesNearby(bot, msg.chat.id, map, position, 400, "","dipartimento", con);
							else
								placesNearby(bot, msg.chat.id, map, position, 750, "university","Univeristà", con);
							break;
						case 'Copisterie':
							placesNearby(bot, msg.chat.id, map, position, 1000, "store","Copisteria", con);
							break;
						default:
							placesNearby(bot, msg.chat.id, map, position, 750, "", msg.text,con);
							break;
					}
				} else
					placesNearby(bot, msg.chat.id, map, position, 750, "", msg.text,con);
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

// ---------- EXPORTS ----------
exports.Luoghi_F1 = Luoghi_F1;
exports.Luoghi_F2 = Luoghi_F2;
exports.Luoghi_F3 = Luoghi_F3;
exports.Luoghi_F4 = Luoghi_F4;
