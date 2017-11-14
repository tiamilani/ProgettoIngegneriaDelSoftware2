// ---------- REQUIRE ----------
const fun = require ('./functions.js');
const db = require('./sectionDevelop');
const dead = require('./sectionScadenze.js');
const mysql = require('mysql');

// ---------- FUNCTIONS ----------
/*
 *	@param	id:				Identificativo univoco della chat
 *	@param	lastCommand:	Identifica lo stato dell'utente
*/
function checkID (id, lastCommand, connection) {
	//console.log("IN CHECK");
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
							var query = "UPDATE users SET last_command='/start',prevChoice='1',nameT=null, keyboard=null, lastResult=null WHERE ChatID='" + id + "'";
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

/*
 *  @param  array:              Vettore contenente le scelte
 *  @param  npr:                Numero di scelte per riga
 *  @param  argument:           Quale valore della variabile devo prendere
 *  @param  checkName:          Frase da matchare in array per ridurre le scelte
 *  @param  requestPosition:    Indica se ho bisogno di richiedere la posizione
 *
 *	@return	keyboard:			Oggetto che definisce il layout della tastiera telegram
*/
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

/*	Funzione che crea il testo da visualizzare a partire da un oggetto
 *	@param	result:	Oggetto da analizzare
 *
 *	@return	text:	Testo che descrive l'oggetto passato in input
*/
function printText (result) {
    var text = "";
    if(result.route_short_name != undefined)
        text += "Linea " + result.route_short_name + " (" + result.route_long_name + ")";

	if(result.trip_headsign != undefined)
        text += "\nDirezione: *" + result.trip_headsign + "*";

    if(result.stop_name != undefined)
        text += "\nFermata: *" + result.stop_name + "*";

    if(result.distance != undefined)
        text += "\nDistanza: *" + Math.round(result.distance) + "* metri";

    if(result.arrival_time != undefined) {
        if(result.arrival_time === result.departure_time)
            text += "\nOrario: *" + result.arrival_time + "*";
        else {
            var t2 = fun.convertDate(result.arrival_time, "h:m:s");
            var t1 = fun.convertDate(result.departure_time, "h:m:s")

            let diff = parseInt((t1-t2)/(60*1000));
            text += "\nOrario: *" + result.arrival_time + "*, ma partirà " + diff + " minuti dopo!";
        }
    }

    if(result.wheelchair_boarding != undefined) {
        text += "\n\nDisabilità";
        switch(parseInt(result.wheelchair_boarding)) {
            case 0:
                text += "\n- Fermata attrezzata: Info non presente";
                break;
            case 1:
                text += "\n- Fermata attrezzata: Si, ma non per tutti i mezzi";
                break;
            case 2:
                text += "\n- Fermata attrezzata: No";
                break;
        }
    }

    if(result.wheelchair_accessible != undefined) {
        switch(parseInt(result.wheelchair_accessible)) {
            case 0:
                text += "\n- Veicolo attrezzato: Info non presente";
                break;
            case 1:
                text += "\n- Veicolo attrezzato: Si, al massimo 1 passeggero";
                break;
            case 2:
                text += "\n- Veicolo attrezzato: No";
                break;
        }
    }

    return text;
}

/*
 *	@param	current:	Pagina di defualt da cui partire
 *	@param	maxpage:	Numero massimo di pagine presenti
 *
 *	@return	keyboard:	Oggetto che definisce il layout della tastiera telegram
*/
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
        parse_mode: 'Markdown',
        reply_markup: JSON.stringify({
            inline_keyboard: [ buttons, [{ text:'Invia Posizione Selezionata', callback_data: 'loc' }] ]
        })
    };
}

/*
 *	@param	current:	Pagina di defualt da cui partire
 *	@param	maxpage:	Numero massimo di pagine presenti
 *
 *	@return	keyboard:	Oggetto che definisce il layout della tastiera telegram
*/
function getPagination( current, maxpage ) {
    var buttons = [];

    if (current > 1) {
        for(let i = 1; i < current; i++)
            buttons.push( { text: `${i}`, callback_data: (i).toString() } );
    }

    buttons.push( { text: `-${current}-`, callback_data: current.toString() } );

    if (current < maxpage) {
        for(let i = current; i < maxpage; i++)
            buttons.push( { text: `${i+1}`, callback_data: (i+1).toString() } );
    }

    return {
        parse_mode: 'Markdown',
        reply_markup: JSON.stringify({
            inline_keyboard: [ buttons, [{ text:'Invia Posizione Selezionata', callback_data: 'loc' }] ]
        })
    };
}

