// ---------- REQUIRE ----------
const db = require ('./sectionDevelop.js');
const urban = require ('./sectionMezzi.js');
const dead = require ('./sectionScadenze.js');
const alert = require ('./sectionAvvisi.js');
const place = require ('./sectionLuoghiUtili.js');
const eat = require ('./sectionMensa.js');
const how = require ('./sectionHowto.js');
const cron = require('node-schedule');
const emoji = require('node-emoji');

const TelegramBot = require('node-telegram-bot-api');

// ---------- CONFIG ----------
const TOKEN = process.env.TELEGRAM_TOKEN || '466491462:AAF8RxkhGR00Mylr0LGZfFWUMvPVWSHqUPE';
/*const options = {
    webHook: {
        port: process.env.PORT || 443
    }
};
const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);*/
const url = process.env.APP_URL || 'https://unitnhelpbot.herokuapp.com:443';

const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

console.log('BOT STARTED webHook: ' + `${url}/bot${TOKEN}`);

var databaseConnection = undefined;

const specialChoices = ['home','ilaria','giulia','virginia'];
const developChoices = ['develop','annuncio','elimina tabelle','inserisci tabelle','crea indici','crea join','reset users'];
const mezziChoices = ['mezzi urbani tte','prossimo mezzo','calcola percorso','ricerca per linea','ricerca per fermata','avvisi linee', 'tariffe'];
const scadenzeChoices = ['scadenze documenti','inserisci scadenza','modifica scadenza','elimina scadenza'];
const mensaChoices = ['mensa vicina'];
const avvisiChoices = ['avvisi dipartimenti','dicam','dii','cisca'];
const luoghiChoices = ['luoghi utili'];
const howtoChoices = ['how to','ammissioni','immatricolazioni','borse di studio','tasse universitarie','supporto','libera circolazione',
    'trasferimenti','open day','rinnovo iscrizioni','futuro studente','didattica','orientamento','iscrizioni','agevolazioni','ateneo',
    'servizi','non solo studio','prospective international student','ammissioni lauree e lauree magistrali a ciclo unico',
    'ammissioni lauree magistrali','immatricolazioni lauree e lauree magistrali a ciclo unico','immatricolazioni lauree magistrali',
    'pagamenti','rimborsi','tasse a.a. 17-18','isee a.a. 17-18','borse di studio e posto alloggio','dichiarazione di invalidità o disabilità',
    'attesa di laurea','trasferimento verso un altro ateneo','trasferimento da un altro ateneo','trasferimento da un altro ateneo laurea magistrale',
    'rinnovo iscrizione con pagamento tasse','rinnovo iscrizione con richiesta di borsa di studio','rinnovo iscrizione studenti con bisogni particolari',
    'Economia - Giurisprudenza - Lettere', 'Sociologia - Filosofia', 'Fisica - Matematica', 'Ingegneria dell\'Informazioni', 'Psicologia - Scienze Cognitive',
    'Scienza e Tecnologie Biomolecolari', 'Ingegneria Industriale', 'Viticoltura ed Enologia', 'Ingengeria Civile - Ingegneria Ambientale',
    'Ingegneria Edile - Architettura'];

