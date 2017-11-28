// ---------- REQUIRE ----------
const db = require('../../TelegramBot/sectionDevelop.js');

var databaseConnection = undefined;

// ---------- FUNCTIONS ----------
function createChoice (array, argument, checkName) {
    let elements = [];

    if(checkName != undefined) {
        var similar = [];
        for(let i = 0; i < array.length; i++)
            if(((array[i])[argument]).toLowerCase().includes(checkName.toLowerCase()))
                similar.push(array[i]);

        array = similar.slice();
    }

    if(array != undefined) {
        for(let i = 0; i < array.length; i++)
            elements.push((array[i])[argument]);
    }

    return elements;
}

function Fermata_F1 (request, response) {
	console.log("Fermata_F1");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var text = "Scegli la fermata dall'elenco:";

			var query = "SELECT DISTINCT stop_name FROM stops";
	        con.query(query, function (err, result) {
	            if (err) throw err;

				var keyboard = createChoice(result, 'stop_name', undefined);

				var json = JSON.stringify ({
					Ask: text,
					Choices: keyboard
				});

				response.end(json);
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
};

function Fermata_F2 (request, response) {
	console.log("Fermata_F2");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var fermata = request.query.name;
	        var tmpF = fermata.replace(/[\W_]/g, '');
	        var nameT1 = "fermata_" + tmpF;

			var query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE stop_name='" + fermata + "'";
	        con.query(query, function (err, result) {
	            if (err) throw err;

	            query = "SELECT DISTINCT route_short_name FROM " + nameT1 + " ORDER BY length(route_short_name) ASC, route_short_name ASC";
	            con.query(query, function (err, result, fields) {
	                if (err) throw err;

	                var text = "Seleziona la linea:";
					var keyboard = createChoice(result, 'route_short_name', undefined);

					var json = JSON.stringify ({
						nameT: nameT1,
						Ask: text,
						Choices: keyboard
					});

					response.end(json);
				});
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
};

function Fermata_F3 (request, response) {
	console.log("Fermata_F3");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var linea = request.query.name;
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

			var nameT1 = request.query.nameT;
			var nameT2 = nameT1 + "_linea_" + tmpL;

			var query = "CREATE TABLE IF NOT EXISTS " + nameT2 + " AS SELECT * FROM " + nameT1 + " WHERE route_short_name='" + linea + "'";
			con.query(query, function (err, result, fields) {
				if (err) throw err;

				query = "SELECT * FROM " + nameT2 + " WHERE arrival_time>'" + clockNow + "' AND " + today + "='1' ORDER BY arrival_time ASC";
				con.query(query, function (err, result, fields) {
					if (err) throw err;

					if(result.length > 0) {
						var json = JSON.stringify ({
							Choices: result
						});

						response.end(json);
					}
					else
						response.end(JSON.stringify({ Ask: "La linea selezionata ha terminato le corse che passano per la fermata selezionata per oggi"}));
				});
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
};

function Linea_F1 (request, response) {
	console.log("Linea_F1");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
	        var query = "SELECT DISTINCT route_short_name FROM routes ORDER BY length(route_short_name) ASC, route_short_name ASC";
	        con.query(query, function (err, result) {
	            if (err) throw err;

	            var text = "Prima di tutto dimmi che linea ti interessa:";
				var keyboard = createChoice(result, 'route_short_name', undefined);

				var json = JSON.stringify ({
					Ask: text,
					Choices: keyboard
				});

				response.end(json);
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
}

function Linea_F2 (request, response) {
	console.log("Linea_F2");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var linea = request.query.name;
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
					var keyboard = createChoice(result, 'trip_headsign', undefined);

					var json = JSON.stringify ({
						nameT: nameT1,
						Ask: text,
						Choices: keyboard
					});

					response.end(json);
				});
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
}

function Linea_F3 (request, response) {
	console.log("Linea_F3");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var direzione = request.query.name;
			var tmpD = direzione.replace(/[\W_]/g, '');

			var nameT1 = request.query.nameT;
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

						var text = "Seleziona una fermata specifica e ti saprò dire dove e quando prendere l'autobus!";
						var keyboard = createChoice(result, 'stop_name', undefined);

						var json = JSON.stringify ({
							nameT: nameT2,
							Ask: text,
							Choices: keyboard
						});

						response.end(json);
					});
				});
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
}

function Linea_F4 (request, response) {
	console.log("Linea_F4");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var date = new Date();
			var clockNow = date.toTimeString();
			clockNow = clockNow.split(' ')[0];

			var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
			var today = weekday[date.getDay()];

			var nameT2 = request.query.nameT;
			var query = "SELECT * FROM " + nameT2 + " WHERE stop_name='" + request.query.name + "' AND arrival_time>'" + clockNow + "' AND " + today + "='1' ORDER BY arrival_time ASC";
			con.query(query, function (err, result, fields) {
				if (err) throw err;

				if(result.length > 0) {
					var json = JSON.stringify ({
						Choices: result
					});

					response.end(json);
				}
				else
					response.end(JSON.stringify({ Ask: "La linea selezionata ha terminato le corse che passano per la fermata selezionata per oggi"}));
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
}

function Next_F1 (request, response) {
	console.log("Next_F1");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var text = "Scrivi il nome della fermata che ti interessa:";

			var query = "SELECT DISTINCT stop_name FROM stops";
	        con.query(query, function (err, result) {
	            if (err) throw err;

				var keyboard = createChoice(result, 'stop_name', undefined);

				var json = JSON.stringify ({
					Ask: text,
					Choices: keyboard
				});

				response.end(json);
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
}

function Next_F2 (request, response) {
	console.log("Next_F2");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var fermata = request.query.name;
			var tmpF = fermata.replace(/[\W_]/g, '');
			var nameT1 = "fermata_" + tmpF;

			var query = "CREATE TABLE IF NOT EXISTS " + nameT1 + " AS SELECT * FROM time_table WHERE stop_name='" + fermata + "'";
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

					if(result.length > 0) {
						var json = JSON.stringify ({
							Choices: result
						});

						response.end(json);
					}
					else
						response.end(JSON.stringify({ Ask: "Mi dispiace ma tutte le linee hanno terminato le corse per oggi"}));
				});
			});
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
}

function Avvisi_Linee (request, response) {
	console.log("Avvisi_Linee");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	db.initiateConnection(databaseConnection)
		.then((con) => {
			databaseConnection = con;
			var date = new Date();
	        var dateNow = date.toISOString().split('T')[0];
	        dateNow = dateNow.replace(/[-]/g, '');

	        var query = "SELECT route_long_name, route_short_name FROM time_table NATURAL JOIN calendar_dates where exception_type='2' AND date='" + dateNow + "' GROUP BY route_short_name";
	        con.query(query, function (err, result, fields) {
	            if (err) throw err;

	            if(result.length > 0) {
	                var text = "Ecco le linee che subiranno variazioni nella giornata odierna:";

					var json = JSON.stringify ({
						Ask: text,
						Choices: result
					});

					response.end(json);
	            }
	            else
					response.end(JSON.stringify({ Ask: "Oggi non ci sono variazioni di orario in alcuna linea"}));
	        });
		})
		.catch(err => {
			response.end(JSON.stringify({ Ask: err }));
		});
}

function switchFermata (request, response) {
	var fase = request.query.fase;

	switch (parseInt(fase)) {
		case 1:
			Fermata_F1 (request, response);
			break;
		case 2:
			Fermata_F2 (request, response);
			break;
		case 3:
			Fermata_F3 (request, response);
			break;
		default:
			response.end(JSON.stringify({ Ask: "Fase della ricerca per Fermata non esistente"}));
	}
}

function switchLinea (request, response) {
	var fase = request.query.fase;

	switch (parseInt(fase)) {
		case 1:
			Linea_F1 (request, response);
			break;
		case 2:
			Linea_F2 (request, response);
			break;
		case 3:
			Linea_F3 (request, response);
			break;
		case 4:
			Linea_F4 (request, response);
			break;
		default:
			response.end(JSON.stringify({ Ask: "Fase della ricerca per Linea non esistente"}));
	}
}

function switchNext (request, response) {
	var fase = request.query.fase;

	switch (parseInt(fase)) {
		case 1:
			Next_F1 (request, response);
			break;
		case 2:
			Next_F2 (request, response);
			break;
		default:
			response.end(JSON.stringify({ Ask: "Fase della ricerca per Next non esistente"}));
	}
}
// ---------- EXPORTS ----------
exports.Fermata = switchFermata;
exports.Linea = switchLinea;
exports.Next = switchNext;
exports.Avvisi_Linee = Avvisi_Linee;
