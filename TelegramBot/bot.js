// ---------- REQUIRE ----------
const http = require ('http');
const TelegramBot = require('node-telegram-bot-api');
const fun = require ('./functions.js');
const place = require ('./places.js');
const fs = require('fs');
const ext = require('path');
const mongoose = require('mongoose');
const tte = require('download-file');
const unzip = require('adm-zip');
const csv = require('fast-csv');
const Join = require('mongo-join');

console.log('REQUIRE FATTI');
// ---------- BOT CONFIG ----------
// replace the value below with the Telegram token you receive from @BotFather
const token = '417759810:AAFHuTH4figL2WqKsEGem0ZIggf6zbonV80';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
console.log('BOT STARTED');

// ---------- FEATURES ----------

var importCsv = function (dirFile, file, nameFile, con) {
    var create = "";
    var insert = "";
    var headers = [];
    let i, c = 0;

    csv.fromPath(dirFile)
    .transform(function(data) {
        for(j = 0; j < data.length; j++) {
            data[j] = data[j].replace(/"/g, '');
            data[j] = data[j].replace(/'/g, '');
        }
        return data;
    })
    .on("data", function(data) {
        if(c == 0) {
            c = 1;
            create += "CREATE TABLE " + nameFile + ' (';
            insert += "INSERT INTO " + nameFile + ' (';
            headers = data.slice();

            for(j = 0; j < headers.length; j++)
            {
                create += headers[j] + " VARCHAR(255)";
                insert += headers[j];
                if(j != headers.length - 1)
                {
                    create += ', ';
                    insert += ', ';
                }
            }

            create += ');';
            insert += ') VALUES ';
        }
        else {
            headers = data.slice();
            insert += '(';

            for(j = 0; j < headers.length; j++)
            {
                insert += '\'' + headers[j] + '\'';
                if(j != headers.length - 1)
                    insert += ', ';
            }

            insert += '),';
        }
    })
    .on("end", function() {
        var index = insert.lastIndexOf(",");
        insert = insert.substr(0, index) + ';';
        console.log("DOING " + nameFile);
        //console.log("CREATE: " + create + "\nINSERT: " + insert);
        con.query(create, function (err, result) {
            if (err) throw err;
            con.query(insert, function (err, result) {
                if (err) throw err;

                console.log("\tDONE " + nameFile);
            });
        });
    });

    return;
}

bot.on('text', (msg) => {
    if (msg.text.toLowerCase().includes("giulia") || msg.text.toLowerCase().includes("ilaria") || msg.text.toLowerCase().includes("virginia")) {
        bot.sendMessage(msg.chat.id, "Ti Amo <3");
    }
    else if(msg.text.toLowerCase() === "se2")
    {
        var text = "In questa sezione puoi ottenere il menu e visualizzare le telecamere delle mense";
    	var keyboard = {
            reply_markup: JSON.stringify({
                keyboard: [
    				['/Povo1_PastoLesto', '/Povo1_PastoCompleto'],
    				['/Mesiano_1', '/Mesiano_2'],
    				['/Tommaso_Gar', '/Menu_Mensa'],
    				['/Nearest', '/Imposta_Promemoria_Mensa']
                ],
                one_time_keyboard: true,
                resize_keyboard: true
            })
        };

        bot.sendMessage(msg.chat.id, text, keyboard);
    }
    else if(msg.text.toLowerCase() === "join") {
        var mysql = require('mysql');

        var con = mysql.createConnection({
            host: "db4free.net",
            user: "andreafadi",
            password: "fabioCasati",
            database: "ttesercizio"
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");

            var query = "CREATE TABLE IF NOT EXISTS time_table AS SELECT * FROM ((routes NATURAL JOIN trips) NATURAL JOIN stop_times) NATURAL JOIN stops;";
            con.query(query, function (err, result) {
                if (err) throw err;

                console.log("view generale creata");
            });
        });
    }
    else if(msg.text.toLowerCase() === "col") {
        var mysql = require('mysql');

        var con = mysql.createConnection({
          host: "db4free.net",
          user: "andreafadi",
          password: "fabioCasati",
          database: "ttesercizio",
          multipleStatements: true
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");

            var query = "ALTER TABLE routes DROP agency_id, DROP route_color, DROP route_text_color;";
            query += "CREATE INDEX route_id ON routes (route_id);";
            query += "ALTER TABLE trips DROP shape_id; CREATE INDEX trips ON trips (route_id);";
            query += "CREATE INDEX stop_times ON stop_times (stop_id);";
            query += "CREATE INDEX stops ON stops (stop_id);";

            con.query(query, function (err, result) {
                if (err) throw err;

                console.log("Colonne eliminate, Index creati");
            });
        });
    }
    else if(msg.text.toLowerCase() === "sql") {
        var url = "http://www.ttesercizio.it/opendata/google_transit_urbano_tte.zip";

        var options = {
            directory: "./tte_db",
            filename: "tte_urbano.zip"
        };

        tte(url, options, function(err) {
            if (err) return console.log(err);
            console.log("DOwnload DONE");
            var zip = new unzip("./tte_db/tte_urbano.zip");

            zip.extractAllToAsync('./tte_db', true, function (err) {
                if (err) return console.log(err);
                console.log("UNZIP DONE");
                var mysql = require('mysql');

                var con = mysql.createConnection({
                  host: "db4free.net",
                  user: "andreafadi",
                  password: "fabioCasati",
                  database: "ttesercizio"
                });

                con.connect(function(err) {
                    if (err) throw err;
                    console.log("Connected!");

                    /*con.query("SHOW TABLES;", function (err, result) {
                        if (err) throw err;
                        console.log(result[0].Tables_in_ttesercizio);
                        for(j = 0; j < result.length; j++)
                        con.query("DROP TABLE " + result[j].Tables_in_ttesercizio, function (err, result) {
                            if (err) throw err;
                            console.log("Delete: " + result[j].Tables_in_ttesercizio);
                        });
                    });*/

                    var tmpFiles = fs.readdirSync('./tte_db');
                    let fileName;
                    for(i = 0; i < tmpFiles.length; i++)
                    {
                        fileName = ext.parse(tmpFiles[i]).name;

                        if(tmpFiles[i].includes("agency") || tmpFiles[i].includes("feed") || tmpFiles[i].includes(".zip") || tmpFiles[i].includes("shape"))
                            fs.unlinkSync('./tte_db' + '/' + tmpFiles[i]);
                        else if(tmpFiles[i].includes(".txt"))
                            fs.renameSync('./tte_db' + '/' + tmpFiles[i], './tte_db' + '/' + fileName + '.csv');
                    }

                    tmpFiles = fs.readdirSync('./tte_db');
                    for(i = 0; i < tmpFiles.length; i++) {
                        var dirFile = './tte_db/' + tmpFiles[i];
                        var file = tmpFiles[i];
                        var nameFile = ext.parse(file).name;

                        importCsv(dirFile, file, nameFile, con);
                    }
                });
            });
        });
    }
});

bot.onText(/\/Bandi_BdS/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/borse-di-studio', './Bandi_BdS', bot, msg);
});

bot.onText(/\/Graduatorie_BdS/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/borse-di-studio/graduatorie', './Graduatorie_BdS', bot, msg);
});

