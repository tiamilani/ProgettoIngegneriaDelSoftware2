// ---------- REQUIRE ----------
const dw = require('website-scraper');
const fs = require('fs');
const ext = require('path');
const rmrf = require('rimraf');
const rc = require('read-chunk');
const ft = require('file-type');
const ch = require('cheerio');
const htmlparser = require('htmlparser2');
const systemSleep = require('system-sleep');

// ---------- FUNCTIONS ----------
var deleteAll = function (path) {
    if (fs.existsSync(path)) {  //Controlla se la cartella esiste
        fs.readdirSync(path).forEach(function(file) { //Legge nella cartella i file
            var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory())  //lstatSync -> Se il file è una cartella
				fs.unlinkSync(curPath); //Elimina il file
			else {
				deleteAll(curPath);
				try { fs.rmdirSync(curPath); } catch(e) { }
			}
        });
    }
}

var deleteFolderRecursive = function (path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index){
			var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory()) {
				if(ext.extname(curPath) != '' || fs.statSync(curPath).size < 50000)
					fs.unlinkSync(curPath);
			}
			else {
				deleteFolderRecursive(curPath);
				try { fs.rmdirSync(curPath); } catch(e) { }
			}
		});
	}
}

var downloadFiles = function (link, dir, bot, msg) {
    let options = {
        urls: [link],
        directory: dir,
        recursive: true,
        maxDepth: 1
    };

	/*try {
		var stats = fs.statSync(dir);
		var now = new Date().getTime();
		var endTime = new Date(stats.birthtime).getTime() + 5; // 1 Month = 2592000

		if (now > endTime) { deleteAll(dir); }
	}
	catch(err) { }*/

    if (!fs.existsSync(dir)) {
        dw(options).then((result) => {

			deleteFolderRecursive(dir);
			Promise.all([deleteFolderRecursive]).then(values => {
				var tmpFiles = fs.readdirSync(dir);

		        let i;
				let buffer;
				let type;
		        for(i = 0; i < tmpFiles.length; i++)
				{
					buffer = rc.sync(dir + '/' + tmpFiles[i], 0, 4100);
					type = ft(buffer).ext;
					if(type == 'msi')
						fs.renameSync(dir + '/' + tmpFiles[i], dir + '/File' + (i+1) + '.xls');
					else
						fs.renameSync(dir + '/' + tmpFiles[i], dir + '/File' + (i+1) + '.' + type);
				}

				tmpFiles = fs.readdirSync(dir);

				if(tmpFiles.length > 0)
				{
					for(i = 0; i < tmpFiles.length; i++)
						bot.sendDocument(msg.chat.id, dir + '/' + tmpFiles[i]);
				}
				else
					bot.sendMessage(msg.chat.id, "Purtroppo non ci sono file da visualizzare...");
			});
		}).catch((err) => { console.log("Errore nel download dei file richiesti"); });
	}
	else {
		var tmpFiles = fs.readdirSync(dir);

		if(tmpFiles.length > 0)
		{
			for(i = 0; i < tmpFiles.length; i++)
				bot.sendDocument(msg.chat.id, dir + '/' + tmpFiles[i]);
		}
		else
			bot.sendMessage(msg.chat.id, "Purtroppo non ci sono file da visualizzare...");
	}
}

var rad = function(x) {
    return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2[0] - p1[0]);
    var dLong = rad(p2[1] - p1[1]);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

var deleteFilesWebcam = function (path, filesNotRemove) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index){
			var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory()) {
                let i;
                let b;
                for(i = 0, b = 0; i < filesNotRemove.length; i++)
                {
                    if(file == filesNotRemove[i])
                        b = 1;
                }

                if(b == 0)
                    fs.unlinkSync(curPath);
			}
			else {
				deleteFilesWebcam(curPath, filesNotRemove);
				try { fs.rmdirSync(curPath); } catch(e) { }
			}
		});
	}
}