// ---------- FUNCTIONS ----------
function UpdateDB () {
    db.initConnectionLess(databaseConnection)
        .then((con) => {
            databaseConnection = con;
            var query = "SELECT * FROM users WHERE type='admin'";
            con.query(query, function (err, result) {
                if (err) throw err;

                var admins = [];
                for(let i = 0; i < result.length; i++)
                    if(result[i].type == "admin")
                        admins.push(parseInt(result[i].ChatID));

                for(let i = 0; i < admins.length; i++)
                    bot.sendMessage(admins[i], "Inizio Aggiornamento del DB");

                db.eliminaDati(databaseConnection)
                    .then((res) => {
                        for(let i = 0; i < admins.length; i++)
                            bot.sendMessage(admins[i], res);
                        return db.inserisciDati(databaseConnection);
                    })
                    .then((res) => {
                        for(let i = 0; i < admins.length; i++)
                            bot.sendMessage(admins[i], res);
                        return db.verificaDati(databaseConnection);
                    })
                    .then((res) => {
                        for(let i = 0; i < admins.length; i++)
                            bot.sendMessage(admins[i], res);
                        return db.prepareMain(databaseConnection);
                    })
                    .then((res) => {
                        for(let i = 0; i < admins.length; i++)
                            bot.sendMessage(admins[i], res + "\nFine Aggiornamento del DB");
                    })
                    .catch(err => {
                        for(let i = 0; i < admins.length; i++)
                            bot.sendMessage(admins[i], "Ricomincio a causa dell'Errore: " + err);
                        bot.emit('funzioniDB');
                    });
            });
        })
        .catch(err => {
            console.log("Ricomincio a causa dell'Errore: " + err);
            bot.emit('funzioniDB');
        });
}

function routeCommands (msg, id, connection) {
    console.log("routeCommands");
	db.initiateConnection(connection)
		.then((con) => {
            databaseConnection = con;
	        var query = "SELECT * FROM users WHERE ChatID='" + id + "'";
	        con.query(query, function (err, result) {
	            if (err) throw err;

				result = result[0];

				if ((result.last_command).includes("Fermata")) {
					switch (result.last_command) {
						case 'Fermata_F1':
							if(msg.text != undefined)
								urban.Fermata_F2_Name_F1(bot, msg, con);
							else if(msg.location != undefined)
								urban.Fermata_F2_Location_F1(bot, msg, con);
							break;
						case 'Fermata_F2_Location_F1':
							urban.Fermata_F2_Location_F2(bot, msg, con);
							break;
						case 'Fermata_F2_Location_F2':
							urban.Fermata_F2_Location_F3(bot, msg, result.nameT, con);
							break;
						case 'Fermata_F2_Location_F3':
							urban.All_FF(bot, msg, con);
							break;
						case 'Fermata_F2_Name_F1':
							urban.Fermata_F2_Name_F2(bot, msg, con);
							break;
						case 'Fermata_F2_Name_F2':
							urban.Fermata_F2_Name_F3(bot, msg, result.nameT, con);
							break;
						case 'Fermata_F2_Name_F3':
							urban.All_FF(bot, msg, con);
                            break;
					}
				}
				else if ((result.last_command).includes("Linea")) {
					switch (result.last_command) {
						case 'Linea_F1':
							urban.Linea_F2(bot, msg, con);
							break;
						case 'Linea_F2':
							urban.Linea_F3(bot, msg, result.nameT, con);
							break;
						case 'Linea_F3':
							if(msg.text != undefined)
								urban.Linea_F4_Name_F1 (bot, msg, result.nameT, con);
							else if(msg.location != undefined)
								urban.Linea_F4_Location_F1 (bot, msg, result.nameT, con);
							break;
						case 'Linea_F4_Name_F1':
							urban.All_FF (bot, msg, con);
							break;
						case 'Linea_F4_Location_F1':
							urban.All_FF (bot, msg, con);
                            break;
					}
				}
				else if ((result.last_command).includes("Next")) {
					switch (result.last_command) {
						case 'Next_F1':
							if(msg.text != undefined)
								urban.Next_F2_Name_F1 (bot, msg, con);
							else if(msg.location != undefined)
								urban.Next_F2_Location_F1 (bot, msg, con);
							break;
						case 'Next_F2_Name_F1':
							urban.Next_F2_Name_F2 (bot, msg, con);
							break;
						case 'Next_F2_Name_F2':
							urban.All_FF_B (bot, msg, con);
							break;
						case 'Next_F2_Location_F1':
							urban.Next_F2_Location_F2 (bot, msg, con);
							break;
						case 'Next_F2_Location_F2':
							urban.All_FF_B (bot, msg, con);
                            break;
					}
				}
                else if ((result.last_command).includes("Calcola")) {
					switch (result.last_command) {
						case 'CalcolaPercorso_F1':
							urban.CalcolaPercorso_F2 (bot, msg, con);
							break;
						case 'CalcolaPercorso_F2':
							urban.CalcolaPercorso_F3 (bot, msg, con);
							break;
						case 'CalcolaPercorso_F3':
							urban.CalcolaPercorso_F4 (bot, msg, con);
							break;
						case 'CalcolaPercorso_F4':
							urban.CalcolaPercorso_F5 (bot, msg, con);
							break;
					}
				}
				else if ((result.last_command).includes("Luoghi")) {
					switch (result.last_command) {
						case 'Luoghi_F1':
							place.Luoghi_F2 (bot, msg, con);
                            break;
                        case 'Luoghi_F2':
                            place.Luoghi_F3 (bot, msg, con);
                            break;
						case 'Luoghi_F3':
							place.Luoghi_F4 (bot, msg, con);
							break;
					}
                }
				else if ((result.last_command).includes("Mensa")) {
                    switch (result.last_command) {
                        case 'Mensa_F1':
                            eat.Mensa_F2 (bot, msg, con);
                            break;
                    }
                }
                else if ((result.last_command).includes("Scadenza")) {
                    switch (result.last_command) {
                        case 'Inserisci_Scadenza':
                            dead.inserisciScadenza(bot, msg, con);
                            break;
                        case 'Modifica_Scadenza':
                            dead.modificaScadenza(bot, msg, con);
                            break;
                        case 'Elimina_Scadenza':
                            dead.eliminaScadenza(bot, msg, con);
                            break;
                    }
                }
                else if ((result.last_command).includes("Annuncio")) {
                    switch (result.last_command) {
                        case 'Annuncio_F1':
                            db.Annuncio_F2 (bot, msg, con);
                            break;
                    }
                }
                else
                    bot.sendMessage(id, "Comando non riconosciuto!");
			});
		})
		.catch((err) => {
            console.log("error");
			bot.sendMessage(id, err);
		});
}