bot.onText(/\/Bandi_150O/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/150-ore/bandi', './Bandi_150O', bot, msg);
});

bot.onText(/\/Graduatorie_15O/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/150-ore/graduatorie', './Graduatorie_15O', bot, msg);
});

bot.onText(/\/Menu_Mensa/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/ristorazione/menu', './Menu_Mensa', bot, msg);
});

bot.onText(/\/Imposta_Promemoria_Bandi/, (msg) => {
	setTimeout(function () {
		bot.sendMessage(msg.chat.id, "Hai impostato un promemoria 10 minuti fa!");
	}, 600 * 1000);
});

bot.onText(/\/Povo1_PastoLesto/, (msg) => {
    bot.sendPhoto(msg.chat.id, "./WebcamMense/Povo01.jpg", {caption : "Mensa Pasto Completo di Povo1"} );

    /*var options = { method: "HEAD", host: "ftp.tn.ymir.eu", port: 80, path: "/Povo01.jpg" };
	var request = http.request ( options, function ( response ) {
    	if(response.statusCode === 200)
			bot.sendPhoto(msg.chat.id, "http://ftp.tn.ymir.eu/Povo01.jpg", {caption : "Mensa Pasto Lesto di Povo1"} );
		else
			bot.sendMessage(msg.chat.id, "Sembra che la videocamera abbia qualcosa che non va...");
	});

	request.end();*/
});

