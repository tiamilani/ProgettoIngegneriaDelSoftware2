// ---------- REQUIRE ----------
const db = require('./sectionDevelop.js');
const place = require ('./places.js');

// ---------- FUNCTIONS ----------
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

function createHome () {
	return {
		parse_mode: "Markdown",
        reply_markup: JSON.stringify({
			keyboard: [
				['Mezzi'],
				['Mensa'],
				['OperaUniTN'],
				['Luoghi'],
				['Avvisi'],
				['Scadenze']
			],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };
}

function createChoice (array, npr, argument, checkName, requestPosition) {
    let elements = [];

    if(checkName != undefined) {
        var similar = [];
        for(let i = 0; i < array.length; i++)
            if(((array[i])[argument]).toLowerCase().includes(checkName.toLowerCase()))
                similar.push(array[i]);

        array = similar.slice();
    }

    if(array != undefined) {
        let rest = array.length % npr;
        for(let i = 0; i < (array.length - rest); i += npr) {
            var item = [];
            for(let j = 0; j < npr; j++)
                item.push((array[i+j])[argument]);

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
		    var keyboard = createChoice(choices, 1, undefined, undefined, true);

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

				if(msg.text != undefined) {
					if(JSON.parse(result[0].keyboard).includes(msg.text)) {
						switch (msg.text) {
							case 'Trento':
							 	cittaCoord = {lat: 46.0702531, lng: 11.1216386};
								break;
							case 'Mesiano':
							 	cittaCoord = {lat: 46.0659393, lng: 11.1395838};
								break;
							case 'cittaCoord':
							 	citta = {lat: 46.066294, lng: 11.153842};
								break;
						}
					}
				} else
					cittaCoord = { lat: msg.location.latitude, lng: msg.location.longitude };

				var text = "Hei sei nella sezione luoghi utili :), Cosa vorresti cercare?";
				var choices = ['Biblioteche','Mense','Facoltà','Copisterie'];
				var keyboard = createChoice(choices, 1, undefined, undefined, false);

				var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
				var stringKeyboard = [].concat.apply([], keyboardString);

				var query = "UPDATE users SET location='" + cittaCoord + "',keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
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
			}
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

				var map = require('@google/maps').createClient({
					key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU'
				});

				var text = "Ecco i luoghi che sono riuscito a trovare :)";

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
					switch (struttura) {
						case 'Biblioteche':
							place.placesNearby(bot, msg.chat.id, map, position, 750, "library","Biblioteca");
							break;
						case 'Mense':
							place.placesNearby(bot, msg.chat.id, map, position, 750, "restaurant","mensa opera universitaria");
							break;
						case 'Facoltà':
							place.placesNearby(bot, msg.chat.id, map, position, 750, "university","Univeristà");
							break;
						case 'Copisterie':
							place.placesNearby(bot, msg.chat.id, map, position, 750, "store","Copisteria");
							break;
					}
				} else
					place.placesNearby(bot, msg.chat.id, map, position, 750, "", msg.text);

				checkID(msg.chat.id, '/start', con)
					.then((result) => {
						bot.sendMessage(msg.chat.id, text, createHome());
					})
					.catch(err => {
						console.error(err);
					});
			}
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

// ---------- EXPORTS ----------
exports.Luoghi_F1 = Luoghi_F1;
exports.Luoghi_F2 = Luoghi_F2;
exports.Luoghi_F3 = Luoghi_F3;