/*
 *	@param	bot:	Bot da utilizzare per lo scmabio di messaggi
*/
function Fermata_F1 (bot, msg, connection) {
	console.log("Fermata_F1");
	db.initiateConnection(connection)
		.then((con) => {
		    var text = "Prima di tutto mandami la posizione o scrivimi il nome della fermata che ti interessa:";
		    var keyboard = createChoice(undefined, undefined, undefined, undefined, true);

			checkID(msg.chat.id, 'Fermata_F1', con)
				.then((result) => {
					bot.sendMessage(msg.chat.id, text, keyboard);
				})
				.catch(err => {
					console.error(err);
				});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Location_Init (bot, msg, con, stato, result) {
	function checkNearest(item) {
		return this != item.stop_id;
	}

	function compareDistance(a, b) {
		return a.distance - b.distance;
	}

	var myPos = [msg.location.latitude, msg.location.longitude];
	var nearest = [];

	let tmp1, tmp2;
	for (let i = 0; i < result.length; i++)
	{
		tmp2 = [result[i].stop_lat, result[i].stop_lon];
		tmp1 = fun.distanceBetween(myPos, tmp2);

		if(nearest.every(checkNearest, result[i].stop_id))
		{
			(result[i])['distance'] = tmp1;
			nearest.push(result[i]);
		}
	}

	if(nearest.length > 0) {
		nearest.sort(compareDistance);
		var res = nearest.slice(0, 3);

		var query = "UPDATE users SET lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.chat.id + "'";
		con.query(query, function (err, result) {
			if (err) throw err;

			checkID(msg.chat.id, stato, con)
				.then((result) => {
					bot.sendMessage(msg.chat.id, printText(res[0]), getPagination(1, res.length));
				})
				.catch(err => {
					console.error(err);
				});
		});
	}
	else {
		checkID(msg.chat.id, '/start', con)
			.then((result) => {
				var text = "Sei troppo lontano, cerca di avvicinarti...";
				var keyboard = {
					parse_mode: "Markdown",
					reply_markup: JSON.stringify({
						keyboard: [
							['Mezzi'],
							['Mensa'],
							['OperaUniTN'],
							['Scadenze']
						],
						one_time_keyboard: true,
						resize_keyboard: true
					})
				};

				bot.sendMessage(msg.chat.id, text, keyboard);
			})
			.catch(err => {
				console.error(err);
			});
	}
}

function Fermata_F2_Location_F1 (bot, msg, connection) {
	console.log("Fermata_F2_Location_F1");
	db.initiateConnection(connection)
		.then((con) => {
	        var query = "SELECT * FROM stops";
	        con.query(query, function (err, result, fields) {
	            if (err) throw err;

	            if(result.length > 0)
					Location_Init (bot, msg, con, 'Fermata_F2_Location_F1', result);
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Fermata_F2_Location_F2 (bot, msg, connection) {
	console.log("Fermata_F2_Location_F2");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.message.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				var res = result[0];
				var prevChoice = res.prevChoice;
				res = JSON.parse(res.lastResult);

		        if(msg.data == 'loc') {
					bot.editMessageText(printText(res[prevChoice-1]), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "Markdown"});
		            bot.sendLocation(msg.message.chat.id, res[prevChoice-1].stop_lat, res[prevChoice-1].stop_lon);

					var query = "UPDATE users SET prevChoice='1' WHERE ChatID='" + msg.message.chat.id + "'";
					con.query(query, function (err, result) {
						if (err) throw err;

			            var fermata = res[prevChoice-1].stop_name;
			            var tmpF = fermata.replace(/[\W_]/g, '');
			            var nameT1 = "fermata_" + tmpF;

			            query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE stop_name='" + fermata + "'";
			            con.query(query, function (err, result) {
			                if (err) throw err;

			                query = "SELECT DISTINCT route_short_name FROM " + nameT1 + " ORDER BY length(route_short_name) ASC, route_short_name ASC";
			                con.query(query, function (err, result, fields) {
			                    if (err) throw err;

			                    var text = "Seleziona la linea:";
								var keyboard = createChoice(result, 5, 'route_short_name', undefined, false);

								var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
								var stringKeyboard = [].concat.apply([], keyboardString);

								var query = "UPDATE users SET NameT='" + nameT1 + "',keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.message.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.message.chat.id, 'Fermata_F2_Location_F2', con)
										.then((result) => {
			                				bot.sendMessage(msg.message.chat.id, text, keyboard);
										})
										.catch(err => {
											console.error(err);
										});
								});
							});
						});
					});
				} else {
					if(prevChoice != parseInt(msg.data)) {
						prevChoice = parseInt(msg.data);

						var options = getPagination(prevChoice, res.length);
						options['chat_id'] = msg.message.chat.id;
						options['message_id'] = msg.message.message_id;

						var query = "UPDATE users SET prevChoice='" + prevChoice + "' WHERE ChatID='" + msg.message.chat.id + "'";
			            con.query(query, function (err, result) {
			                if (err) throw err;

							bot.editMessageText(printText(res[prevChoice-1]), options);
						});
					}
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Fermata_F2_Location_F3 (bot, msg, nameT1, connection) {
	console.log("Fermata_F2_Location_F3");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
			        var linea = msg.text;
					var index = linea.indexOf("/");
					var tmpL;
					if(index == -1)
						tmpL = linea;
					else
    					tmpL = linea.substr(0, index) + '$' + linea.substr(index + 1);

			        var date = new Date();
			        var clockNow = date.toTimeString();
			        clockNow = clockNow.split(' ')[0];

			        var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
			        var today = weekday[date.getDay()];

			        var nameT2 = nameT1 + "_linea_" + tmpL;

			        query = "CREATE TABLE IF NOT EXISTS " + nameT2 + " AS SELECT * FROM " + nameT1 + " WHERE route_short_name='" + linea + "'";
			        con.query(query, function (err, result, fields) {
			            if (err) throw err;

			            query = "SELECT * FROM " + nameT2 + " WHERE arrival_time>'" + clockNow + "' AND " + today + "='1' ORDER BY arrival_time ASC";
			            con.query(query, function (err, result, fields) {
			                if (err) throw err;

			                if(result.length > 0) {
								var res = result;

								var query = "UPDATE users SET lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.chat.id, 'Fermata_F2_Location_F3', con)
										.then((result) => {
				                    		bot.sendMessage(msg.chat.id, printText(res[0]), getPaginationFull(1, res.length));
										})
										.catch(err => {
											console.error(err);
										});
								});
							} else {
								checkID(msg.chat.id, '/start', con)
									.then((result) => {
										var text = "Mi dispiace ma la linea selezionata ha terminato le corse per oggi...";
										var keyboard = {
											parse_mode: "Markdown",
											reply_markup: JSON.stringify({
												keyboard: [
													['Mezzi'],
													['Mensa'],
													['OperaUniTN'],
							                        ['Scadenze']
												],
												one_time_keyboard: true,
												resize_keyboard: true
											})
										};

										bot.sendMessage(msg.chat.id, text, keyboard);
									})
									.catch(err => {
										console.error(err);
									});
							}
						});
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "La linea inserita non è stata riconosciuta!";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Fermata_F2_Name_F1 (bot, msg, connection) {
	console.log("Fermata_F2_Name_F1");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT DISTINCT stop_name FROM stops";
	        con.query(query, function (err, result) {
	            if (err) throw err;

				var text = "Ho trovato queste fermate:";
				var keyboard = createChoice(result, 2, 'stop_name', msg.text, false);

				var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
				var stringKeyboard = [].concat.apply([], keyboardString);

				var query = "UPDATE users SET keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
				con.query(query, function (err, result) {
					if (err) throw err;

					checkID(msg.chat.id, 'Fermata_F2_Name_F1', con)
						.then((result) => {
		        			bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							bot.sendMessage(msg.chat.id, err);
						});
				});
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Fermata_F2_Name_F2 (bot, msg, connection) {
	console.log("Fermata_F2_Name_F2");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
			        var fermata = msg.text;
			        var tmpF = fermata.replace(/[\W_]/g, '');
			        var nameT1 = "fermata_" + tmpF;

					var query = "UPDATE users SET NameT='" + nameT1 + "' WHERE ChatID='" + msg.chat.id + "'";
					con.query(query, function (err, result) {
						if (err) throw err;

						var query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE stop_name='" + fermata + "'";
				        con.query(query, function (err, result) {
				            if (err) throw err;

				            query = "SELECT DISTINCT route_short_name FROM " + nameT1 + " ORDER BY length(route_short_name) ASC, route_short_name ASC";
				            con.query(query, function (err, result, fields) {
				                if (err) throw err;

				                var text = "Seleziona la linea:";
								var keyboard = createChoice(result, 5, 'route_short_name', undefined, false);

								var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
								var stringKeyboard = [].concat.apply([], keyboardString);

								var query = "UPDATE users SET keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.chat.id, 'Fermata_F2_Name_F2', con)
										.then((result) => {
						        			bot.sendMessage(msg.chat.id, text, keyboard);
										})
										.catch(err => {
											console.error(err);
										});
								});
							});
						});
					});
				}
				else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "La linea fermata non è stata riconosciuta!";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Fermata_F2_Name_F3 (bot, msg, nameT1, connection) {
	console.log("Fermata_F2_Name_F3");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
			        var linea = msg.text;
					var index = linea.indexOf("/");
					var tmpL;
					if(index == -1)
						tmpL = linea;
					else
    					tmpL = linea.substr(0, index) + '$' + linea.substr(index + 1);

			        var date = new Date();
			        var clockNow = date.toTimeString();
			        clockNow = clockNow.split(' ')[0];

			        var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
			        var today = weekday[date.getDay()];

			        var nameT2 = nameT1 + "_linea_" + tmpL;

			        var query = "CREATE TABLE IF NOT EXISTS " + nameT2 + " AS SELECT * FROM " + nameT1 + " WHERE route_short_name='" + linea + "'";
			        con.query(query, function (err, result, fields) {
			            if (err) throw err;

			            query = "SELECT * FROM " + nameT2 + " WHERE arrival_time>'" + clockNow + "' AND " + today + "='1' ORDER BY arrival_time ASC";
			            con.query(query, function (err, result, fields) {
			                if (err) throw err;

							var res = result;

			                if(res.length > 0) {
								var query = "UPDATE users SET lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.chat.id, 'Fermata_F2_Name_F3', con)
										.then((result) => {
					                    	bot.sendMessage(msg.chat.id, printText(res[0]), getPaginationFull(1, res.length));
										})
										.catch(err => {
											console.error(err);
										});
								});
							}
							else {
								checkID(msg.chat.id, '/start', con)
									.then((result) => {
										var text = "Mi dispiace ma la linea selezionata ha terminato le corse per oggi...";
										var keyboard = {
											parse_mode: "Markdown",
											reply_markup: JSON.stringify({
												keyboard: [
													['Mezzi'],
													['Mensa'],
													['OperaUniTN'],
							                        ['Scadenze']
												],
												one_time_keyboard: true,
												resize_keyboard: true
											})
										};

										bot.sendMessage(msg.chat.id, text, keyboard);
									})
									.catch(err => {
										console.error(err);
									});
							}
						});
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "La linea inserita non è stata riconosciuta!";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

/*
 *	@param	bot:	Bot da utilizzare per lo scmabio di messaggi
*/
function Linea_F1 (bot, msg, connection) {
	console.log("Linea_F1");
	db.initiateConnection(connection)
		.then((con) => {
	        var query = "SELECT DISTINCT route_short_name FROM routes ORDER BY length(route_short_name) ASC, route_short_name ASC";
	        con.query(query, function (err, result) {
	            if (err) throw err;

	            var text = "Prima di tutto dimmi che linea ti interessa:";
				var keyboard = createChoice(result, 5, 'route_short_name', undefined, false);

				var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
				var stringKeyboard = [].concat.apply([], keyboardString);

				query = "UPDATE users SET keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
				con.query(query, function (err, result) {
					if (err) throw err;

					checkID(msg.chat.id, 'Linea_F1', con)
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

function Linea_F2 (bot, msg, connection) {
	console.log("Linea_F2");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
		            var linea = msg.text;
					var index = linea.indexOf("/");
					var tmpL;
					if(index == -1)
						tmpL = linea;
					else
    					tmpL = linea.substr(0, index) + '$' + linea.substr(index + 1);
		            var nameT1 = "linea_" + tmpL;
		            query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE route_short_name='" + linea + "'";
		            con.query(query, function (err, result) {
		                if (err) throw err;

		                query = "SELECT DISTINCT trip_headsign FROM " + nameT1;
		                con.query(query, function (err, result, fields) {
		                    if (err) throw err;

		                    var text = "Seleziona la direzione:";
							var keyboard = createChoice(result, 2, 'trip_headsign', undefined, false);

							var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
							var stringKeyboard = [].concat.apply([], keyboardString);

							query = "UPDATE users SET NameT='" + nameT1 + "',keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
							con.query(query, function (err, result) {
								if (err) throw err;

								checkID(msg.chat.id, 'Linea_F2', con)
									.then((result) => {
										bot.sendMessage(msg.chat.id, text, keyboard);
									})
									.catch(err => {
										console.error(err);
									});
							});
						});
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "La linea inserita non è stata riconosciuta!";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Linea_F3 (bot, msg, nameT1, connection) {
	console.log("Linea_F3");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
					var direzione = msg.text;
					var tmpD = direzione.replace(/[\W_]/g, '');

					var nameT2 = nameT1 + "_direzione_" + tmpD;
					var nameT3 = nameT2 + "_fermate";
					query = "CREATE TABLE IF NOT EXISTS " + nameT2 + " AS SELECT * FROM " + nameT1 + " WHERE trip_headsign='" + direzione + "'";
					con.query(query, function (err, result) {
						if (err) throw err;

						query = "CREATE TABLE IF NOT EXISTS " + nameT3 + " AS SELECT DISTINCT stop_name FROM " + nameT2;
						con.query(query, function (err, result) {
							if (err) throw err;

							query = "SELECT * FROM " + nameT3 + " ORDER BY stop_name ASC";
							con.query(query, function (err, result, fields) {
								if (err) throw err;

								var text = "Mandami la tua posizione o seleziona una fermata specifica e ti saprò dire dove e quando prendere l'autobus!";
								var keyboard = createChoice(result, 2, 'stop_name', undefined, true);

								var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
								var stringKeyboard = [].concat.apply([], keyboardString);

								query = "UPDATE users SET NameT='" + nameT2 + "',keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.chat.id, 'Linea_F3', con)
										.then((result) => {
											bot.sendMessage(msg.chat.id, text, keyboard);
										})
										.catch(err => {
											console.error(err);
										});
								});
							});
						});
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "La direzione inserita non è stata riconosciuta!";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Linea_F4_Location_F1 (bot, msg, nameT2, connection) {
	console.log("Linea_F4_Location_F1");
	db.initiateConnection(connection)
		.then((con) => {
			var date = new Date();
			var clockNow = date.toTimeString();
			clockNow = clockNow.split(' ')[0];

			var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
			var today = weekday[date.getDay()];

		    query = "SELECT * FROM " + nameT2 + " WHERE arrival_time>'" + clockNow + "' AND " + today + "='1' ORDER BY arrival_time ASC";
		    con.query(query, function (err, result, fields) {
		        if (err) throw err;

		        if(result.length > 0)
		            Location_Init (bot, msg, con, 'Linea_F4_Location_F1', result);
				else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "Mi dispiace ma la linea selezionata ha terminato le corse per oggi, oppure non lavora oggi...";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
		        }
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Linea_F4_Name_F1 (bot, msg, nameT2, connection) {
	console.log("Linea_F4_Name_F1");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
					var date = new Date();
					var clockNow = date.toTimeString();
					clockNow = clockNow.split(' ')[0];

					var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
					var today = weekday[date.getDay()];

				    query = "SELECT * FROM " + nameT2 + " WHERE stop_name='" + msg.text + "' AND arrival_time>'" + clockNow + "' AND " + today + "='1' ORDER BY arrival_time ASC";
				    con.query(query, function (err, result, fields) {
				        if (err) throw err;

				        if(result.length > 0) {
							var res = result;

							var query = "UPDATE users SET lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.chat.id + "'";
							con.query(query, function (err, result) {
								if (err) throw err;

								checkID(msg.chat.id, 'Linea_F4_Name_F1', con)
									.then((result) => {
										bot.sendMessage(msg.chat.id, printText(res[0]), getPaginationFull(1, res.length));
									})
									.catch(err => {
										console.error(err);
									});
							});
						} else {
							checkID(msg.chat.id, '/start', con)
								.then((result) => {
									var text = "Mi dispiace ma la linea selezionata ha terminato le corse per oggi...";
									var keyboard = {
										parse_mode: "Markdown",
										reply_markup: JSON.stringify({
											keyboard: [
												['Mezzi'],
												['Mensa'],
												['OperaUniTN'],
						                        ['Scadenze']
											],
											one_time_keyboard: true,
											resize_keyboard: true
										})
									};

									bot.sendMessage(msg.chat.id, text, keyboard);
								})
								.catch(err => {
									console.error(err);
								});
				        }
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "La linea inserita non è stata riconosciuta!";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

/*
 *	@param	bot:	Bot da utilizzare per lo scmabio di messaggi
*/
function Next_F1 (bot, msg, connection) {
	console.log("Next_F1");
	db.initiateConnection(connection)
		.then((con) => {
	        var text = "Prima di tutto dimmi mandami la posizione o scrivimi il nome della fermata che ti interessa:";
			checkID(msg.chat.id, 'Next_F1', con)
				.then((result) => {
			        bot.sendMessage(msg.chat.id, text, createChoice(undefined, undefined, undefined, undefined, true));
				})
				.catch(err => {
					console.error(err);
				});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Next_F2_Location_F1 (bot, msg, connection) {
	console.log("Next_F2_Location_F1");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM stops";
			con.query(query, function (err, result, fields) {
				if (err) throw err;

				if(result.length > 0)
					Location_Init (bot, msg, con, 'Next_F2_Location_F1', result);
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function Next_F2_Location_F2 (bot, msg, connection) {
	console.log("Next_F2_Location_F2");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.message.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				var res = result[0];
				var prevChoice = res.prevChoice;
				res = JSON.parse(res.lastResult);

	            if(msg.data == 'loc') {
					bot.editMessageText(printText(res[prevChoice-1]), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "Markdown"});
					bot.sendLocation(msg.message.chat.id, res[prevChoice-1].stop_lat, res[prevChoice-1].stop_lon);

	                var fermata = res[prevChoice-1].stop_name;
	                var tmpF = fermata.replace(/[\W_]/g, '');
	                var nameT1 = "fermata_" + tmpF;

	                query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE stop_name='" + fermata + "'";
	                con.query(query, function (err, result) {
	                    if (err) throw err;

						var date = new Date();
						var clockNow = date.toTimeString();
						clockNow = clockNow.split(' ')[0];

						var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
						var today = weekday[date.getDay()];

	                    query = "SELECT MIN(arrival_time),stop_name,stop_lat,stop_lon,wheelchair_boarding,arrival_time,departure_time,trip_headsign,wheelchair_accessible,route_short_name,route_long_name,route_type FROM " + nameT1 + " where arrival_time>'" + clockNow + "' AND " + today + "='1' GROUP BY route_short_name ORDER BY length(route_short_name) ASC, route_short_name ASC";
	                    con.query(query, function (err, result, fields) {
	                        if (err) throw err;
							var res = result;

	                        if(result.length > 0) {
								var query = "UPDATE users SET lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.message.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.message.chat.id, 'Next_F2_Location_F2', con)
										.then((status) => {
											bot.sendMessage(msg.message.chat.id, printText(res[0]), getPaginationFull(1, res.length));
										})
										.catch(err => {
											console.error(err);
										});
								});
							} else {
								checkID(msg.message.chat.id, '/start', con)
									.then((result) => {
										var text = "Mi dispiace ma per oggi sono terminate le corse in questa fermata, oppure non lavora oggi...";
										var keyboard = {
											parse_mode: "Markdown",
											reply_markup: JSON.stringify({
												keyboard: [
													['Mezzi'],
													['Mensa'],
													['OperaUniTN'],
							                        ['Scadenze']
												],
												one_time_keyboard: true,
												resize_keyboard: true
											})
										};

										bot.sendMessage(msg.message.chat.id, text, keyboard);
									})
									.catch(err => {
										console.error(err);
									});
					        }
						});
					});
				} else {
					if(prevChoice != parseInt(msg.data)) {
						prevChoice = parseInt(msg.data);

						var options = getPagination(prevChoice, res.length);
						options['chat_id'] = msg.message.chat.id;
						options['message_id'] = msg.message.message_id;

						var query = "UPDATE users SET prevChoice='" + prevChoice + "' WHERE ChatID='" + msg.message.chat.id + "'";
			            con.query(query, function (err, result) {
			                if (err) throw err;

		                	bot.editMessageText(printText(res[prevChoice-1]), options);
						});
					}
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.message.chat.id, err);
		});
}

function Next_F2_Name_F1 (bot, msg, connection) {
	console.log("Next_F2_Name_F1");
	db.initiateConnection(connection)
		.then((con) => {
		    var fermata = msg.text;

		    var query = "SELECT DISTINCT stop_name FROM stops";
		    con.query(query, function (err, result) {
		        if (err) throw err;

		        var text = "Ho trovato queste fermate:";
				var keyboard = createChoice(result, 2, 'stop_name', fermata, false);

				var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
				var stringKeyboard = [].concat.apply([], keyboardString);

				query = "UPDATE users SET keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
				con.query(query, function (err, result) {
					if (err) throw err;

					checkID(msg.chat.id, 'Next_F2_Name_F1', con)
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

function Next_F2_Name_F2 (bot, msg, connection) {
	console.log("Next_F2_Name_F2");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
		            fermata = msg.text;
		            var tmpF = fermata.replace(/[\W_]/g, '');
		            var nameT1 = "fermata_" + tmpF;
		            query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE stop_name='" + fermata + "'";
		            con.query(query, function (err, result) {
		                if (err) throw err;

		                var date = new Date();
		                var clockNow = date.toTimeString();
		                clockNow = clockNow.split(' ')[0];
		                var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
		                var today = weekday[date.getDay()];

		                query = "SELECT MIN(arrival_time),stop_name,stop_lat,stop_lon,wheelchair_boarding,arrival_time,departure_time,trip_headsign,wheelchair_accessible,route_short_name,route_long_name,route_type FROM " + nameT1 + " where arrival_time>'" + clockNow + "' AND " + today + "='1' GROUP BY route_short_name,trip_headsign ORDER BY length(route_short_name) ASC, route_short_name ASC";
		                con.query(query, function (err, result, fields) {
		                    if (err) throw err;

							var res = result;

			                if(res.length > 0) {
								var query = "UPDATE users SET lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.chat.id, 'Next_F2_Name_F2', con)
										.then((result) => {
					                    	bot.sendMessage(msg.chat.id, printText(res[0]), getPaginationFull(1, res.length));
										})
										.catch(err => {
											console.error(err);
										});
								});
							}
							else {
								checkID(msg.chat.id, '/start', con)
									.then((result) => {
										var text = "Mi dispiace ma la linea selezionata ha terminato le corse per oggi...";
										var keyboard = {
											parse_mode: "Markdown",
											reply_markup: JSON.stringify({
												keyboard: [
													['Mezzi'],
													['Mensa'],
													['OperaUniTN'],
							                        ['Scadenze']
												],
												one_time_keyboard: true,
												resize_keyboard: true
											})
										};

										bot.sendMessage(msg.chat.id, text, keyboard);
									})
									.catch(err => {
										console.error(err);
									});
							}
						});
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = "La fermata inserita non è stata riconosciuta!";
							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};

							bot.sendMessage(msg.chat.id, text, keyboard);
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function All_FF (bot, msg, connection) {
	console.log("Stato Finale");
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
							bot.editMessageText(printText(res[prevChoice-1]), {chat_id: msg.message.chat.id,message_id: msg.message.message_id,parse_mode: "Markdown"});

							var keyboard = {
								parse_mode: "Markdown",
								reply_markup: JSON.stringify({
									keyboard: [
										['Mezzi'],
										['Mensa'],
										['OperaUniTN'],
				                        ['Scadenze']
									],
									one_time_keyboard: true,
									resize_keyboard: true
								})
							};
							bot.sendMessage(msg.message.chat.id, "Ecco la possizione selezionata!", keyboard);
				            bot.sendLocation(msg.message.chat.id, res[prevChoice-1].stop_lat, res[prevChoice-1].stop_lon);
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

		                	bot.editMessageText(printText(res[prevChoice-1]), options);
						});
                    }
                }
            });
		})
		.catch(err => {
			bot.sendMessage(msg.message.chat.id, err);
		});
}

/*
 *	@param	bot:	Bot da utilizzare per lo scmabio di messaggi
*/
function avvisiLinee (bot, msg, connection) {
	console.log("AVVISI");
	db.initiateConnection(connection)
		.then((con) => {
	        var date = new Date();
	        var dateNow = date.toISOString().split('T')[0];
	        dateNow = dateNow.replace(/[-]/g, '');

	        let query = "SELECT route_long_name, route_short_name FROM time_table NATURAL JOIN calendar_dates where exception_type='2' AND date='" + dateNow + "' GROUP BY route_short_name";
	        con.query(query, function (err, result, fields) {
	            if (err) throw err;

	            if(result.length > 0) {
	                var text = "Ecco le linee che subiranno variazioni nella giornata odierna:";
	                for(let i = 0; i < result.length; i++)
	                    text += "\nLinea " + result[i].route_short_name + " (" + result[i].route_long_name + ")";

	                bot.sendMessage(msg.chat.id, text);
	            }
	            else {
	                bot.sendMessage(msg.chat.id, "Oggi non ci sono variazioni di orario in alcuna linea!");
	            }
	        });
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

/*
 *	@param	id:				Identificativo univoco della chat
 *	@param	bot:			Bot da utilizzare per lo scmabio di messaggi
 *	@param	msg:			Parametro passato per chat
*/
function nextCommand (id, bot, msg, connection) {
	console.log("ROUTE");
	db.initiateConnection(connection)
		.then((con) => {
	        var query = "SELECT * FROM users WHERE ChatID='" + id + "'";
	        con.query(query, function (err, result) {
	            if (err) throw err;

				result = result[0];

				console.log("Ultimo comando: " + result.last_command);

				if ((result.last_command).includes("Fermata")) {
					switch (result.last_command) {
						case 'Fermata_F1':
							if(msg.text != undefined)
								Fermata_F2_Name_F1(bot, msg, con);
							else if(msg.location != undefined)
								Fermata_F2_Location_F1(bot, msg, con);
							break;
						case 'Fermata_F2_Location_F1':
							Fermata_F2_Location_F2(bot, msg, con);
							break;
						case 'Fermata_F2_Location_F2':
							Fermata_F2_Location_F3(bot, msg, result.nameT, con);
							break;
						case 'Fermata_F2_Location_F3':
							All_FF(bot, msg, con);
							break;
						case 'Fermata_F2_Name_F1':
							Fermata_F2_Name_F2(bot, msg, con);
							break;
						case 'Fermata_F2_Name_F2':
							Fermata_F2_Name_F3(bot, msg, result.nameT, con);
							break;
						case 'Fermata_F2_Name_F3':
							All_FF(bot, msg, con);
					}
				}
				else if ((result.last_command).includes("Linea")) {
					switch (result.last_command) {
						case 'Linea_F1':
							Linea_F2(bot, msg, con);
							break;
						case 'Linea_F2':
							Linea_F3(bot, msg, result.nameT, con);
							break;
						case 'Linea_F3':
							if(msg.text != undefined)
								Linea_F4_Name_F1 (bot, msg, result.nameT, con);
							else if(msg.location != undefined)
								Linea_F4_Location_F1 (bot, msg, result.nameT, con);
							break;
						case 'Linea_F4_Name_F1':
							All_FF (bot, msg, con);
							break;
						case 'Linea_F4_Location_F1':
							All_FF (bot, msg, con);
					}
				}
				else if ((result.last_command).includes("Next")) {
					switch (result.last_command) {
						case 'Next_F1':
							if(msg.text != undefined)
								Next_F2_Name_F1 (bot, msg, con);
							else if(msg.location != undefined)
								Next_F2_Location_F1 (bot, msg, con);
							break;
						case 'Next_F2_Name_F1':
							Next_F2_Name_F2 (bot, msg, con);
							break;
						case 'Next_F2_Name_F2':
							All_FF (bot, msg, con);
							break;
						case 'Next_F2_Location_F1':
							Next_F2_Location_F2 (bot, msg, con);
							break;
						case 'Next_F2_Location_F2':
							All_FF (bot, msg, con);
					}
				}
				else if (result.last_command == 'Mensa_F1')
					fun.mensaVicina2 (bot, msg, con);
				else if(result.last_command == 'Inserisci_Scadenza')
					dead.addScadenza(bot, msg, con);
				else if(result.last_command == 'Modifica_Scadenza')
					dead.alterScadenza(bot, msg, con);
				else if(result.last_command == 'Elimina_Scadenza')
					dead.deleteScadenza(bot, msg, con);
			});
		})
		.catch(err => {
			bot.sendMessage(id, err);
		});
}

// ---------- EXPORTS ----------
exports.updateStatus = checkID;
exports.isWorking = nextCommand;
exports.fermata = Fermata_F1;
exports.linea = Linea_F1;
exports.nextLinea = Next_F1;
exports.avvisi = avvisiLinee;
