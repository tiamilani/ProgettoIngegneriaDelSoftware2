const mysql = require('mysql');
const fs = require('fs');
const ext = require('path');
const tte = require('download-file');
const unzip = require('adm-zip');
const csv = require('fast-csv');

function homeKeyboard () {
	return {
		parse_mode: "Markdown",
        reply_markup: JSON.stringify({
			keyboard: [
				['Mezzi Urbani TTE'],
				['Luoghi Utili'],
				['How To'],
				['Avvisi Dipartimenti'],
				['Scadenze Documenti'],
                ['Mensa Vicina']
			],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };
}

function connectToDatabaseInit (connection) {
	//console.log("IN CONNESSIONE");
	return new Promise((resolve, reject) => {
		if(connection == undefined || connection.state === 'disconnected') {
			console.log("Connetto");
			var con = mysql.createConnection({
				host: "db4free.net",
				user: "andreafadi",
				password: "fabioCasati",
				database: "ttesercizio",
				multipleStatements: true
			});

			con.connect(function(err) {
		        if (err) return reject(err);

				return resolve(con);
			});
		} else {
			//console.log("Connesso");
			return resolve(connection);
		}
	});
}

function connectToDatabase (connection) {
	//console.log("IN CONNESSIONE");
	return new Promise((resolve, reject) => {
		if(connection == undefined || connection.state === 'disconnected') {
			console.log("Connetto");
			var con = mysql.createConnection({
				host: "db4free.net",
				user: "andreafadi",
				password: "fabioCasati",
				database: "ttesercizio",
				multipleStatements: true
			});

			con.connect(function(err) {
		        if (err) return reject(err);

				con.query("SHOW TABLES", function (err, result) {
					if (err) return reject(err);

					if(result.length < 10)
						return reject("Aggiornamento degli Orari in Corso...");

					return resolve(con);
				});
			});
		} else {
			//console.log("Connesso");
			connection.query("SHOW TABLES", function (err, result) {
				if (err) return reject(err);

				if(result.length < 10)
					return reject("Aggiornamento degli Orari in Corso...");

				return resolve(connection);
			});
		}
	});
}

function checkAdmins (bot, msg, connection) {
	return new Promise((resolve, reject) => {
		console.log("checkAdmins");
		connectToDatabaseInit(connection)
			.then((con) => {
				var query = "SELECT * FROM users WHERE type='admin'";
				con.query(query, function (err, result) {
					if (err) return reject(err);

					var admins = [];
					for(let i = 0; i < result.length; i++)
						if(result[i].type == "admin")
							admins.push(parseInt(result[i].ChatID));

					if(admins.includes(msg.chat.id))
						return resolve(true);
					else {
						var query = "SELECT * FROM users WHERE ChatID=" + msg.chat.id;
						con.query(query, function (err, result) {
							if (err) return reject(err);

							text = "Questo utente ha tentato di entrare nella sezione Sviluppatori!";
							text += "\n\nID: " + result[0].ChatID;
							text += "\nNome: " + result[0].nome;
							text += "\nCognome: " + result[0].cognome;
							text += "\nNickname: " + result[0].nickname;
							text += "\nis_bot: " + result[0].is_bot;

							for(let i = 0; i < admins.length; i++)
								bot.sendMessage(admins[i], text);

							return resolve(false);
						});

					}
				});
			})
			.catch(err => {
				return reject(err);
			});
	});
}

function checkAdminsLess (msg, connection) {
	return new Promise((resolve, reject) => {
		console.log("checkAdminsLess");
		connectToDatabaseInit(connection)
			.then((con) => {
				var query = "SELECT * FROM users WHERE type='admin'";
				con.query(query, function (err, result) {
					if (err) return reject(err);

					var admins = [];
					for(let i = 0; i < result.length; i++)
						if(result[i].type == "admin")
							admins.push(parseInt(result[i].ChatID));

					if(admins.includes(msg.chat.id))
						return resolve(true);
					else
						return resolve(false);
				});
			})
			.catch(err => {
				return reject(err);
			});
	});
}

function deleteTables (connection) {
	return new Promise((resolve, reject) => {
		console.log("deleteTables");
		connectToDatabaseInit(connection)
			.then((con) => {
				con.query("SHOW TABLES", function (err, result) {
					if (err) return reject(err);

					if(result.length > 2) {
						var query = "";
						for(let i = 0; i < result.length; i++)
							if(result[i].Tables_in_ttesercizio != 'users' && result[i].Tables_in_ttesercizio != 'deadline')
								query += ("DROP TABLE " + result[i].Tables_in_ttesercizio + ";");

						con.query(query, function (err, result) {
							if (err) throw err;

							return resolve("Tabelle Eliminate");
						});
					} else
						return resolve("Tabelle già eliminate");
				});
			})
			.catch(err => {
				return reject(err);
			});
	});
}

function createTables (connection) {
	return new Promise((resolve, reject) => {
		console.log("createTables");
		connectToDatabaseInit(connection)
			.then((con) => {
				let url = "http://www.ttesercizio.it/opendata/google_transit_urbano_tte.zip";

				let options = {
					directory: "./tte_db",
					filename: "tte_urbano.zip"
				};

				tte(url, options, function(err) {
					if (err) return reject(err);

					try {
						let zip = new unzip("./tte_db/tte_urbano.zip");

						zip.extractAllToAsync('./tte_db', true, function (err) {
							if (err) return reject(err);

							let tmpFiles = fs.readdirSync('./tte_db');
							let fileName;
							for(let i = 0; i < tmpFiles.length; i++)
							{
								fileName = ext.parse(tmpFiles[i]).name;

								if(tmpFiles[i].includes("agency") || tmpFiles[i].includes("feed") || tmpFiles[i].includes(".zip") || tmpFiles[i].includes("shape"))
									fs.unlinkSync('./tte_db' + '/' + tmpFiles[i]);
								else if(tmpFiles[i].includes(".txt"))
									fs.renameSync('./tte_db' + '/' + tmpFiles[i], './tte_db' + '/' + fileName + '.csv');
							}

							tmpFiles = fs.readdirSync('./tte_db');
							let dirFile = './tte_db/' + tmpFiles[0];
							let file = tmpFiles[0];
							let nameFile = ext.parse(file).name;

							createTableSupport(dirFile, file, nameFile, con)
							.then((res) => {
								let dirFile = './tte_db/' + tmpFiles[1];
								let file = tmpFiles[1];
								let nameFile = ext.parse(file).name;

								return createTableSupport(dirFile, file, nameFile, con);
					        })
					        .then((res) => {
								let dirFile = './tte_db/' + tmpFiles[2];
								let file = tmpFiles[2];
								let nameFile = ext.parse(file).name;

								return createTableSupport(dirFile, file, nameFile, con);
					        })
					        .then((res) => {
								let dirFile = './tte_db/' + tmpFiles[3];
								let file = tmpFiles[3];
								let nameFile = ext.parse(file).name;

								return createTableSupport(dirFile, file, nameFile, con);
					        })
							.then((res) => {
								let dirFile = './tte_db/' + tmpFiles[4];
								let file = tmpFiles[4];
								let nameFile = ext.parse(file).name;

								return createTableSupport(dirFile, file, nameFile, con);
					        })
					        .then((res) => {
								let dirFile = './tte_db/' + tmpFiles[5];
								let file = tmpFiles[5];
								let nameFile = ext.parse(file).name;

								return createTableSupport(dirFile, file, nameFile, con);
					        })
							.then((res) => {
								let dirFile = './tte_db/' + tmpFiles[6];
								let file = tmpFiles[6];
								let nameFile = ext.parse(file).name;

								return createTableSupport(dirFile, file, nameFile, con);
					        })
							.then((res) => {
								return resolve("Tabelle Create");
							})
					        .catch(err => {
					            console.log("Creating: " + err);
					        });
						});
					} catch (e) { return reject(e); }
				});
			})
			.catch((err) => {
				return reject(err);
			});
	});
}

function createTableSupport (dirFile, file, nameFile, con) {
	return new Promise((resolve, reject) => {
	    let create = "";
	    let insert = "";
	    let headers = [];
	    let c = 0;

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

	            for(let j = 0; j < headers.length; j++)
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

	            for(let j = 0; j < headers.length; j++)
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

	        con.query(create, function (err, result) {
	            if (err) return reject(e);

	            con.query(insert, function (err, result) {
	                if (err) return reject(e);

					return resolve("Creata Tabella " + nameFile);
	            });
	        });
	    });
	});
}

