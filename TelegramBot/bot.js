// ---------- REQUIRE ----------
const db = require ('./sectionDevelop.js');
const urban = require ('./sectionMezzi.js');
const dead = require ('./sectionScadenze.js');
const alert = require ('./sectionAvvisi.js');
const place = require ('./sectionLuoghiUtili.js');
const eat = require ('./sectionMensa.js');
//const cron = require('node-schedule');

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
const url = process.env.APP_URL || 'https://botingse2.herokuapp.com:443';

const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

console.log('BOT STARTED webHook: ' + `${url}/bot${TOKEN}`);

var databaseConnection = undefined;

// ---------- INTERVALS ----------
/*setInterval(function() {
    var date = new Date();
    var middle = date.getTime();

    date.setHours(11);
    date.setMinutes(45);
    var min = date.getTime();

    date.setHours(14);
    date.setMinutes(30);
    var max = date.getTime();

    if(middle <= max && middle >= min) {
        rmrf('./WebcamMense', function () {
            fun.richiestaFotoMensa('http://www.operauni.tn.it/servizi/ristorazione/webcam', './WebcamMense', ['Povo01.jpg', 'Povo02.jpg', 'mesiano01.jpg', 'mesiano02.jpg', 'tgar.jpg'])
                .then((res) => {
                    // Nothing
                })
                .catch(err => {
                    console.error(err);
                });
        });
    }

}, 120 * 1000);*/

// ---------- FUNCTIONS ----------
function routeCommands (msg, id, connection) {
    console.log("in reoutes");
	db.initiateConnection(connection)
		.then((con) => {
            databaseConnection = con;
            console.log("init routes");
	        var query = "SELECT * FROM users WHERE ChatID='" + id + "'";
	        con.query(query, function (err, result) {
	            if (err) throw err;

                console.log(result[0].last_command);
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
							urban.All_FF (bot, msg, con);
							break;
						case 'Next_F2_Location_F1':
							urban.Next_F2_Location_F2 (bot, msg, con);
							break;
						case 'Next_F2_Location_F2':
							urban.All_FF (bot, msg, con);
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
			});
		})
		.catch((err) => {
            console.log("error");
			bot.sendMessage(id, err);
		});
}

function OperaUniTN (msg) {
    switch (msg.text) {
        case 'OperaUniTN':
            var text = "In questa sezione puoi ottenere i vari documenti:\nBdS -> Borse di Studio\n150O -> Servizio 150 Ore";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Bandi_BdS', 'Graduatorie_BdS'],
                        ['Bandi_150O', 'Graduatorie_15O']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'Bandi_BdS':
            fun.richiestaFile('http://www.operauni.tn.it/servizi/borse-di-studio', './Bandi_BdS', bot, msg);
            break;
        case 'Graduatorie_BdS':
        	fun.richiestaFile('http://www.operauni.tn.it/servizi/borse-di-studio/graduatorie', './Graduatorie_BdS', bot, msg);
            break;
        case 'Bandi_150O':
        	fun.richiestaFile('http://www.operauni.tn.it/servizi/150-ore/bandi', './Bandi_150O', bot, msg);
            break;
        case 'Graduatorie_15O':
        	fun.richiestaFile('http://www.operauni.tn.it/servizi/150-ore/graduatorie', './Graduatorie_15O', bot, msg);
    }
}