function BackHome (msg) {
    return new Promise((resolve, reject) => {
    	db.initConnectionLess(databaseConnection)
    		.then((con) => {
                databaseConnection = con;
    	        var query = "SELECT ChatID FROM users WHERE ChatID='" + msg.chat.id + "'";
    	        con.query(query, function (err, result) {
    	            if (err) return reject(err);

    				if(result.length == 0) {
    					var query = "INSERT INTO users (ChatID) VALUES ('" + msg.chat.id + "')";
    			        con.query(query, function (err, result) {
    			            if (err) return reject(err);

    						return resolve("Success");
    					});
    				}
    				else {
    					var query = "UPDATE users SET last_command='/start',prevChoice='1',nameT=null,keyboard=null,lastResult=null,location=null WHERE ChatID='" + msg.chat.id + "'";
    			        con.query(query, function (err, result) {
    			            if (err) return reject(err);

    						return resolve("Success");
    					});
    				}
    			});
    		})
    		.catch((err) => {
    			bot.sendMessage(msg.chat.id, err);
    		});
    });
}

function Special (msg) {
    switch (msg.text.toLowerCase()) {
        case 'home':
            BackHome(msg)
                .then((result) => {
                    bot.sendMessage(msg.chat.id, emoji.emojify("Torno alla Home :house:"), db.createHome());
                })
                .catch(err => {
                    console.error(err);
                });
            break;
        case 'ilaria':
            bot.sendMessage(msg.chat.id, emoji.emojify("Ti Amo :heart:"));
            break;
        case 'giulia':
            bot.sendMessage(msg.chat.id, emoji.emojify("Ti Amo :heart:"));
            break;
        case 'virginia':
            bot.sendMessage(msg.chat.id, emoji.emojify("Ti Amo :heart:"));
            break;
    }
}

