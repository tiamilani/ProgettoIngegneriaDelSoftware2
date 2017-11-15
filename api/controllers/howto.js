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
                    openDay('https://infostudenti.unitn.it/it/supporto-studenti', './Supporto_Home', resp);
                    console.log("Funzione completata");

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
        var giorni = "";
        for(var j = 0; j < dates.length; j++){
          giorni = giorni + dates[j] + "\n";
        }
        var prenotazioni = "";
        for(var i = 0; i < registrazione.length; i++){
          prenotazioni = prenotazioni + registrazione[i] + "\n";
        }

        message = "I giorni previsti per Porte Aperte sono: \n\n" + giorni +
                  "\nSono disponibili i seguenti programmi: \n\n" + programs +
                  "\n\nInoltre, per poter partecipare, è necessaria la registrazione \n\n" + prenotazioni;

        var json = JSON.stringify({
          days: giorni
        });

        resp.end(json);
      });
    })
    .catch((err) => {console.log(err); });
}
