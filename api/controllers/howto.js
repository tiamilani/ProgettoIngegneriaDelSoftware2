'use strict';
const ch = require('cheerio');
const dw = require('website-scraper');
const fs = require('fs');
const ext = require('path');
const how = require('../../TelegramBot/howto.js');

var link_tasse = {};
var link_ammissioni = {};
var link_immatricolazioni = {};
var link_rinnovi = {};
var link_borse = {};
var link_trasferimenti = {};
var link_supporto = {};
var link_openDay = [];
var programs = [];
var registrazione = [];

var didattica = {titolo: "", diretto: "", link: []};
var iscrizioni = {titolo: "", diretto: "", link: []};
var orientamento = {titolo: "", diretto: "", link: []};
var agevolazioni = {titolo: "", diretto: "", link: []};
var servizi = {titolo: "", diretto: "", link: []};
var ateneo = {titolo: "", diretto: "", link: []};
var international = {titolo: "", diretto: "", link: []};
var nonSoloStudio = {titolo: "", diretto: "", link: []};
var saved = false;

exports.base = function(req, resp){
  /*var json = JSON.stringify({
    base: 'switch',
    type: 'howto'
  });
  resp.end(json);*/

  console.log('Switch per verificare la richiesta in corso');
	resp.writeHead(200, {"Content-Type": "application/json"});

  var section = req.query.section;
  var subsection = req.query.sub;
  var detail = req.query.detail;
  var arg = req.query.arg;

  switch (section) {
    case 'ammissioni':
                      resp.end(ammissioni());
      break;
    case 'immatricolazioni':

      break;
    case 'tasseUniversitarie':

      break;
    case 'borseDiStudio':

      break;
    case 'trasferimenti':

      break;
    case 'supporto':

      break;
    case 'liberaCircolazione':

      break;
    case 'openDay':
                    openDay('http://events.unitn.it/porteaperte-2017', './OpenDay_Home', resp);

      break;
    case 'rinnovoIscrizioni':

      break;
    case 'futuroStudente':

      break;
    default:

  }

}
var ammissioni = function(){




  var json = JSON.stringify({

  });

  return json;
}


/*var deleteFolderAndFile = function (path, estensione) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index){
			var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory()) {
				if(ext.extname(curPath) != estensione)
					fs.unlinkSync(curPath);
			}
			else {
				deleteFolderAndFile(curPath);
				try { fs.rmdirSync(curPath); } catch(e) { }
			}
		});
	}
}

function isEmptyObj(obj) {
  for(var key in obj){
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

function openDayFolder(dir, options){
  return new Promise(
    function(resolve, reject){
      if(!fs.existsSync(dir)){
        console.log("NEW OPEN DAY FOLDER");
        dw(options).then(result => {
          deleteFolderAndFile(dir, '.html');
          var file = fs.readdirSync(dir);
          console.log("FILE SALVATO");
          resolve(file);
        }).catch((err) => {reject(err); });
      }else{
        var file = fs.readdirSync(dir);
        resolve(file);
      }
    }
  );
}


function readOpenDayFile(dir, file){
  return new Promise(
    function(resolve, reject){
      if(isEmptyObj(link_openDay)){
        var $ = ch.load(fs.readFileSync(dir + "/" + file));
        console.log(dir + "/" + file);
        $("#content-left strong").each(function() {
          var oneDate = $(this).text().trim();
          link_openDay.push(oneDate);
          console.log(link_openDay[link_openDay-1]);
          var insert = $(this).children().attr('href');
          if(insert != undefined && insert.includes('http')){
            programs.push(insert);
          }
        });
        $("#content-right a").each(function() {
          var prenota = $(this).attr('href');
          registrazione.push(prenota);
        });
        resolve(link_openDay);
      }else{
        resolve(link_openDay);
      }
    }
  );
}*/

var openDay = function(link, dir, resp){
  var json;
  //var message = 'stringa vuota';
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB OPEN DAY FUNCTION");
  how.openDayFolder(dir, options)
    .then(file => {
      how.readOpenDayFile(dir, file)
      .then((dates) => {
        openDaySaving(dates)
        .then((message) => {
          console.log("terzo promise");
          openDayJSON(message)
          .then((json) => {
            resp.end(json)
          });
        });
      });
    })
    .catch((err) => {console.log(err); });
}

function openDaySaving(dates){
  return new Promise(
    function(resolve, reject){
    var giorni = "";
    for(var j = 0; j < dates.length; j++){
      giorni = giorni + dates[j] + "\n";
    }
    var prenotazioni = "";
    console.log("prenotazioni" + how.prenotazioni.length);
    for(var i = 0; i < registrazione.length; i++){
      prenotazioni = prenotazioni + registrazione[i] + "\n";
    }

    console.log("date" + dates.length);


    /*var message = "I giorni previsti per Porte Aperte sono: \n\n" + giorni +
                  "\nSono disponibili i seguenti programmi: \n\n" + programs +
                  "\n\nInoltre, per poter partecipare, è necessaria la registrazione \n\n" + prenotazioni;*/

    var message = {days: dates, prog: programs, ticket: prenotazioni};

    console.log("Sto creando il json");
    resolve(message);
  });
}

function openDayJSON(message){
  return new Promise(
    function(resolve, reject){
      var json = JSON.stringify({
        days: message.days,
        programs: message.prog,
        ticket: message.ticket
      });
      resolve(json);
    });
}