function Develop (msg) {
    switch (msg.text.toLowerCase()) {
        case 'develop':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result) {
                                var text = "Sezione Sviluppatori";
                                var keyboard = {
                                    reply_markup: JSON.stringify({
                                        keyboard: [
                                            ['Home'],
                                            ['Annuncio'],
                                            ['Elimina Tabelle','Inserisci Tabelle'],
                                            ['Crea Indici','Crea Join'],
                                            ['Reset Users']
                                        ],
                                        resize_keyboard: true
                                    })
                                };

                                bot.sendMessage(msg.chat.id, text, keyboard);
                            }
                            else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'annuncio':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.Annuncio_F1(bot, msg, databaseConnection)
                                    .then((res) => {
                                        //bot.sendMessage(msg.chat.id, res);
                                    })
                                    .catch(err => {
                                        bot.sendMessage(msg.chat.id, err);
                                    });
                            else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'elimina tabelle':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.eliminaDati(databaseConnection)
                                    .then((res) => {
                                        console.log(res);
                                        bot.sendMessage(msg.chat.id, res);
                                    })
                                    .catch(err => {
                                        bot.sendMessage(msg.chat.id, err);
                                    });
                            else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'inserisci tabelle':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.inserisciDati(databaseConnection)
                                    .then((res) => {
                                        bot.sendMessage(msg.chat.id, res);
                                    })
                                    .catch(err => {
                                        bot.sendMessage(msg.chat.id, err);
                                    });
                            else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'reset users':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.inizializzaUtenti(bot, msg.chat.id, databaseConnection);
                            else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'crea indici':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.verificaDati(databaseConnection)
                                    .then((res) => {
                                        bot.sendMessage(msg.chat.id, res);
                                    })
                                    .catch(err => {
                                        bot.sendMessage(msg.chat.id, err);
                                    });
                            else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'crea join':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.prepareMain(databaseConnection)
                                    .then((res) => {
                                        bot.sendMessage(msg.chat.id, res);
                                    })
                                    .catch(err => {
                                        bot.sendMessage(msg.chat.id, err);
                                    });
                            else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
    }
}

function Mezzi (msg) {
    switch (msg.text.toLowerCase()) {
        case 'mezzi urbani tte':
            var text = "In questa sezione puoi ottenere informazioni sugli orari dei mezzi di trasporto urbani di Trento!";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Prossimo Mezzo'],
                        ['Calcola Percorso'],
                        ['Ricerca per Linea','Ricerca per Fermata'],
                        ['Avvisi Linee', 'Tariffe']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'ricerca per linea':
            bot.sendMessage(msg.chat.id, "Se vuoi sapere le informazioni di una linea specifica sei nel posto giusto!");
            urban.Linea_F1(bot, msg, databaseConnection);
            break;
        case 'ricerca per fermata':
            bot.sendMessage(msg.chat.id, "Se vuoi sapere le informazioni di una fermata specifica sei nel posto giusto!");
            urban.Fermata_F1(bot, msg, databaseConnection);
            break;
        case 'prossimo mezzo':
            bot.sendMessage(msg.chat.id, "Se vuoi sapere quando passerà il tuo prossimo autobus sei nel posto giusto!");
            urban.Next_F1(bot, msg, databaseConnection);
            break;
        case 'calcola percorso':
            bot.sendMessage(msg.chat.id, "Se vuoi le indicazioni su come raggiungere una specifica fermata sei nel posto giusto!");
            urban.CalcolaPercorso_F1(bot, msg, databaseConnection);
            break;
        case 'avvisi linee':
            bot.sendMessage(msg.chat.id, "Se vuoi sapere quali linee potrebbero subire variazioni oggi sei nel posto giusto!");
            urban.Avvisi_Linee(bot, msg, databaseConnection);
            break;
        case 'tariffe':
            bot.sendMessage(msg.chat.id, "Se vuoi sapere le tariffe dei biglietti urbani di Trento sei nel posto giusto!");
            var text = "*TARIFFE URBANE DI TRENTO*\n\t*Cartaceo*\n\t\t`€1,20 ->` 70 minuti\n\t\t`€1,50 ->` 120 minuti\n\t\t`€3,00 ->` Giornaliero\n\t*OpenMove*\n\t\t`€1,10 ->` 70 minuti\n\t\t`€1,40 ->` 120 minuti\n\t\t`€2,80 ->` Giornaliero\n\t*A Bordo*\n\t\t`€2,00 ->` Corsa Singola";

            bot.sendMessage(msg.chat.id, text, db.createHome()).then(() => {
                bot.sendDocument(msg.chat.id, 'http://www.ttesercizio.it/Public/Documenti/tariffario.pdf', {caption: 'Tariffario Biglietti Cartacei 2017/2018'});
                bot.sendDocument(msg.chat.id, 'http://www.ttesercizio.it/Public/INTROITI/OpenMove_vademecum.pdf', {caption: 'Tariffario Biglietti Elettronici 2017/2018'});
            });
    }
}

