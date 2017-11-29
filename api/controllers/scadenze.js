// ---------- REQUIRE ----------
const db = require('../../TelegramBot/sectionDevelop.js');

var databaseConnection = undefined;

// ---------- FUNCTIONS ----------
function mostraScadenze (request, response) {
    return new Promise((resolve, reject) => {
        console.log("mostraScadenze");
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

    	db.initiateConnection(databaseConnection)
    		.then((con) => {
    			databaseConnection = con;

                var query = "SELECT * FROM deadline";
                con.query(query, function (err, result, fields) {
                    if (err) {
                        response.end(JSON.stringify({ Ask: err }));
                        return reject();
                    }

                    if(result.length > 0) {
                        var text = "Ecco le scadenze attualmente in vigore:";

    					var elements = [];
                        for(let i = 0; i < result.length; i++) {
    						var item = {
    							Argomento: result[i].descrizione,
    							DataFine: result[i].dataFine
    						}

    						if(result[i].dataInizio != null)
    							item['DataInizio'] = result[i].dataInizio;

    						elements.push(item);
    					}


    					var json = JSON.stringify ({
    						Ask: text,
    						Choices: elements
    					});

    					response.end(json);
                        return resolve();
                    }
    				else
    					response.end(JSON.stringify({ Ask: "Attualmente non ci sono scadenze!"}));
                        return reject();
                });
    		})
    		.catch(err => {
    			response.end(JSON.stringify({ Ask: err }));
                return reject();
    		});
    });
}


// ---------- EXPORTS ----------
exports.mostraScadenze = mostraScadenze;