function Mensa (msg) {
    switch (msg.text) {
        case 'Mensa':
            db.initiateConnection(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result) {
                                var text = "In questa sezione puoi ottenere il menu e visualizzare le telecamere delle mense";
                                var keyboard = {
                                    reply_markup: JSON.stringify({
                                        keyboard: [
                                            ['Home'],
                                            ['Povo1_PastoLesto', 'Povo1_PastoCompleto'],
                                            ['Mesiano_1', 'Mesiano_2'],
                                            ['Tommaso_Gar', 'Menu_Mensa'],
                                            ['Nearest']
                                        ],
                                        one_time_keyboard: true,
                                        resize_keyboard: true
                                    })
                                };

                                bot.sendMessage(msg.chat.id, text, keyboard);
                            } else {
                                var text = "In questa sezione puoi ottenere il menu la mensa più vicina";
                                var keyboard = {
                                    reply_markup: JSON.stringify({
                                        keyboard: [
                                            ['Home'],
                                            ['Menu_Mensa','Nearest']
                                        ],
                                        one_time_keyboard: true,
                                        resize_keyboard: true
                                    })
                                };

                                bot.sendMessage(msg.chat.id, text, keyboard);
                            }
                        })
                        .catch((err) => {
                            bot.sendMessage(msg.chat.id, err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
            break;
        case 'Povo1_PastoLesto':
            db.initiateConnection(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                    .then((result) => {
                        if(result) {
                            if (fs.existsSync("./WebcamMense/Povo01.jpg"))
                                bot.sendPhoto(msg.chat.id, "./WebcamMense/Povo01.jpg", {caption : "Mensa Pasto Completo di Povo1"} );
                            else
                                bot.sendMessage(msg.chat.id, "Le videocamere funzionano unicamente dalle 11:45 alle 14:30");
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
        case 'Povo1_PastoCompleto':
            db.initiateConnection(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                    .then((result) => {
                        if(result) {
                            if (fs.existsSync("./WebcamMense/Povo02.jpg"))
                                bot.sendPhoto(msg.chat.id, "./WebcamMense/Povo02.jpg", {caption : "Mensa Pasto Lesto di Povo1"} );
                            else
                                bot.sendMessage(msg.chat.id, "Le videocamere funzionano unicamente dalle 11:45 alle 14:30");
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
        case 'Mesiano_1':
            db.initiateConnection(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                    .then((result) => {
                        if(result) {
                            if (fs.existsSync("./WebcamMense/mesiano01.jpg"))
                                bot.sendPhoto(msg.chat.id, "./WebcamMense/mesiano01.jpg", {caption : "Mensa di Mesiano"} );
                            else
                                bot.sendMessage(msg.chat.id, "Le videocamere funzionano unicamente dalle 11:45 alle 14:30");
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
        case 'Mesiano_2':
            db.initiateConnection(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                    .then((result) => {
                        if(result) {
                            if (fs.existsSync("./WebcamMense/mesiano02.jpg"))
                                bot.sendPhoto(msg.chat.id, "./WebcamMense/mesiano02.jpg", {caption : "Mensa di Mesiano"} );
                            else
                                bot.sendMessage(msg.chat.id, "Le videocamere funzionano unicamente dalle 11:45 alle 14:30");
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
        case 'Tommaso_Gar':
            db.initiateConnection(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                    .then((result) => {
                        if(result) {
                            if (fs.existsSync("./WebcamMense/tgar.jpg"))
                                bot.sendPhoto(msg.chat.id, "./WebcamMense/tgar.jpg", {caption : "Mensa di Tommaso Gar"} );
                            else
                                bot.sendMessage(msg.chat.id, "Le videocamere funzionano unicamente dalle 11:45 alle 14:30");
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
        case 'Menu_Mensa':
        console.log("inoltro");
            fun.richiestaFile('http://www.operauni.tn.it/servizi/ristorazione/menu', './Menu_Mensa', bot, msg);
            break;
        case 'Nearest':
            eat.Mensa_F1 (bot, msg, databaseConnection);
    }
}

function Mezzi (msg) {
    switch (msg.text) {
        case 'Mezzi':
            var text = "In questa sezione puoi ottenere informazioni riguardanti i mezzi di trasporto!";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['Linea','Fermata'],
                        ['PrimiOrari'],
                        ['Avvisi_Linee', 'Tariffe']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };

            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'Linea':
            urban.Linea_F1(bot, msg, databaseConnection);
            break;
        case 'Fermata':
            urban.Fermata_F1(bot, msg, databaseConnection);
            break;
        case 'PrimiOrari':
            urban.Next_F1(bot, msg, databaseConnection);
            break;
        case 'Avvisi_Linee':
            urban.Avvisi_Linee(bot, msg, databaseConnection);
            break;
        case 'Tariffe':
            var text = "*TARIFFE URBANE DI TRENTO*\n\t*Cartaceo*\n\t\t`€1,20 ->` 70 minuti\n\t\t`€1,50 ->` 120 minuti\n\t\t`€3,00 ->` Giornaliero\n\t*OpenMove*\n\t\t`€1,10 ->` 70 minuti\n\t\t`€1,40 ->` 120 minuti\n\t\t`€2,80 ->` Giornaliero\n\t*A Bordo*\n\t\t`€2,00 ->` Corsa Singola";
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

            bot.sendMessage(msg.chat.id, text, keyboard).then(() => {
                bot.sendDocument(msg.chat.id, 'http://www.ttesercizio.it/Public/Documenti/tariffario.pdf', {caption: 'Tariffario Biglietti Cartacei 2017/2018'});
                bot.sendDocument(msg.chat.id, 'http://www.ttesercizio.it/Public/INTROITI/OpenMove_vademecum.pdf', {caption: 'Tariffario Biglietti Elettronici 2017/2018'});
            });
    }
}

function Develop (msg) {
    switch (msg.text) {
        case 'Develop':
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
                                            ['Elimina_Tabelle','Inserisci_Tabelle'],
                                            ['Crea_Indici','Crea_Join'],
                                            ['Reset_Users','Info_DB']
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
        case 'Elimina_Tabelle':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.eliminaDati(bot, msg.chat.id, databaseConnection);
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
        case 'Inserisci_Tabelle':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.inserisciDati(bot, msg.chat.id, databaseConnection);
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
        case 'Reset_Users':
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
        case 'Crea_Indici':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.verificaDati(bot, msg.chat.id, databaseConnection);
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
        case 'Crea_Join':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.prepareMain(bot, msg.chat.id, databaseConnection);
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
        case 'Info_DB':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result)
                                db.dbInfo(bot, msg.chat.id, databaseConnection);
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

function Scadenze (msg) {
    switch (msg.text) {
        case 'Scadenze':
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    db.isAdmin(bot, msg, databaseConnection)
                        .then((result) => {
                            if(result) {
                                dead.mostraScadenze(bot, msg.chat.id, databaseConnection);
                                var text = "Sezione Scadenze";
                                var keyboard = {
                                    reply_markup: JSON.stringify({
                                        keyboard: [
                                            ['Home'],
                                            ['Inserisci_Scadenza','Modifica_Scadenza'],
                                            ['Elimina_Scadenza']
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
        case 'Inserisci_Scadenza':
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
        case 'Modifica_Scadenza':
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
        case 'Elimina_Scadenza':
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

function Avvisi (msg) {
    switch (msg.text) {
        case 'Avvisi':
            var text = "In questa sezione puoi ottenere gli avvisi del giorno dei vari dipartimenti";
            var keyboard = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Home'],
                        ['DICAM','DII','CISCA']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                })
            };
            bot.sendMessage(msg.chat.id, text, keyboard);
            break;
        case 'DICAM':
            alert.richiestaAvvisi("DICAM", bot, msg);
            break;
        case 'DII':
            alert.richiestaAvvisi("DII", bot, msg);
            break;
        case 'CISCA':
            alert.richiestaAvvisi("CISCA", bot, msg);
            break;
    }
}

function Luoghi (msg) {
    switch (msg.text) {
        case 'Luoghi':
            place.Luoghi_F1(bot, msg, databaseConnection);
            break;
    }
}

function EasterEgg (msg) {
    bot.sendMessage(msg.chat.id, "Ti Amo <3");
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
    		.catch(err => {
    			bot.sendMessage(id, err);
    		});
    });
}

function createHome () {
	return {
		parse_mode: "Markdown",
        reply_markup: JSON.stringify({
			keyboard: [
				['Mezzi'],
				['Mensa'],
				['OperaUniTN'],
				['Luoghi'],
				['Avvisi'],
				['Scadenze']
			],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };
}

// ---------- EVENTS ----------
bot.on('funzioniOpera', OperaUniTN);
bot.on('funzioniMensa', Mensa);
bot.on('funzioniMezzi', Mezzi);
bot.on('funzioniDevelop', Develop);
bot.on('funzioniAvvisi', Avvisi);
bot.on('funzioniLuoghi', Luoghi);
bot.on('funzioniScadenze', Scadenze);

bot.on('text', function(msg) {
    if(msg.from.is_bot == false) {
        if((msg.text) != '/start') {
            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    if(['Home'].includes(msg.text)) {
                        BackHome(msg)
                            .then((result) => {
                                bot.sendMessage(msg.chat.id, "Torno alla Home...", createHome());
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                    else if(['Mezzi','Linea','Fermata','PrimiOrari','Avvisi_Linee','Tariffe'].includes(msg.text))
                        bot.emit('funzioniMezzi', msg);
                    else if(['Scadenze','Inserisci_Scadenza','Modifica_Scadenza','Elimina_Scadenza'].includes(msg.text))
                        bot.emit('funzioniScadenze', msg);
                    else if(['OperaUniTN','Bandi_BdS','Graduatorie_BdS','Bandi_150O','Graduatorie_15O'].includes(msg.text))
                        bot.emit('funzioniOpera', msg);
                    else if(['Mensa','Povo1_PastoLesto','Povo1_PastoCompleto','Mesiano_1','Mesiano_2','Tommaso_Gar','Menu_Mensa','Nearest'].includes(msg.text))
                        bot.emit('funzioniMensa', msg);
                    else if(['Develop','Elimina_Tabelle','Inserisci_Tabelle','Reset_Users','Crea_Indici','Crea_Join','Info_DB'].includes(msg.text))
                        bot.emit('funzioniDevelop', msg);
                    else if(['Avvisi','DICAM','DII','CISCA'].includes(msg.text))
                        bot.emit('funzioniAvvisi', msg);
                    else if(['Luoghi'].includes(msg.text))
                        bot.emit('funzioniLuoghi', msg);
                    else if(['Giulia','Ilaria','Virginia'].includes(msg.text))
                        EasterEgg(msg);
                    else
                        routeCommands(msg, msg.chat.id, con);
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
        } else {
            var text = "Sto preparando il bot per soddisfare le tue richieste!\nAttendi un attimo...";
        	bot.sendMessage(msg.chat.id, text);

            text = "Benvenuto " + msg.from.first_name + "!\nUniTN Help Center è un bot sviluppato per aiutare attuali e/o futuri studenti dell'Università degli Studi di Trento in vari ambiti della propria vita quotidiana!";

            db.initConnectionLess(databaseConnection)
                .then((con) => {
                    databaseConnection = con;
                    BackHome(msg)
                        .then((result) => {
                            var query = "UPDATE users SET nome='" + msg.from.first_name + "',is_bot=" + msg.from.is_bot;

                            if(msg.from.last_name != undefined)
                                query += ",cognome='" + msg.from.last_name + "'";

                            if(msg.from.username != undefined)
                                query += ",nickname='" + msg.from.username + "'";

                            query +=" WHERE ChatID='" + msg.chat.id + "'";
							con.query(query, function (err, result) {
								if (err) return reject(err);

								bot.sendMessage(msg.chat.id, text, createHome());
							});
                        })
                        .catch(err => {
                            console.error(err);
                        });
                })
                .catch(err => {
                    bot.sendMessage(msg.chat.id, err);
                });
        }
    }
});

bot.on('location', function(msg) {
    console.log("Location");
    db.initiateConnection(databaseConnection)
        .then((con) => {
            databaseConnection = con;
            console.log("routes");
            routeCommands(msg, msg.chat.id, con);
        })
        .catch(err => {
            bot.sendMessage(msg.chat.id, err);
        });
});

bot.on('callback_query', function(msg) {
    console.log("bot?");
    if(msg.from.is_bot == false) {
        console.log("callback");
        db.initiateConnection(databaseConnection)
            .then((con) => {
                databaseConnection = con;
                console.log("routes");
                routeCommands(msg, msg.message.chat.id, con);
            })
            .catch(err => {
                bot.sendMessage(msg.message.chat.id, err);
            });
    }
});

exports.BOT = bot;