function resetTableUsers (bot, id, connection) {
	console.log("resetTableUsers");
	connectToDatabaseInit(connection)
		.then((con) => {
			var query = "UPDATE users SET last_command='/start',prevChoice='1',nameT=null, keyboard=null, lastResult=null, location=null";

			con.query(query, function (err, result) {
				if (err) throw err;

				bot.sendMessage(id, "Tabella Users Resettata");
			});
		})
		.catch(err => {
			bot.sendMessage(id, err);
		});
}

function alterTable (connection) {
	return new Promise((resolve, reject) => {
		console.log("alterTable");
		connectToDatabaseInit(connection)
			.then((con) => {
				var query = "ALTER TABLE routes DROP agency_id, DROP route_color, DROP route_text_color;";
				query += "ALTER TABLE stops DROP stop_code, DROP stop_desc;";
				query += "ALTER TABLE trips DROP shape_id;";
				query += "CREATE INDEX trips ON trips (route_id);";
				query += "CREATE INDEX route_id ON routes (route_id);";
				query += "CREATE INDEX stop_times ON stop_times (stop_id);";
				query += "CREATE INDEX stops ON stops (stop_id);";

				con.query(query, function (err, result) {
					if (err) return reject(err);

					return resolve("Indici Creati & Colonne Eliminate");
				});
			})
			.catch(err => {
				return reject(err);
			});
	});
}