bot.onText(/\/Povo1_PastoCompleto/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/Povo02.jpg", {caption : "Mensa Pasto Completo di Povo1"} );
});

bot.onText(/\/Mesiano_1/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/mesiano01.jpg", {caption : "Mensa di Mesiano"} );
});

bot.onText(/\/Mesiano_2/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/mesiano02.jpg", {caption : "Mensa di Mesiano"} );
});

bot.onText(/\/Tommaso_Gar/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/tgar.jpg", {caption : "Mensa di Tommaso Gar"} );
});

bot.onText(/\/Imposta_Promemoria_Mensa/, (msg) => {
	setTimeout(function () {
		bot.sendMessage(msg.chat.id, "Hai impostato un promemoria 10 minuti fa!");
	}, 600 * 1000);
});

bot.onText(/\/Bus/, (msg) => {
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "db4free.net",
        user: "andreafadi",
        password: "fabioCasati",
        database: "ttesercizio"
    });

    con.connect(function(err) {
        if (err) throw err;

        con.query("SELECT DISTINCT route_short_name FROM routes ORDER BY route_short_name ASC", function (err, result) {
            if (err) throw err;

            var text = "Prima di tutto dimmi che linea ti interessa";
            var elements = [];
            let i;
            for(i = 0; i < result.length; i++)
                elements.push([result[i].route_short_name]);

            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: elements,
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            bot.sendMessage(msg.chat.id, text, keyboard).then(() => {
                bot.once('text', (msg) => {

                    var linea = parseInt(msg.text);
                    if (!isNaN(linea))
                    {
                        con.query("CREATE TABLE IF NOT EXISTS linea_" + linea + " AS SELECT DISTINCT trip_headsign FROM time_table WHERE route_short_name='" + linea + "';", function (err, result) {
                            if (err) throw err;

                            con.query("SELECT * FROM linea_" + linea, function (err, result, fields) {
                                if (err) throw err;

                                var text = "Seleziona la direzione";

                                elements = [];
                                for(i = 0; i < result.length; i++)
                                    elements.push([result[i].trip_headsign]);

                                var keyboard = {
                                    reply_markup: JSON.stringify({
                                        keyboard: elements,
                                        one_time_keyboard: true,
                                        resize_keyboard: true
                                    })
                                };

                                bot.sendMessage(msg.chat.id, text, keyboard).then(() => {
                                    bot.once('text', (msg) => {
                                        var fermata = msg.text;
                                        var tmpF = fermata.replace(/[\W_]/g, '');

                                        console.log(fermata);
                                        console.log(tmpF);

                                        var date = new Date();
                                        date.setMinutes(date.getMinutes() - 5);
                                        var hour1 = date.getHours();
                                        var minute1 = date.getMinutes();
                                        date.setMinutes(date.getMinutes() + 50);
                                        var hour2 = date.getHours();
                                        var minute2 = date.getMinutes();
                                        var second = date.getSeconds();
                                        var clockPre = hour1 + ':' + minute1 + ':' + second;
                                        var clockPost = hour2 + ':' + minute2 + ':' + second;
                                        console.log("NOW: " + date);
                                        console.log("pre: " + clockPre + "\npost: " + clockPost);

                                        var query = "SELECT * FROM time_table WHERE route_short_name='" + linea + "' AND trip_headsign='" + fermata + "';";

                                        con.query("CREATE TABLE IF NOT EXISTS linea_" + linea + "_direzione_" + tmpF + " AS " + query, function (err, result) {
                                            if (err) throw err;

                                            con.query("SELECT * FROM linea_" + linea + "_direzione_" + tmpF + " WHERE arrival_time BETWEEN '" + clockPre + "' AND '" + clockPost + "' ORDER BY arrival_time ASC;", function (err, result, fields) {
                                                if (err) throw err;

                                                elements = [];
                                                elements.push([{ text: 'Invia Posizione', request_location: true }]);

                                                for(i = 0; i < result.length; i++)
                                                    elements.push([result[i].stop_name]);

                                                var text = "Mandami la tua posizione o seleziona una fermata specifica e ti saprò dire dove prendere l'autobus!";
                                                var keyboard = {
                                                    reply_markup: JSON.stringify({
                                                        keyboard: elements,
                                                        one_time_keyboard: true,
                                                        resize_keyboard: true
                                                    })
                                                };

                                                bot.sendMessage(msg.chat.id, text, keyboard).then(() => {
                                                    bot.once('text', (msg) => {
                                                        con.query("SELECT * FROM linea_" + linea + "_direzione_" + tmpF + " WHERE stop_name='" + msg.text + "' AND arrival_time > '" + clockPre + "' ORDER BY arrival_time ASC;", function (err, result, fields) {
                                                            if (err) throw err;

                                                            text = "";
                                                            for(i = 0; i < result.length; i++)
                                                                text += "Linea: " + result[i].route_short_name + "\nOrario: <b>" + result[i].arrival_time + "</b>\n\n";

                                                            text += "\n\nDisabilità";
                                                            switch(parseInt(result[0].wheelchair_boarding)) {
                                                                case 0:
                                                                    text += "\n\tFermata attrezzata: Info non presente";
                                                                    break;
                                                                case 1:
                                                                    text += "\n\tFermata attrezzata: Si, ma non per tutti i mezzi";
                                                                    break;
                                                                case 2:
                                                                    text += "\n\tFermata attrezzata: No";
                                                                    break;
                                                            }

                                                            switch(parseInt(result[0].wheelchair_accessible)) {
                                                                case 0:
                                                                    text += "\n\tVeicolo attrezzato: Info non presente";
                                                                    break;
                                                                case 1:
                                                                    text += "\n\tVeicolo attrezzato: Si, al massimo 1 passeggero";
                                                                    break;
                                                                case 2:
                                                                    text += "\n\tVeicolo attrezzato: No";
                                                                    break;
                                                            }

                                                            bot.sendMessage(msg.chat.id, text, {parse_mode : "HTML"});
                                                            bot.sendLocation(msg.chat.id, result[0].stop_lat, result[0].stop_lon);
                                                        });
                                                    })

                                                    bot.once('location', (msg) => {
                                                        var myPos = [msg.location.latitude, msg.location.longitude];

                                                        let i, val;
                                                        let min = 9999999;
                                                        let tmp1, tmp2;
                                                        for (i = 0; i < result.length; i++)
                                                        {
                                                            tmp2 = [result[i].stop_lat, result[i].stop_lon];
                                                            tmp1 = fun.distanceBetween(myPos, tmp2);
                                                            console.log("Analizzo Fermata: " + result[i].stop_name);
                                                            if(tmp1 < min)
                                                            {
                                                                console.log("\tFermata più vicina: " + result[i].stop_name);
                                                                min = tmp1;
                                                                val = i;
                                                            }
                                                        }

                                                        var text = "Linea: " + result[val].route_long_name + "\nFermata: <b>" + result[val].stop_name + "</b>\nOrario: <b>" + result[val].arrival_time + "</b>\n\nDisabilità";
                                                        switch(parseInt(result[val].wheelchair_boarding)) {
                                                            case 0:
                                                                text += "\n\tFermata attrezzata: Info non presente";
                                                                break;
                                                            case 1:
                                                                text += "\n\tFermata attrezzata: Si, ma non per tutti i mezzi";
                                                                break;
                                                            case 2:
                                                                text += "\n\tFermata attrezzata: No";
                                                                break;
                                                        }

                                                        switch(parseInt(result[val].wheelchair_accessible)) {
                                                            case 0:
                                                                text += "\n\tVeicolo attrezzato: Info non presente";
                                                                break;
                                                            case 1:
                                                                text += "\n\tVeicolo attrezzato: Si, al massimo 1 passeggero";
                                                                break;
                                                            case 2:
                                                                text += "\n\tVeicolo attrezzato: No";
                                                                break;
                                                        }

                                                        bot.sendMessage(msg.chat.id, text, {parse_mode : "HTML"});
                                                        bot.sendLocation(msg.chat.id, result[val].stop_lat, result[val].stop_lon);
                                                    })
                                                })
                                            });
                                        });
                                    })
                                })
                            });
                        });
                    }
                })
            })
        })
    });
});