function Scadenze (msg) {
    switch (msg.text.toLowerCase()) {
        case 'scadenze documenti':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.couldScadenze(msg, databaseConnection)
                        .then((result) => {
                            if(result) {
                                dead.mostraScadenze(bot, msg.chat.id, databaseConnection);
                                var text = "Sezione Scadenze";
                                var keyboard = {
                                    reply_markup: JSON.stringify({
                                        keyboard: [
                                            ['Home'],
                                            ['Inserisci Scadenza','Modifica Scadenza'],
                                            ['Elimina Scadenza']
                                        ],
                                        resize_keyboard: true
                                    })
                                };

                                bot.sendMessage(msg.chat.id, text, keyboard);
                            }
                            else
                                dead.mostraScadenze(bot, msg.chat.id, databaseConnection);
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'inserisci scadenza':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result) {
                                bot.sendMessage(msg.chat.id, "Ricorda il formato:\ndescrizione,dataInizio,dataFine\n\ndata = gg/mm/aaaa");
                                dead.mostraScadenzeStatus(bot, msg.chat.id, databaseConnection, 'Inserisci_Scadenza');
                            } else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'modifica scadenza':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result) {
                                bot.sendMessage(msg.chat.id, "Ricorda il formato:\nid,descrizione,dataInizio,dataFine\n\ndata = gg/mm/aaaa");
                                dead.mostraScadenzeStatus(bot, msg.chat.id, databaseConnection, 'Modifica_Scadenza');
                            } else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'elimina scadenza':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result) {
                                bot.sendMessage(msg.chat.id, "Ricorda il formato:\nid");
                                dead.mostraScadenzeStatus(bot, msg.chat.id, databaseConnection, 'Elimina_Scadenza');
                            } else
                                bot.sendMessage(msg.chat.id, "Non sei autorizzato ad accedere!\nSei stato segnalato agli amministratori!");
                        })
                        .catch(err => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
    }
}

function Mensa (msg) {
    switch (msg.text.toLowerCase()) {
        case 'mensa vicina':
            eat.Mensa_F1 (bot, msg, databaseConnection);
    }
}

function Avvisi (msg) {
    switch (msg.text.toLowerCase()) {
        case 'avvisi dipartimenti':
            var text = "In questa sezione puoi ottenere gli avvisi del giorno dei vari dipartimenti";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['DICAM','DII','CISCA']
                    ],
                    resize_keyboard: true
                })
            };
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'dicam':
            alert.richiestaAvvisi("DICAM", bot, msg);
            break;
        case 'dii':
            alert.richiestaAvvisi("DII", bot, msg);
            break;
        case 'cisca':
            alert.richiestaAvvisi("CISCA", bot, msg);
            break;
    }
}