function createJoin (connection) {
	return new Promise((resolve, reject) => {
		console.log("createJoin");
		connectToDatabaseInit(connection)
			.then((con) => {
				var query = "CREATE TABLE IF NOT EXISTS time_table AS ";
				query += "SELECT * FROM (((stops NATURAL JOIN stop_times) NATURAL JOIN trips) NATURAL JOIN routes) NATURAL JOIN calendar";

				con.query(query, function (err, result) {
					if (err) return reject(err);

					return resolve("Join Eseguito");
				});
			})
			.catch(err => {
				return reject(err);
			});
	});
}

function getInfoDB (bot, id, connection) {
	console.log("getInfoDB");
	connectToDatabaseInit(connection)
		.then((con) => {
			var query = "SELECT TABLE_NAME,TABLE_ROWS,CREATE_TIME FROM information_schema.tables WHERE table_schema='ttesercizio' ORDER BY CREATE_TIME ASC";
			con.query(query, function (err, result) {
				if (err) throw err;

				var text = "Le tabelle presenti nel database ora sono:";

				for(let i = 0; i < result.length; i++)
					text += "\n\nTable: *" + result[i].TABLE_NAME + "*\nRows: *" + result[i].TABLE_ROWS + "*\nCreate Date: *" + result[i].CREATE_TIME + "*";

				bot.sendMessage(id, text, {parse_mode: "Markdown"});
			});
		})
		.catch(err => {
			bot.sendMessage(id, err);
		});
}


// ---------- EXPORTS ----------
exports.createHome = homeKeyboard;
exports.initiateConnection = connectToDatabase;
exports.initConnectionLess = connectToDatabaseInit;
exports.isAdmin = checkAdmins;
exports.couldScadenze = checkAdminsLess;
exports.eliminaDati = deleteTables;
exports.inserisciDati = createTables;
exports.inizializzaUtenti = resetTableUsers;
exports.verificaDati = alterTable;
exports.prepareMain = createJoin;
exports.dbInfo = getInfoDB;
