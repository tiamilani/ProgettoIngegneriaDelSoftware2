/*--- LAST UPDATE: 2017-11-20 ---*/

// ---------- REQUIRE ----------
const fun = require('./functions.js');
const dw = require('website-scraper');
const fs = require('fs');
const htmlparser = require('htmlparser2');

//Eseguo il parsing del testo del file, in modo da ottenere gli avvisi del giorno per il dipartimento richiesto
function parseHTMLFile(textToParse, stringaDaConfrontare) {
	return new Promise (
		function (resolve, reject) {
			if(!textToParse || !stringaDaConfrontare)
				reject(null);

			var waitingText = "";
			var insideTag = 0;
			var elements = [];

			try {
				//Eseguo il parsing del testo
				var parser = new htmlparser.Parser({
					onopentag: function(tagNameStart) {
						if(tagNameStart == "font")
							insideTag = 1;
					},
					ontext: function(tagText) {
						if(insideTag == 1) {
							if(waitingText == "")
								waitingText = tagText;
							else if(tagText.indexOf(stringaDaConfrontare) != -1) {
								//Rimuovo eventuali "a capo" e i doppi apici dall'avviso
								elements.push((waitingText.replace(/(\r\n|\n|\r)/gm, " ")).replace(/\"/g, ""));
								waitingText = "";
							}
							else
								waitingText = "";
						}
					},
					onclosetag: function(tagNameEnd) {
						if(tagNameEnd == "font")
							insideTag = 0;
					}
				}, { decodeEntities: true });

				parser.write(textToParse);
				parser.end();

				//Restituisco l'array contenente gli avvisi del giorno
				resolve(elements);
			}
			catch (err) { console.log(err.message); reject(null); }
		}
	);
}

//Leggo il file HTML contenente gli avvisi del giorno del dipartimento richiesto
function readHTMLFile(path, bot, msg) {
	return new Promise (
    	function (resolve, reject) {
      		try {
				if(!path) reject(null);

				//Setto la data odierna come riferimento per gli avvisi del giorno
        		var currentDate = new Date();
        		var currentDate_string = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
        		if(currentDate.getDate() < 10)
            		currentDate_string = "0" + currentDate_string;

        		var stringaDaConfrontare = "inserito il " + currentDate_string + " da";

				var avvisi;
        		var fileText = fs.readFileSync(path, 'latin1'); //Lettura file index.html
        		fileText = fileText.replace("&#8203;", "");	//Rimpiazzo eventuali "a capo" presenti nel testo

				//Eseguo il parsing del testo
				parseHTMLFile(fileText, stringaDaConfrontare)
          			.then(avvisi => {
                		//Se non ci sono avvisi
                		if(avvisi.length == 0) {
                  			if(bot != null)
                    			bot.sendMessage(msg.chat.id, "Nessun avviso per oggi");
                  			else
                    			resolve(["Nessun avviso per oggi"]);
                		}
                		else {
                  			if(bot != null)
                    			for(i = 0; i < avvisi.length; i++)
                      				bot.sendMessage(msg.chat.id, avvisi[i]);
                  			else //Restituisco l'array con gli avvisi del giorno
			                    resolve(avvisi);
                		}
              		})
          			.catch(error => { console.log(error); reject(null); } );
      		}
      		catch (e) { console.log(e.message); reject(null); }
    	}
	);
}

//Setto URL e directory relative al dipartimento richiesto
function setURL(dipartimento) {
  	var options;

  	switch (dipartimento) {
    	case "DICAM":
			options = { urls: 'http://www.science.unitn.it/avvisiesami/dicam/avvisi.php', directory: './Avvisi/DICAM' };
			break;
    	case "DII":
			options = { urls: 'http://www.science.unitn.it/avvisiesami/dii-cibio/visualizzare_avvisi.php', directory: './Avvisi/DII' };
			break;
    	case "CISCA":
			options = { urls: 'http://www.science.unitn.it/cisca/avvisi/avvisi.php', directory: './Avvisi/CISCA' };
			break;
    	default:
			options = "ERROR";
			break;
	}

  	return options;
}

function downloadAvvisi(dipartimentoRichiesto, bot, msg) {
  	return new Promise (
    	function (resolve, reject) {
      		//URL e directory utilizzati per scaricare e salvare i file
      		let options = setURL(dipartimentoRichiesto);

			//Se il dipartimento richiesto e' errato oppure non esiste nella lista
      		if(options === "ERROR") {
        		if(bot != null)
          			bot.sendMessage(msg.chat.id, "Dipartimento non riconosciuto, si prega di riprovare");
        		else {
					var json = JSON.stringify
					({
						dipartimento: dipartimentoRichiesto,
						urlDipartimento: "URL non valido",
						avvisiDelGiorno: ["Dipartimento non riconosciuto, si prega di riprovare"]
					});
					resolve(json);
				}
      		} else {
        		try { //Inizio la procedura per ottenere gli avvisi
          			//Elimino le cartelle preesistenti
          			Promise.all([fun.deleteFolderRecursive("./Avvisi")]).then(values => {
            			//Scarico i file nella relativa cartella del dipartimento
            			dw(options)
              				.then((result) => {
								//Inizio procedura
								readHTMLFile("./Avvisi/" + dipartimentoRichiesto + "/index.html", bot, msg)
									.then(res => {
										//Creo il file JSON da restituire alla pagina web
										var json = JSON.stringify
										({
											dipartimento: dipartimentoRichiesto,
											urlDipartimento: options['urls'],
											avvisiDelGiorno: res
										});
										resolve(json);
									})
									.catch((err) => { console.log(err.message); reject(null); });
							})
          					.catch((err) => { console.log(err.message); reject(null); });
          			});
        		}
        		catch (err) { console.log(err.message); reject(null); }
      		}
    	}
	);
}

// ---------- EXPORTS ----------
exports.richiestaAvvisi = downloadAvvisi;

exports.parseHTMLFile = parseHTMLFile;
exports.readHTMLFile = readHTMLFile;
exports.setURL = setURL;
