// ---------- REQUIRE ----------
const fun 	= 	require ('./functions.js');
const db	= 	require ('./sectionDevelop.js');
const emoji	= 	require ('node-emoji');

// ---------- FUNCTIONS ----------
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

		if(rest != 0) {
	        var item = [];
	        for(let j = array.length - rest; j < array.length; j++)
	            item.push((array[j])[argument]);

	        elements.push(item);
		}
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

function getFermate (res, con) {
	return new Promise((resolve, reject) => {
		var date = fun.convertDate(res.arrival_time, "h:m:s");
		date.setMinutes(date.getMinutes() - 5);
		var preOrario = date.toTimeString();
		preOrario = preOrario.split(' ')[0];

		date = fun.convertDate(res.arrival_time, "h:m:s");
		date.setHours(date.getHours() + 2);
		var postOrario = date.toTimeString();
		postOrario = postOrario.split(' ')[0];

		var tmpD = (res.trip_headsign).replace(/[\W_]/g, '');
		var tmpL;
		if((res.route_short_name).indexOf("/") == -1)
			tmpL = res.route_short_name;
		else
			tmpL = (res.route_short_name).substr(0, index) + '$' + (res.route_short_name).substr(index + 1);

		var nameT1 = "filtro_" + tmpL + "_" + tmpD;

		var query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE route_short_name='" + res.route_short_name + "' AND trip_headsign='" + res.trip_headsign + "'";
		con.query(query, function (err, result) {
			if (err) throw err;

			query = "SELECT * FROM " + nameT1 + " WHERE arrival_time>'" + preOrario + "' AND arrival_time<'" + postOrario + "'";
			con.query(query, function (err, result, fields) {
				if (err) throw err;

				var find = false, out = false;
				for(let i = 0; i < result.length && out == false; i++) {
					if(find == false) {
						if(result[i].stop_name == res.stop_name && result[i].arrival_time == res.arrival_time) {
							find = true;
							var text = "\n\n*FERMATE*";
							text += emoji.emojify("\n:point_right: :clock3: " + result[i].arrival_time + " -> :busstop: " + result[i].stop_name);
						}
					} else {
						if(result[i].stop_sequence != 1)
							text += emoji.emojify("\n:clock3: " + result[i].arrival_time + " -> :busstop: " + result[i].stop_name);
						else
							out = true;
					}
				}

				return resolve(text);
			});
		});
	});
}

function printText (item, fermate, con) {
	return new Promise((resolve, reject) => {
	    var text = "";
		if(item.trip_headsign != undefined)
			text += "*PRESTA ATTENZIONE ALLA DIREZIONE*";

	    if(item.route_short_name != undefined)
	        text += "\nLinea " + item.route_short_name + " (" + item.route_long_name + ")";

		if(item.trip_headsign != undefined)
	        text += "\nDirezione: *" + item.trip_headsign + "*";

	    if(item.stop_name != undefined)
	        text += emoji.emojify("\n:busstop: " + item.stop_name);

	    if(item.distance != undefined)
	        text += "\nDistanza: *" + Math.round(item.distance) + "* metri";

	    if(item.arrival_time != undefined) {
	        if(item.arrival_time === item.departure_time)
	            text += emoji.emojify("\n:clock3: " + item.arrival_time);
	        else {
	            var t2 = fun.convertDate(item.arrival_time, "h:m:s");
	            var t1 = fun.convertDate(item.departure_time, "h:m:s")

	            let diff = parseInt((t1-t2)/(60*1000));
	            text += emoji.emojify("\n:clock3: " + item.arrival_time + ", ma partirà " + diff + " minuti dopo!");
	        }
	    }

		if(item.wheelchair_boarding != undefined) {
	        switch(parseInt(item.wheelchair_boarding)) {
	            /*case 0:
	                text += "\n- Fermata attrezzata: Info non presente";
	                break;*/
	            case 1:
	                text += emoji.emojify("\n:wheelchair: Fermata attrezzata");
	                break;
	            case 2:
	                text += emoji.emojify("\n:wheelchair: Fermata *non* attrezzata");
	                break;
	        }
	    }

	    if(item.wheelchair_accessible != undefined) {
	        switch(parseInt(item.wheelchair_accessible)) {
	            /*case 0:
	                text += "\n- Veicolo attrezzato: Info non presente";
	                break;*/
	            case 1:
	                text += emoji.emojify("\n:wheelchair: Veicolo attrezzato (Max 1)");
	                break;
	            case 2:
	                text += emoji.emojify("\n:wheelchair: Veicolo *non* attrezzato");
	                break;
	        }
	    }

		if(fermate == true) {
			getFermate(item, con).then((res) => {
				text += res;
				return resolve(text);
			});
		} else { return resolve(text); }
	});
}

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