function Luoghi (msg) {
    switch (msg.text.toLowerCase()) {
        case 'luoghi utili':
            place.Luoghi_F1(bot, msg, databaseConnection);
            break;
    }
}

function HowTo (msg) {
    switch (msg.text.toLowerCase()) {
        case 'how to':
            var text = "In questa sezione puoi ottenere le informazioni sul corretto svolgimento delle diverse pratiche legate all'Università";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Ammissioni', 'Immatricolazioni'],
                        ['Tasse Universitarie', 'Borse di studio'],
                        ['Trasferimenti', 'Supporto'],
                        ['Libera Circolazione', 'Open Day'],
                        ['Rinnovo Iscrizioni', 'Futuro Studente'],
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            bot.sendMessage(msg.chat.id, text, keyboard);

            break;
        case 'tasse universitarie':
            var text = "Qui puoi trovare tutte le informazioni sulle tasse che ti possono interessare. Seleziona un argomento da sotto";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Tasse A.A. 17-18', 'ISEE A.A. 17-18'],
                        ['Pagamenti', 'Rimborsi'],
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'init');
            bot.sendMessage(msg.chat.id, text, keyboard);

            break;
        case 'rimborsi':
            how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'rimborsi');
            break;
        case 'pagamenti':
            how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'pagamenti');
            break;
        case 'tasse a.a. 17-18':
            how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'tasse');
            break;
        case 'isee a.a. 17-18':
            how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'isee');
            break;
        case 'ammissioni':
            var text = "Qui puoi trovare tutte e le informazioni sulle ammissioni ai corsi di laurea che ti possono interessare";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Ammissioni Lauree e Lauree Magistrali a ciclo unico'],
                        ['Ammissioni Lauree Magistrali']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            how.homeAmmissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', bot, msg, 'init');
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'ammissioni lauree e lauree magistrali a ciclo unico':
            how.homeAmmissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', bot, msg, 'ammissioni_triennali');
            break;
        case 'ammissioni lauree magistrali':
            how.homeAmmissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', bot, msg, 'ammissioni_magistrali');
            break;
        case 'immatricolazioni':
            var text = "Qui puoi trovare tutte e le informazioni sulle immatricolazioni ai corsi di laurea che ti possono interessare";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Immatricolazioni Lauree e Lauree Magistrali a ciclo unico'],
                        ['Immatricolazioni Lauree Magistrali']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            how.homeImmatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', bot, msg, 'init');
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'immatricolazioni lauree e lauree magistrali a ciclo unico':
            how.homeImmatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', bot, msg, 'immatricolazioni_triennali');
            break;
        case 'immatricolazioni lauree magistrali':
            how.homeImmatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', bot, msg, 'immatricolazioni_magistrali');
            break;
        case 'rinnovo iscrizioni':
            var text = "Qui puoi trovare tutte e le informazioni sui rinnovi delle iscrizioni ai corsi di laurea";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Rinnovo iscrizione con pagamento tasse'],
                        ['Rinnovo iscrizione con richiesta borsa di studio'],
                        ['Rinnovo iscrizione studenti con bisogni particolari']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'init');
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'rinnovo iscrizione con pagamento tasse':
            how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'rinnovi_tasse');
            break;
        case 'rinnovo iscrizione con richiesta borsa di studio':
            how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'rinnovi_borsa');
            break;
        case 'rinnovo iscrizione studenti con bisogni particolari':
            how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'rinnovi_particolari');
            break;
        case 'borse di studio':
            var text = "Qui puoi trovare tutte le informazioni sulle borse di studio e le agevolazioni fornite dall'Università";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Borse di studio e Posto alloggio'],
                        ['Dichiarazione di invalidità o disabilità'],
                        ['Attesa di Laurea', 'Libera circolazione']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'init');
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'borse di studio e posto alloggio':
            how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'borse_alloggi');
            break;
        case 'dichiarazione di invalidità o disabilità':
            how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'bisogni_particolari');
            break;
        case 'attesa di laurea':
            how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'attesa_laurea');
            break;
        case 'libera circolazione':
            how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'libera_circolazione');
            break;
        case 'trasferimenti':
            var text = "Qui puoi trovare tutte le informazioni riguardanti le modalità e i requisiti per i trasferimenti da e verso UniTrento";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Trasferimento verso un altro ateneo'],
                        ['Trasferimento da un altro ateno'],
                        ['Trasferimento da un altro ateneo Laurea Magistrale']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'init');
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'trasferimento verso un altro ateneo':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Traferimenti_Home', bot, msg, 'trasferimenti_verso');
            break;
        case 'trasferimento da un altro ateneo laurea magistrale':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'trasferimenti_da_magistrale');
            break;
        case 'trasferimento da un altro ateno':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'trasferimenti_da_triennale');
            var text = "Qui puoi trovare tutte le informazioni riguardanti i trasferimenti da un altro ateneo in qualsiasi laurea di UniTrento";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Economia - Giurisprudenza - Lettere'],
                        ['Sociologia - Filosofia'],
                        ['Fisica - Matematica'],
                        ['Ingegneria dell\'Informazione'],
                        ['Psicologia - Scienze Cognitive'],
                        ['Scienza e Tecnologie Biomolecolari'],
                        ['Ingegneria Industriale'],
                        ['Viticoltura ed Enologia'],
                        ['Ingegneria Civile - Ingengeria Ambientale'],
                        ['Ingegneria Edile - Architettura']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'economia - giurisprudenza - lettere': case 'sociologia - filosofia':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'centro');
            break;
        case 'fisica - matematica': case 'ingegneria dell\'informazione':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'povo');
            break;
        case 'psicologia - scienze cognitive':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'rovereto');
            break;
        case 'scienza e tecnologie biomolecolari':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'cibio');
            break;
        case 'ingegneria industriale':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'dii');
            break;
        case 'viticoltura ed enologia':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'enologia');
            break;
        case 'ingegneria civile - ingengeria ambientale':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'dicam');
            break;
        case 'ingegneria edile - architettura':
            how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'edile');
            break;
        case 'supporto':
            how.homeSupporto('https://infostudenti.unitn.it/it/supporto-studenti', './Supporto_Home', bot, msg, 'init');
            break;
        case 'open day':
            how.homeOpenDay('http://events.unitn.it/porteaperte-2017', './OpenDay_Home', bot, msg, 'init');
            break;
        case 'futuro studente':
            var text = "Sei un futuro studente UNITN o vorresti diventarlo? Non riesci ad orientarti nelle varie pagine del sito e non trovi quello che ti serve?\nQuesta sezione è proprio quello che stai cercando! Seleziona uno degli argomenti qui sotto!";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Didattica', 'Iscrizioni'],
                        ['Orientamento', 'Agevolazioni'],
                        ['Servizi', 'Ateneo'],
                        ['Prospective International Student'],
                        ['Non solo studio']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'init');
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'didattica':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'didattica');
            break;
        case 'iscrizioni':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'iscrizioni');
            break;
        case 'orientamento':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'orientamento');
            break;
        case 'agevolazioni':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'agevolazioni');
            break;
        case 'servizi':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'servizi');
            break;
        case 'ateneo':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'ateneo');
            break;
        case 'prospective international student':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'international');
            break;
        case 'non solo studio':
            how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'studio');
            break;
    }
}