var downloadPhoto = function (link, dir, filesNotRemove) {
    let options = {
        urls: [link],
        directory: dir
    };

    dw(options).then((result) => {
		deleteFilesWebcam(dir, filesNotRemove);

		Promise.all([deleteFilesWebcam]).then(values => {
            var tmpFiles = fs.readdirSync(dir + '/images');

	        let i;
			let buffer;
			let type;
	        for(i = 0; i < tmpFiles.length; i++)
				fs.renameSync(dir + '/images/' + tmpFiles[i], dir + '/' + tmpFiles[i]);

            rmrf(dir + '/images', function () {});
		});
	}).catch((err) => { console.log("Errore nel download dei file richiesti"); });
}

function parseHTMLFile(fileToParse, stringaDaConfrontare)
{
  return new Promise(
    function (resolve, reject)
    {
      var waitingText = "";
      var insideTag = 0;
      var elements = [];
      var parser = new htmlparser.Parser(
        {
          onopentag: function(tagNameStart)
          {
            if(tagNameStart == "font")
              insideTag = 1;
          },
          ontext: function(tagText)
          {
            if(insideTag == 1)
            {
                console.log("AVVISO -> " + tagText);
              if(waitingText == "")
                waitingText = tagText;
              else if(tagText.indexOf(stringaDaConfrontare) != -1)
              {
                elements.push(waitingText.replace(/(\r\n|\n|\r)/gm, " "));
                waitingText = "";
              }
              else
                waitingText = "";
            }
          },
          onclosetag: function(tagNameEnd)
          {
            if(tagNameEnd == "font")
              insideTag = 0;
          }
        }, {decodeEntities: true});

      parser.write(fileToParse);
      parser.end();

      resolve(elements);
    });
}

function readHTMLFile(path, bot, msg)
{
  return new Promise(
    function (resolve, reject)
    {
      try
      {
        var currentDate = new Date();
        var currentDate_string = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
        if(currentDate.getDate() < 10)
            currentDate_string = "0" + currentDate_string;
        var stringaDaConfrontare = "inserito il " + currentDate_string + " da";

        var avvisi = [];
        var fileText = fs.readFileSync(path, 'latin1'); //Lettura file index.html
        fileText = fileText.replace("&#8203;", "");
        parseHTMLFile(fileText, stringaDaConfrontare)
          .then(avvisi =>
              {
                //Se non ci sono avvisi
                if(avvisi.length == 0)
                {
                  if(bot != null)
                    bot.sendMessage(msg.chat.id, "Nessun avviso per oggi");
                  else
                    resolve(["Nessun avviso per oggi"]);
                }
                else //Stampo gli avvisi del giorno
                {
                  if(bot != null)
                    for(i = 0; i < avvisi.length; i++)
                    {
                      bot.sendMessage(msg.chat.id, avvisi[i]);
                      systemSleep(200);
                    }
                  else
                  {
                    resolve(avvisi);
                  }
                }
              })
          .catch(error => { console.log(error); } );
      }
      catch (e) { console.log(e.message); }
    });

}


function setURL(dipartimento)
{
  var options;

  switch (dipartimento)
  {
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

function downloadAvvisi(dipartimento, bot, msg)
{
  return new Promise(
    function (resolve, reject)
    {
      //URL e directory utilizzati per scaricare e salvare i file
      let options = setURL(dipartimento);
      var jsonResult = "dentroDownload";

      if(options === "ERROR")
      {
        if(bot != null)
          bot.sendMessage(msg.chat.id, "Dipartimento non riconosciuto, si prega di riprovare");
        else
          resolve("Dipartimento non riconosciuto, si prega di riprovare");
      }
      else
      {
        try
        {
          //Elimino le cartelle
          Promise.all([deleteFolderRecursive("./Avvisi")]).then(values =>
          {
            //Scarico i file nella relativa cartella
            dw(options)
              .then((result) => { jsonResult = readHTMLFile("./Avvisi/" + dipartimento + "/index.html", bot, msg); resolve(jsonResult);})
              .catch((err) => { console.log(err.message); });
          });
        }
        catch (err) { console.log(err.message); }
      }
    });
}


// ---------- EXPORTS ----------
exports.richiestaFile = downloadFiles;
exports.richiestaFotoMensa = downloadPhoto;
exports.distanceBetween = getDistance;
exports.richiestaAvvisi = downloadAvvisi;