function Fermata_F1 (bot, msg, connection) {
	console.log("Fermata_F1");
	db.initiateConnection(connection)
		.then((con) => {
		    var text = "Inviami la tua posizione o scrivi specifica il nome di una fermata:";
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
					printText(res[0], false, undefined)
						.then((testo) => {
							bot.sendMessage(msg.chat.id, testo, getPagination(1, res.length));
						});
				})
				.catch(err => {
					console.error(err);
				});
		});
	}
	else {
		checkID(msg.chat.id, '/start', con)
			.then((result) => {
				var text = emoji.emojify("Sei troppo lontano, cerca di avvicinarti :disappointed_relieved:");

				bot.sendMessage(msg.chat.id, text, db.createHome());
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
						printText(res[prevChoice-1], false, undefined)
							.then((testo) => {
								bot.editMessageText(testo, {chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "Markdown"});
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

								printText(res[prevChoice-1], false, undefined)
									.then((testo) => {
										bot.editMessageText(testo, options);
									});
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
											printText(res[0], false, undefined)
												.then((testo) => {
				                    				bot.sendMessage(msg.chat.id, testo, getPaginationFull(1, res.length));
												});
										})
										.catch(err => {
											console.error(err);
										});
								});
							} else {
								checkID(msg.chat.id, '/start', con)
									.then((result) => {
										var text = emoji.emojify("Mi dispiace ma la linea selezionata ha terminato le corse per oggi :disappointed:");

										bot.sendMessage(msg.chat.id, text, db.createHome());
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
							var text = emoji.emojify("La linea inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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

				var text = emoji.emojify("Ho trovato queste fermate :thinking_face:");
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

				                var text = "Seleziona una linea:";
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
							var text = emoji.emojify("La linea fermata non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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
											printText(res[0], false, undefined)
												.then((testo) => {
					                    			bot.sendMessage(msg.chat.id, testo, getPaginationFull(1, res.length));
												});
										})
										.catch(err => {
											console.error(err);
										});
								});
							}
							else {
								checkID(msg.chat.id, '/start', con)
									.then((result) => {
										var text = emoji.emojify("Mi dispiace ma la linea selezionata ha terminato le corse per oggi :disappointed:");

										bot.sendMessage(msg.chat.id, text, db.createHome());
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
							var text = emoji.emojify("La linea inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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

function Linea_F1 (bot, msg, connection) {
	console.log("Linea_F1");
	db.initiateConnection(connection)
		.then((con) => {
	        var query = "SELECT DISTINCT route_short_name FROM routes ORDER BY length(route_short_name) ASC, route_short_name ASC";
	        con.query(query, function (err, result) {
	            if (err) throw err;

	            var text = "Seleziona una linea:";
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

		                    var text = "Seleziona la direzione della corsa:";
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
							var text = emoji.emojify("La linea inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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

								var text = "Inviami la tua posizione o scrivi il nome di una fermata specifica:";
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
							var text = emoji.emojify("La direzione inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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
							var text = emoji.emojify("Mi dispiace ma la linea selezionata ha terminato le corse per oggi :disappointed:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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
										printText(res[0], false, undefined)
											.then((testo) => {
												bot.sendMessage(msg.chat.id, testo, getPaginationFull(1, res.length));
											});
									})
									.catch(err => {
										console.error(err);
									});
							});
						} else {
							checkID(msg.chat.id, '/start', con)
								.then((result) => {
									var text = emoji.emojify("Mi dispiace ma la linea selezionata ha terminato le corse per oggi :disappointed:");

									bot.sendMessage(msg.chat.id, text, db.createHome());
								})
								.catch(err => {
									console.error(err);
								});
				        }
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = emoji.emojify("La linea inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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

function Next_F1 (bot, msg, connection) {
	console.log("Next_F1");
	db.initiateConnection(connection)
		.then((con) => {
	        var text = "Inviami la tua posizione o scrivi il nome di una fermata specifica:";
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
						printText(res[prevChoice-1], false, undefined)
							.then((testo) => {
								bot.editMessageText(testo, {chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "Markdown"});
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

				                    query = "SELECT stop_name,stop_lat,stop_lon,wheelchair_boarding,MIN(arrival_time) AS arrival_time,MIN(departure_time) AS departure_time,trip_headsign,wheelchair_accessible,route_short_name,route_long_name,route_type FROM " + nameT1 + " where arrival_time>'" + clockNow + "' AND " + today + "='1' GROUP BY route_short_name,trip_headsign ORDER BY arrival_time ASC";
				                    con.query(query, function (err, result, fields) {
				                        if (err) throw err;
										var res = result;

				                        if(result.length > 0) {
											var query = "UPDATE users SET prevChoice='1',lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.message.chat.id + "'";
											con.query(query, function (err, result) {
												if (err) throw err;

												checkID(msg.message.chat.id, 'Next_F2_Location_F2', con)
													.then((status) => {
														printText(res[0], true, con)
															.then((testo) => {
																bot.sendMessage(msg.message.chat.id, testo, getPaginationFull(1, res.length));
															});
													})
													.catch(err => {
														console.error(err);
													});
											});
										} else {
											checkID(msg.message.chat.id, '/start', con)
												.then((result) => {
													var text = emoji.emojify("Mi dispiace ma per oggi sono terminate le corse in questa fermata, oppure non lavora oggi :disappointed:");

													bot.sendMessage(msg.message.chat.id, text, db.createHome());
												})
												.catch(err => {
													console.error(err);
												});
										}
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

								printText(res[prevChoice-1], false, undefined)
									.then((testo) => {
			                			bot.editMessageText(testo, options);
									});
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

function Next_F2_Name_F1 (bot, msg, connection) {
	console.log("Next_F2_Name_F1");
	db.initiateConnection(connection)
		.then((con) => {
		    var fermata = msg.text;

		    var query = "SELECT DISTINCT stop_name FROM stops";
		    con.query(query, function (err, result) {
		        if (err) throw err;

		        var text = emoji.emojify("Ho trovato queste fermate :thinking_face:");
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

		                query = "SELECT stop_name,stop_lat,stop_lon,wheelchair_boarding,MIN(arrival_time) AS arrival_time,MIN(departure_time) AS departure_time,trip_headsign,wheelchair_accessible,route_short_name,route_long_name,route_type FROM " + nameT1 + " where arrival_time>'" + clockNow + "' AND " + today + "='1' GROUP BY route_short_name,trip_headsign ORDER BY arrival_time ASC";
		                con.query(query, function (err, result, fields) {
		                    if (err) throw err;

							var res = result;

			                if(res.length > 0) {
								var query = "UPDATE users SET lastResult='" + JSON.stringify(res) + "' WHERE ChatID='" + msg.chat.id + "'";
								con.query(query, function (err, result) {
									if (err) throw err;

									checkID(msg.chat.id, 'Next_F2_Name_F2', con)
										.then((result) => {
											printText(res[0], true, con)
												.then((testo) => {
													bot.sendMessage(msg.chat.id, testo, getPaginationFull(1, res.length));
												});
										})
										.catch(err => {
											console.error(err);
										});
								});
							}
							else {
								checkID(msg.chat.id, '/start', con)
									.then((result) => {
										var text = emoji.emojify("Mi dispiace ma tutte le linee hanno terminato le corse per oggi :disappointed:");

										bot.sendMessage(msg.chat.id, text, db.createHome());
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
							var text = emoji.emojify("La fermata inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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
								printText(res[prevChoice-1], false, undefined)
									.then((testo) => {
										bot.editMessageText(testo, {chat_id: msg.message.chat.id,message_id: msg.message.message_id,parse_mode: "Markdown"});
										bot.sendMessage(msg.message.chat.id, emoji.emojify("Ecco la posizione selezionata :blush:"), db.createHome());
							            bot.sendLocation(msg.message.chat.id, res[prevChoice-1].stop_lat, res[prevChoice-1].stop_lon);
									});
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

								printText(res[prevChoice-1], false, undefined)
									.then((testo) => {
			                			bot.editMessageText(testo, options);
									});
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

function All_FF_B (bot, msg, connection) {
	console.log("Stato Finale");
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
								printText(res[prevChoice-1], true, con)
									.then((testo) => {
										bot.editMessageText(testo, {chat_id: msg.message.chat.id,message_id: msg.message.message_id,parse_mode: "Markdown"});
										bot.sendMessage(msg.message.chat.id, emoji.emojify("Ecco la posizione selezionata :blush:"), db.createHome());
							            bot.sendLocation(msg.message.chat.id, res[prevChoice-1].stop_lat, res[prevChoice-1].stop_lon);
									});
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

								printText(res[prevChoice-1], true, con)
									.then((testo) => {
			                			bot.editMessageText(testo, options);
									});
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

function CalcolaPercorso_F1 (bot, msg, connection) {
	console.log("CalcolaPercorso_F1");
	db.initiateConnection(connection)
		.then((con) => {
	        var text = "Scrivi il nome della fermata di partenza:";
			checkID(msg.chat.id, 'CalcolaPercorso_F1', con)
				.then((result) => {
			        bot.sendMessage(msg.chat.id, text, createChoice(undefined, undefined, undefined, undefined, undefined));
				})
				.catch(err => {
					console.error(err);
				});
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

function CalcolaPercorso_F2 (bot, msg, connection) {
	console.log("CalcolaPercorso_F2");
	db.initiateConnection(connection)
		.then((con) => {
		    var fermata = msg.text;

		    var query = "SELECT DISTINCT stop_name FROM stops";
		    con.query(query, function (err, result) {
		        if (err) throw err;

		        var text = emoji.emojify("Ho trovato queste fermate :thinking_face:");
				var keyboard = createChoice(result, 2, 'stop_name', fermata, false);

				var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
				var stringKeyboard = [].concat.apply([], keyboardString);

				query = "UPDATE users SET keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
				con.query(query, function (err, result) {
					if (err) throw err;

					checkID(msg.chat.id, 'CalcolaPercorso_F2', con)
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

function CalcolaPercorso_F3 (bot, msg, connection) {
	console.log("CalcolaPercorso_F3");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				if(JSON.parse(result[0].keyboard).includes(msg.text)) {

					var query = "SELECT * FROM stops WHERE stop_name='" + msg.text + "'";
				    con.query(query, function (err, result) {
				        if (err) throw err;

						query = "UPDATE users SET lastResult='" + JSON.stringify({ start: result[0] }) + "' WHERE ChatID='" + msg.chat.id + "'";
						con.query(query, function (err, result) {
							if (err) throw err;

							var text = "Ora dimmi il nome della fermata di arrivo:";
							checkID(msg.chat.id, 'CalcolaPercorso_F3', con)
								.then((result) => {
							        bot.sendMessage(msg.chat.id, text, createChoice(undefined, undefined, undefined, undefined, undefined));
								})
								.catch(err => {
									console.error(err);
								});
						});
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = emoji.emojify("La fermata inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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

function CalcolaPercorso_F4 (bot, msg, connection) {
	console.log("CalcolaPercorso_F4");
	db.initiateConnection(connection)
		.then((con) => {
		    var fermata = msg.text;

		    var query = "SELECT DISTINCT stop_name FROM stops";
		    con.query(query, function (err, result) {
		        if (err) throw err;

		        var text = emoji.emojify("Ho trovato queste fermate :thinking_face:");
				var keyboard = createChoice(result, 2, 'stop_name', fermata, false);

				var keyboardString = JSON.parse(keyboard.reply_markup).keyboard;
				var stringKeyboard = [].concat.apply([], keyboardString);

				query = "UPDATE users SET keyboard='" + JSON.stringify(stringKeyboard) + "' WHERE ChatID='" + msg.chat.id + "'";
				con.query(query, function (err, result) {
					if (err) throw err;

					checkID(msg.chat.id, 'CalcolaPercorso_F4', con)
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

function CalcolaPercorso_F5 (bot, msg, connection) {
	console.log("CalcolaPercorso_F5");
	db.initiateConnection(connection)
		.then((con) => {
			var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
			con.query(query, function (err, result) {
				if (err) throw err;

				var position = JSON.parse(result[0].lastResult);
				if(JSON.parse(result[0].keyboard).includes(msg.text)) {
					var query = "SELECT * FROM stops WHERE stop_name='" + msg.text + "'";
				    con.query(query, function (err, result) {
				        if (err) throw err;

						position['end'] = result[0];
						query = "UPDATE users SET lastResult='" + JSON.stringify(position) + "' WHERE ChatID='" + msg.chat.id + "'";
						con.query(query, function (err, result) {
							if (err) throw err;

							var text = emoji.emojify("Perfetto, ora calcolo il miglior tragitto :blush:");
							checkID(msg.chat.id, 'CalcolaPercorso_F5', con)
								.then((result) => {
							        bot.sendMessage(msg.chat.id, text).then(() => {
										var query = "SELECT * FROM users WHERE ChatID='" + msg.chat.id + "'";
										con.query(query, function (err, result) {
											if (err) throw err;

											const googleMapsClient = require('@google/maps').createClient({
												key: 'AIzaSyAF4HQHn5WAq-I71yHRse42ferATYB3__U',
												Promise: Promise
											});

											var elem = JSON.parse(result[0].lastResult);

											var options = {
												origin: [ elem['start'].stop_lat, elem['start'].stop_lon ],
												destination: [ elem['end'].stop_lat, elem['end'].stop_lon ],
												mode: 'transit',
												transit_mode: 'bus',
												language: 'it'
											};

											// Geocode an address with a promise
											googleMapsClient.directions(options).asPromise()
												.then((response) => {
													response = response.json.routes[0].legs[0];

													text = "Orario di partenza: " + response.departure_time.text + "\nOrario di arrivo: " + response.arrival_time.text;
													text += "\nDurata: " + response.duration.text + "\nDistanza: " + response.distance.text;
													text += "\nPartenza: " + response.start_address + "\nArrivo: " + response.end_address;
													text += "\n\n";

													response = response.steps;
													for(let i = 0; i < response.length; i++) {
														if(i != 0 && i != response.length -1) {
															if(response[i].travel_mode == "TRANSIT") {
																text += "\nDurata: " + response[i].duration.text + "\nDistanza: " + response[i].distance.text;
																text += "\nPartenza: " + response[i].transit_details.departure_stop.name + "\nArrivo: " + response[i].transit_details.arrival_stop.name;

																text += "\nLinea " + response[i].transit_details.line.short_name + " (" + response[i].transit_details.line.name + ")";
																text += "\nDirezione: " + response[i].transit_details.headsign;
																text += "\n\n";
															} else {
																text += "\n" + response[i].html_instructions;
																text += "\n\n";
															}
														}
													}

													bot.sendMessage(msg.chat.id, text, db.createHome());
												})
												.catch((err) => {
													console.log(err);
												});
										});
									});
								})
								.catch(err => {
									console.error(err);
								});
						});
					});
				} else {
					checkID(msg.chat.id, '/start', con)
						.then((result) => {
							var text = emoji.emojify("La fermata inserita non è stata riconosciuta :disappointed_relieved:");

							bot.sendMessage(msg.chat.id, text, db.createHome());
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

function Avvisi_Linee (bot, msg, connection) {
	console.log("Avvisi_Linee");
	db.initiateConnection(connection)
		.then((con) => {
	        var date = new Date();
	        var dateNow = date.toISOString().split('T')[0];
	        dateNow = dateNow.replace(/[-]/g, '');

	        let query = "SELECT route_long_name, route_short_name FROM time_table NATURAL JOIN calendar_dates where exception_type='2' AND date='" + dateNow + "' GROUP BY route_short_name";
	        con.query(query, function (err, result, fields) {
	            if (err) throw err;

	            if(result.length > 0) {
	                var text = emoji.emojify("Ecco le linee che subiranno variazioni nella giornata odierna :disappointed_relieved:");
	                for(let i = 0; i < result.length; i++)
	                    text += "\n*Linea " + result[i].route_short_name + "* (" + result[i].route_long_name + ")";

	                bot.sendMessage(msg.chat.id, text, {parse_mode: 'Markdown'});
	            }
	            else {
	                bot.sendMessage(msg.chat.id, emoji.emojify("Oggi non ci sono variazioni di orario in alcuna linea :blush:"));
	            }
	        });
		})
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

// ---------- EXPORTS ----------
exports.Fermata_F1 = Fermata_F1;
exports.Location_Init = Location_Init;
exports.Fermata_F2_Location_F1 = Fermata_F2_Location_F1;
exports.Fermata_F2_Location_F2 = Fermata_F2_Location_F2;
exports.Fermata_F2_Location_F3 = Fermata_F2_Location_F3;
exports.Fermata_F2_Name_F1 = Fermata_F2_Name_F1;
exports.Fermata_F2_Name_F2 = Fermata_F2_Name_F2;
exports.Fermata_F2_Name_F3 = Fermata_F2_Name_F3;

exports.Linea_F1 = Linea_F1;
exports.Linea_F2 = Linea_F2;
exports.Linea_F3 = Linea_F3;
exports.Linea_F4_Location_F1 = Linea_F4_Location_F1;
exports.Linea_F4_Name_F1 = Linea_F4_Name_F1;

exports.Next_F1 = Next_F1;
exports.Next_F2_Location_F1 = Next_F2_Location_F1;
exports.Next_F2_Location_F2 = Next_F2_Location_F2;
exports.Next_F2_Name_F1 = Next_F2_Name_F1;
exports.Next_F2_Name_F2 = Next_F2_Name_F2;
exports.All_FF = All_FF;
exports.All_FF_B = All_FF_B;

exports.CalcolaPercorso_F1 = CalcolaPercorso_F1;
exports.CalcolaPercorso_F2 = CalcolaPercorso_F2;
exports.CalcolaPercorso_F3 = CalcolaPercorso_F3;
exports.CalcolaPercorso_F4 = CalcolaPercorso_F4;
exports.CalcolaPercorso_F5 = CalcolaPercorso_F5;

exports.Avvisi_Linee = Avvisi_Linee;