bot.onText(/\/Imposta_Promemoria_Mezzi/, (msg) => {
	setTimeout(function () {
		bot.sendMessage(msg.chat.id, "Hai impostato un promemoria 10 minuti fa!");
	}, 600 * 1000);
});

bot.onText(/\/Nearest/, (msg) => {
    var text = "Ora ti indicherò quale mensa è più vicina a te... Inizia con l'inviarmi la tua posizione!";
    var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
    			[ { text: 'Invia Posizione', request_location: true } ]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard).then(() => {
        bot.once('location', (msg) => {
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

            console.log("INVIO");

            var text;
            switch(nM) {
                case 0: text = "La mensa attualmente più vicina è:\nPovo1_PastoLesto"; break;
                case 1: text = "La mensa attualmente più vicina è:\nPovo1_PastoCompleto"; break;
                case 2: text = "La mensa attualmente più vicina è:\nMesiano1"; break;
                case 3: text = "La mensa attualmente più vicina è:\nMesiano2"; break;
                case 4: text = "La mensa attualmente più vicina è:\nTommaso_Gar"; break;
            }

            bot.sendVenue(msg.chat.id, (mense[nM])[0], (mense[nM])[1], text);
        });
    })
});

bot.onText(/\/Mezzi/, (msg) => {
    var text = "In questa sezione puoi ottenere informazioni riguardanti i mezzi di trasporto";
	var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
				['/Bus'],
				['/Treno'],
                ['/Imposta_Promemoria_Mezzi']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);
});

