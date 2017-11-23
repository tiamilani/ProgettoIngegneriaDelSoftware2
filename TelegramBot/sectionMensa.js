// ---------- REQUIRE ----------
const db = require('./sectionDevelop');
const fun = require ('./functions.js');

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

function createHome () {
	return {
		reply_markup: JSON.stringify({
			keyboard: [
				['Mezzi'],
				//['Mensa'],
				//['OperaUniTN'],
				['Luoghi'],
				['Avvisi'],
				['Scadenze'],
                ['Nearest']
			],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };
}

function Mensa_F1 (bot, msg, connection) {
    console.log("Mensa_F1");
	db.initiateConnection(connection)
		.then((con) => {
            var text = "Ora ti indicherò quale mensa è più vicina a te... Inizia con l'inviarmi la tua posizione!";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        [ { text: 'Invia Posizione', request_location: true } ]
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            checkID(msg.chat.id, 'Mensa_F1', con)
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

function Mensa_F2 (bot, msg, connection) {
    console.log("Mensa_F2");
	db.initiateConnection(connection)
		.then((con) => {
            // Povo1_1 - Povo1_2 - Mesiano1 - Mesiano2 - TommasoGar
            var mense = [[46.066917, 11.150173], [46.066917, 11.150173], [46.066202, 11.139990], [46.064463, 11.138816], [46.066946, 11.117216]];
            var myPos = [msg.location.latitude, msg.location.longitude];

            let i;
            let nM;
            let min = 9999999;
            let tmp;
            for (i = 0; i < mense.length; i++)
            {
                tmp = fun.distanceBetween(myPos, mense[i]);
                if(tmp < min)
                {
                    min = tmp;
                    nM = i;
                }
            }

            var text;
            switch(nM) {
                case 0: text = "La mensa attualmente più vicina è:\nPovo1_PastoLesto"; break;
                case 1: text = "La mensa attualmente più vicina è:\nPovo1_PastoCompleto"; break;
                case 2: text = "La mensa attualmente più vicina è:\nMesiano1"; break;
                case 3: text = "La mensa attualmente più vicina è:\nMesiano2"; break;
                case 4: text = "La mensa attualmente più vicina è:\nTommaso_Gar"; break;
            }

            checkID(msg.chat.id, '/start', con)
                .then((result) => {
                    bot.sendLocation(msg.chat.id, (mense[nM])[0], (mense[nM])[1]);
					console.log(createHome());
                    bot.sendMessage(msg.chat.id, text, createHome());
                })
                .catch((err) => {
                    console.error(err);
                });
        })
		.catch(err => {
			bot.sendMessage(msg.chat.id, err);
		});
}

// ---------- EXPORTS ----------
exports.Mensa_F1 = Mensa_F1;
exports.Mensa_F2 = Mensa_F2;
