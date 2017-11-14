// ---------- REQUIRE ----------
const fun = require ('./functions.js');
const dw = require('website-scraper');
const fs = require('fs');
const htmlparser = require('htmlparser2');

// ---------- FUNCTIONS ----------
function parseHTMLFile(fileToParse, stringaDaConfrontare) {
	return new Promise (
		function (resolve, reject) {
			var waitingText = "";
			var insideTag = 0;
			var elements = [];
			var parser = new htmlparser.Parser({
				onopentag: function(tagNameStart) {
					if(tagNameStart == "font")
						insideTag = 1;
				},
				ontext: function(tagText) {
					if(insideTag == 1) {
						console.log("AVVISO -> " + tagText);
						if(waitingText == "")
							waitingText = tagText;
						else if(tagText.indexOf(stringaDaConfrontare) != -1) {
							elements.push(waitingText.replace(/(\r\n|\n|\r)/gm, " "));
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

			parser.write(fileToParse);
			parser.end();

			resolve(elements);
		}
	);
}

function readHTMLFile(path, bot, msg) {
	return new Promise (
    	function (resolve, reject) {
      		try {
        		var currentDate = new Date();
        		var currentDate_string = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
        		if(currentDate.getDate() < 10)
            		currentDate_string = "0" + currentDate_string;

        		var stringaDaConfrontare = "inserito il " + currentDate_string + " da";

				var avvisi = [];
        		var fileText = fs.readFileSync(path, 'latin1'); //Lettura file index.html
        		fileText = fileText.replace("&#8203;", "");

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
                    			for(i = 0; i < avvisi.length; i++) {
                      				bot.sendMessage(msg.chat.id, avvisi[i]);
                      				systemSleep(200);
                    			}
                  			else
			                    resolve(avvisi);
                		}
              		})
          			.catch(error => { console.log(error); } );
      		}
      		catch (e) { console.log(e.message); }
    	}
	);
}


function setURL(dipartimento) {
  	var options;

  	switch (dipartimento) {
    	case "DICAM":
			options = { urls: ['http://www.science.unitn.it/avvisiesami/dicam/avvisi.php'], directory: './Avvisi/DICAM' };
			break;
    	case "DII":
			options = { urls: ['http://www.science.unitn.it/avvisiesami/dii-cibio/visualizzare_avvisi.php'], directory: './Avvisi/DII' };
			break;
    	case "CISCA":
			options = { urls: ['http://www.science.unitn.it/cisca/avvisi/avvisi.php'], directory: './Avvisi/CISCA' };
			break;
    	default:
			options = "ERROR";
			break;
	}

  	return options;
}

function downloadAvvisi(dipartimento, bot, msg) {
  	return new Promise (
    	function (resolve, reject) {
      		//URL e directory utilizzati per scaricare e salvare i file
      		let options = setURL(dipartimento);
      		var jsonResult = "dentroDownload";

      		if(options === "ERROR") {
        		if(bot != null)
          			bot.sendMessage(msg.chat.id, "Dipartimento non riconosciuto, si prega di riprovare");
        		else
          			resolve("Dipartimento non riconosciuto, si prega di riprovare");
      		} else {
        		try {
          			//Elimino le cartelle
          			Promise.all([fun.deleteFolderRecursive("./Avvisi")]).then(values => {
            			//Scarico i file nella relativa cartella
            			dw(options)
              				.then((result) => { jsonResult = readHTMLFile("./Avvisi/" + dipartimento + "/index.html", bot, msg); resolve(jsonResult);})
          					.catch((err) => { console.log(err.message); });
          			});
        		}
        		catch (err) { console.log(err.message); }
      		}
    	}
	);
}

// ---------- EXPORTS ----------
exports.richiestaAvvisi = downloadAvvisi;