bot.onText(/\/Mensa/, (msg) => {
    fun.richiestaFotoMensa('http://www.operauni.tn.it/servizi/ristorazione/webcam', './WebcamMense', ['Povo01.jpg', 'Povo02.jpg', 'mesiano01.jpg', 'mesiano02.jpg', 'tgar.jpg']);

    bot.sendMessage(msg.chat.id, "Per questioni legali puoi vedere le webcam solo se inserisci la password:");
});

bot.onText(/\/OperaUniTN/, (msg) => {
    var text = "In questa sezione puoi ottenere i vari documenti:\nBdS -> Borse di Studio\n150O -> Servizio 150 Ore";
	var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
				['/Bandi_BdS', '/Graduatorie_BdS'],
				['/Bandi_150O', '/Graduatorie_15O'],
				['/Imposta_Promemoria_Bandi']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);
});

//bot.onText(/\/IngegneriaAmbientaleCivileMeccanica/, (msg) =>
bot.onText(/DICAM/, (msg) =>
{
  fun.richiestaAvvisi("DICAM", bot, msg);
});

//bot.onText(/\/IngegneriaCivile/, (msg) =>
bot.onText(/DII/, (msg) =>
{
  fun.richiestaAvvisi("DII", bot, msg);
});

//bot.onText(/\/Fisica_Matematica_IngegneriaScienzeInformazione/, (msg) =>
bot.onText(/CISCA/, (msg) =>
{
  fun.richiestaAvvisi("CISCA", bot, msg);
});