// ---------- INTERVALS ----------
var j = cron.scheduleJob({hour: 14, minute: 10, dayOfWeek: 2}, () => {
    bot.emit('funzioniDB');
});

// ---------- EVENTS ----------
bot.on('funzioniDB', UpdateDB);
bot.on('funzioniSpeciali', Special);
bot.on('funzioniDevelop', Develop);
bot.on('funzioniMezzi', Mezzi);
bot.on('funzioniScadenze', Scadenze);
bot.on('funzioniMensa', Mensa);
bot.on('funzioniAvvisi', Avvisi);
bot.on('funzioniLuoghi', Luoghi);
bot.on('funzioniHowTo', HowTo);

bot.on('text', function(msg) {
    if(msg.from.is_bot == false) {
        var testoUtente = msg.text.toLowerCase();

        //  BEGIN TODELETE SECTION
        //if(testoUtente == '/start') {
        if(databaseConnection == undefined || databaseConnection.state === 'disconnected') {
            var text = "Sto preparando il bot per soddisfare le tue richieste!\nAttendi un attimo...";
            bot.sendMessage(msg.chat.id, text);
        }
        //  END TODELETE SECTION

        db.initConnectionLess(databaseConnection)
            .then((con) => {
                databaseConnection = con;

                var query = "UPDATE users SET is_active=1 WHERE ChatID=" + msg.chat.id;
                con.query(query, function (err, result) {
                    if (err) throw err;

                    //  OK
                });

                if(testoUtente != '/start') {
                    if(specialChoices.includes(testoUtente))
                        bot.emit('funzioniSpeciali', msg);
                    else if(developChoices.includes(testoUtente))
                        bot.emit('funzioniDevelop', msg);
                    else if(mezziChoices.includes(testoUtente))
                        bot.emit('funzioniMezzi', msg);
                    else if(scadenzeChoices.includes(testoUtente))
                        bot.emit('funzioniScadenze', msg);
                    else if(mensaChoices.includes(testoUtente))
                        bot.emit('funzioniMensa', msg);
                    else if(avvisiChoices.includes(testoUtente))
                        bot.emit('funzioniAvvisi', msg);
                    else if(luoghiChoices.includes(testoUtente))
                        bot.emit('funzioniLuoghi', msg);
                    else if(howtoChoices.includes(testoUtente))
                        bot.emit('funzioniHowTo', msg);
                    else
                        routeCommands(msg, msg.chat.id, con);
                } else {
                    var text = emoji.emojify("Benvenuto " + msg.from.first_name + " :blush:\n*UniTN Help Center* è un bot sviluppato per aiutare attuali/futuri studenti e turisti di Trento in vari ambiti della loro vita quotidiana :pencil: :video_camera:");
                    BackHome(msg)
                        .then((result) => {
                            var query = "UPDATE users SET nome='" + msg.from.first_name + "',is_bot=" + msg.from.is_bot;

                            if(msg.from.last_name != undefined)
                                query += ",cognome='" + msg.from.last_name + "'";

                            if(msg.from.username != undefined)
                                query += ",nickname='" + msg.from.username + "'";

                            query +=" WHERE ChatID='" + msg.chat.id + "'";
							con.query(query, function (err, result) {
								if (err) throw err;

								bot.sendMessage(msg.chat.id, text, db.createHome());
							});
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            })
            .catch((err) => {
                bot.sendMessage(msg.chat.id, err);
            });
    }

});

bot.on('location', function(msg) {
    db.initiateConnection(databaseConnection)
        .then((con) => {
            databaseConnection = con;
            routeCommands(msg, msg.chat.id, con);
        })
        .catch(err => {
            bot.sendMessage(msg.chat.id, err);
        });
});

bot.on('callback_query', function(msg) {
    if(msg.from.is_bot == false) {
      if(msg.data.includes('howto')){
        console.log(msg.data + "from " + last_command);
        //redirect(msg.data.charAt(0), last_command, last_index);
      }else{
        db.initiateConnection(databaseConnection)
            .then((con) => {
                databaseConnection = con;
                routeCommands(msg, msg.message.chat.id, con);
            })
            .catch(err => {
                bot.sendMessage(msg.message.chat.id, err);
            });
      }
    }
});

exports.BOT = bot;
