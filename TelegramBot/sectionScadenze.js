// ---------- REQUIRE ----------
const db = require('./sectionDevelop');

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
						var query = "UPDATE users SET last_command='" + lastCommand + "' WHERE ChatID='" + id + "'";
				        con.query(query, function (err, result) {
				            if (err) return reject(err);

							return resolve("Success");
						});
					}
				});
			})
			.catch(err => {
				bot.sendMessage(id, err);
			});
	});
}

function createScadenze () {
	return {
        reply_markup: JSON.stringify({
			keyboard: [
				['Home'],
				['Inserisci_Scadenza','Modifica_Scadenza'],
				['Elimina_Scadenza']
			],
            resize_keyboard: true
        })
    };
}

function mostraScadenze (bot, id, connection) {
    console.log("mostraScadenze");
	db.initiateConnection(connection)
		.then((con) => {
            var query = "SELECT * FROM deadline";
            con.query(query, function (err, result, fields) {
                if (err) throw err;

                if(result.length > 0) {
                    var text = "Ecco le scadenze attualmente in vigore:";

                    for(let i = 0; i < result.length; i++) {
                        if(result[i].dataInizio != null)
                            text += "\n\nArgomento: *" + result[i].descrizione + "*\nData di Inizio: *" + result[i].dataInizio + "*\nData di Fine: *" + result[i].dataFine + "*";
                        else
                            text += "\n\nArgomento: *" + result[i].descrizione + "*\nData di Fine: *" + result[i].dataFine + "*";
                    }

                    bot.sendMessage(id, text, {parse_mode: "Markdown"});
                }
                else {
                    bot.sendMessage(id, "Non ci sono scadenze attualmente!");
                }
            });
        })
		.catch(err => {
			bot.sendMessage(id, err);
		});
}

function mostraScadenzeStatus (bot, id, connection, stato) {
    console.log("mostraScadenzeStatus");
	db.initiateConnection(connection)
		.then((con) => {
            var query = "SELECT * FROM deadline";
            con.query(query, function (err, result, fields) {
                if (err) throw err;

                var text;

                if(result.length > 0) {
                    text = "Selezona l'ID che desideri:";

                    for(let i = 0; i < result.length; i++) {
                        if(result[i].dataInizio != null)
                            text += "\n\nID: *" + result[i].deadID + "*\nArgomento: *" + result[i].descrizione + "*\nData di Inizio: *" + result[i].dataInizio + "*\nData di Fine: *" + result[i].dataFine + "*";
                        else
                            text += "\n\nID: *" + result[i].deadID + "*\nArgomento: *" + result[i].descrizione + "*\nData di Fine: *" + result[i].dataFine + "*";
                    }
                }
                else {
                    text = "Non ci sono scadenze attualmente, inserisci la prima!";
                }

                checkID(id, stato, con)
                    .then((result) => {
                        bot.sendMessage(id, text, {parse_mode: "Markdown"});
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        })
		.catch(err => {
			bot.sendMessage(id, err);
		});
}

function inserisciScadenza (bot, msg, connection) {
    console.log("inserisciScadenza");
	db.initiateConnection(connection)
		.then((con) => {
            var testo = (msg.text).split(',');

            testo[0] = testo[0].replace(/'/g, "\\'");
            testo[0] = testo[0].toLowerCase();
            testo[0] = testo[0].replace(/\b\w/g, l => l.toUpperCase());

            var query = "INSERT INTO deadline (descrizione,";
            if(testo[1] != '')
                query += "dataInizio,";

            query += "dataFine) VALUES ('" + testo[0] + "','";
            if(testo[1] != '')
                query += testo[1] + "','";

            query += testo[2] + "')";
            con.query(query, function (err, result) {
                if (err) throw err;

                checkID(msg.chat.id, '/start', con)
                    .then((result) => {
                        bot.sendMessage(msg.chat.id, "Scadenza Inserita", createScadenze());
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

function modificaScadenza (bot, msg, connection) {
    console.log("modificaScadenza");
	db.initiateConnection(connection)
		.then((con) => {
            var testo = (msg.text).split(',');

            testo[1] = testo[1].replace(/'/g, "\\'");
            testo[1] = testo[1].toLowerCase();
            testo[1] = testo[1].replace(/\b\w/g, l => l.toUpperCase());

            var query = "UPDATE deadline SET descrizione='" + testo[1] + "',";
            if(testo[2] != '')
                query += "dataInizio='" + testo[2] + "',";
            else
                query += "dataInizio=null,";
            query += "dataFine='" + testo[3] + "' WHERE deadID=" + testo[0];
            con.query(query, function (err, result) {
                if (err) throw err;

                checkID(msg.chat.id, '/start', con)
                    .then((result) => {

                        bot.sendMessage(msg.chat.id, "Scadenza Modificata", createScadenze());
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

function eliminaScadenza (bot, msg, connection) {
    console.log("eliminaScadenza");
	db.initiateConnection(connection)
		.then((con) => {
            var query = "DELETE FROM deadline WHERE deadID='" + msg.text + "'";
            con.query(query, function (err, result) {
                if (err) throw err;

                checkID(msg.chat.id, '/start', con)
                    .then((result) => {

                        bot.sendMessage(msg.chat.id, "Scadenza Eliminata", createScadenze());
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

// ---------- EXPORTS ----------

exports.mostraScadenze = mostraScadenze;
exports.mostraScadenzeStatus = mostraScadenzeStatus;
exports.inserisciScadenza = inserisciScadenza;
exports.modificaScadenza = modificaScadenza;
exports.eliminaScadenza = eliminaScadenza;
