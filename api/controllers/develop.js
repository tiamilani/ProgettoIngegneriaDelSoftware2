// ---------- REQUIRE ----------
const db = require('../../TelegramBot/sectionDevelop.js');

var databaseConnection = undefined;

// ---------- FUNCTIONS ----------
function UpdateDB (request, response) {
	return new Promise((resolve, reject) => {
		var json = {};
	    db.initConnectionLess(databaseConnection)
	        .then((con) => {
	            databaseConnection = con;
	            var query = "SELECT * FROM users WHERE type='admin'";
	            con.query(query, function (err, result) {
					if (err) {
						response.writeHead(404, {"Content-Type": "application/json; charset=utf-8"});
						response.end(JSON.stringify({ Ask: err }));
						return reject();
					}

					json['fase1'] = "Inizio Aggiornamento del DB";

	                db.eliminaDati(databaseConnection)
	                    .then((res) => {
							json['fase2'] = res;
	                        return db.inserisciDati(databaseConnection);
	                    })
	                    .then((res) => {
	                        json['fase3'] = res;
	                        return db.verificaDati(databaseConnection);
	                    })
	                    .then((res) => {
	                        json['fase4'] = res;
	                        return db.prepareMain(databaseConnection);
	                    })
	                    .then((res) => {
							json['fase5'] = res;
							json['fase6'] = "Fine Aggiornamento del DB";
							JSON.stringify (json);
							response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
							response.end(json);
							return resolve();
	                    })
	                    .catch(err => {
							json['error'] = err;
							JSON.stringify (json);
							response.writeHead(404, {"Content-Type": "application/json; charset=utf-8"});
							response.end(json);
							return reject();
	                    });
	            });
	        })
	        .catch(err => {
				json['error'] = err;
				JSON.stringify (json);
				response.writeHead(404, {"Content-Type": "application/json; charset=utf-8"});
				response.end(json);
				return reject();
	        });
	});
}

exports.UpdateDB = UpdateDB;