bot.onText(/Avvisi/, (msg) =>
{
  var text = "In questa sezione puoi ottenere gli avvisi del giorno dei vari dipartimenti";
  var keyboard =
  {
    reply_markup: JSON.stringify(
      {
        keyboard: [
          //['/IngegneriaAmbientaleCivileMeccanica'],
          //['/IngegneriaCivile'],
          //['/Fisica_Matematica_IngegneriaScienzeInformazione']
          ['DICAM'],
          ['DII'],
          ['CISCA']
        ],
        one_time_keyboard: true, resize_keyboard: true
      })
  };

  bot.sendMessage(msg.chat.id, text, keyboard);
});

//Funzione per i luoghi utili partendo dal posto di ricerca
bot.on('text', (msg) => {
	var citta;

	var map = require('@google/maps').createClient({
		key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU'
	});


	var keyboardHome = {
		reply_markup: JSON.stringify({
			keyboard: [
				['']
			],
			one_time_keyboard: true,
			resize_keyboard: true
		})
	};

	var keyboardPlaces = {
		reply_markup: JSON.stringify({
			keyboard: [
				['Biblioteche', 'Mense'],
				['Facoltà', 'Copisterie']
			],
			one_time_keyboard: true,
			resize_keyboard: true
		})
	};

	if(msg.text == "Trento"){
		citta = {lat: 46.0702531, lng: 11.1216386};

		var text = "Hei sei nella sezione luoghi utili di Trento :), Dove vorresti andare?";

		bot.sendMessage(msg.chat.id, text, keyboardPlaces).then(() => {

			bot.once('text', (msg) => {
				if(msg.text == "Biblioteche"){
					var text = "Ecco a te le biblioteche a Trento :), i luoghi più silenziosi";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					console.log("pre funzione");
					place.placesNearby(bot,msg.chat.id,map,citta,750,"library","Biblioteca");
					console.log("post funzione");
				}
				else if(msg.text == "Mense"){
					var text = "Ecco a te le mense a Trento :), la pappa hehe";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,750,"restaurant","mensa opera universitaria");
				}
				else if(msg.text == "Facoltà"){
					var text = "Ecco a te le facoltà a Trento :), corri a lezione :P";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,750,"university","Univeristà");
				}
				else if(msg.text == "Copisterie"){
					var text = "Ecco a te le Copisterie a Trento :), fotocopie a te";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,750,"store","Copisteria");
				}
			});
		});
	}
	else if(msg.text == "Mesiano"){
		citta = {lat: 46.0659393, lng: 11.1395838};

		var text = "Hei sei nella sezione luoghi utili di Mesiano :), Dove vorresti andare?";

		bot.sendMessage(msg.chat.id, text, keyboardPlaces).then(() => {

			bot.once('text', (msg) => {
				if(msg.text == "Biblioteche"){
					var text = "Ecco a te le biblioteche a Mesiano :), i posti più silenziosi";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,300,"library","Biblioteca");
				}
				else if(msg.text == "Mense"){
					var text = "Ecco a te le mense a Mesiano :), la pappa hehe";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,300,"","mensa opera universitaria");
				}
				else if(msg.text == "Facoltà"){
					var text = "Ecco a te le facoltà a Mesiano :), corri a lezione :P";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,300,"","dipartimento");
				}
				else if(msg.text == "Copisterie"){
					var text = "Ecco a te le Copisterie a Mesiano :), fotocopie a te";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,750,"store","Copisteria");
				}
			});
		});
	}
	else if(msg.text == "Povo"){
		citta = {lat: 46.066294, lng: 11.153842};

		var text = "Hei sei nella sezione luoghi utili di Povo :), Dove vorresti andare?";

		bot.sendMessage(msg.chat.id, text, keyboardPlaces).then(() => {

			bot.once('text', (msg) => {
				if(msg.text == "Biblioteche"){
					var text = "Ecco a te le biblioteche a Povo :), i posti più silenziosi";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,300,"library","Biblioteca");
				}
				else if(msg.text == "Mense"){
					var text = "Ecco a te le mense a Povo :), la pappa hehe";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,300,"","mensa opera universitaria");
				}
				else if(msg.text == "Facoltà"){
					var text = "Ecco a te le facoltà a Povo :), corri a lezione :P";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,300,"","dipartimento");
				}
				else if(msg.text == "Copisterie"){
					var text = "Ecco a te le Copisterie a Povo :), fotocopie a te";

					bot.sendMessage(msg.chat.id, text, keyboardHome);

					place.placesNearby(bot,msg.chat.id,map,citta,750,"store","Copisteria");
				}
			});
		});
	}
	else if(msg.text == "Ricerca avanzata"){
		var text = "Mandami la tua posizione, in modo che io possa sapere dove vuoi cercare";

		var element = [];
		element.push([{ text: 'Invia Posizione', request_location: true }]);

		var keyboard = {
			reply_markup: JSON.stringify({
				keyboard: element,
				one_time_keyboard: true,
				resize_keyboard: true
			})
		};

		bot.sendMessage(msg.chat.id, text, keyboard).then(() => {
			bot.once('location', (msg) => {
				console.log("Ho ricevuto la posizione");
				var citta = {lat: msg.location.latitude, lng: msg.location.longitude};

				var text2 = "Scrivimi ciò ceh vuoi cercare qui \nBar/librerie/musei/... tutto ciò che potresti trovare utile :)";

				var keyboard = {
					reply_markup: JSON.stringify({
						keyboard: [],
						one_time_keyboard: true,
						resize_keyboard: true
					})
				};

				bot.sendMessage(msg.chat.id, text2, keyboard).then(() => {

					bot.once('text', (msg) => {
						var nome = msg.text;
						var text3 = "Ecco a te i risultati della tua ricerca: ";

						bot.sendMessage(msg.chat.id, text3, keyboardHome);
						console.log("Presentazione dei rislutati inviata");

						place.placesNearby(bot,msg.chat.id,map,citta,750,"",nome);
					});
				});
			});
		});
	}
});

//Funzione per il riconoscimento dei luoghi utili
bot.on('text', (msg) => {
	if(msg.text == "Luoghi utili"){
		var text = "Hei sei nella sezione luoghi utili :), Dove ti interessa cercare?";

		var keyboard = {
	        reply_markup: JSON.stringify({
	            keyboard: [
					['Trento','Mesiano'],
					['Povo', 'Ricerca avanzata']
	            ],
	            one_time_keyboard: true,
	            resize_keyboard: true
	        })
	    };

		bot.sendMessage(msg.chat.id, text, keyboard);
	}
});

bot.onText(/\/start/, (msg) => {
	bot.removeListener('callback_query');
    var text = "Benvenuto " + msg.from.first_name + "!\nUniTN Help Center è un bot sviluppato per aiutare attuali e/o futuri studenti dell'Università degli Studi di Trento in vari ambiti della propria vita quotidiana!";

    var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
				['/Mezzi'],
				['/Mensa'],
				['Luoghi utili'],
                ['Avvisi'],
				['/OperaUniTN']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);
});
