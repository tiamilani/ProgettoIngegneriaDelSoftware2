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

var didattica = {titolo: "", diretto: "", link:{} };
var iscrizioni = {titolo: "", diretto: "", link:{} };
var orientamento = {titolo: "", diretto: "", link:{} };
var agevolazioni = {titolo: "", diretto: "", link:{} };
var servizi = {titolo: "", diretto: "", link:{} };
var ateneo = {titolo: "", diretto: "", link:{} };
var international = {titolo: "", diretto: "", link:{} };
var nonSoloStudio = {titolo: "", diretto: "", link:{} };
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

  switch (section) {
    case 'ammissioni':
                      ammissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', 'ammissioni', link_ammissioni, resp, subsection);
      break;

    case 'immatricolazioni':
                            immatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', 'immatricolazioni', link_immatricolazioni, resp, subsection);
      break;
    case 'tasseUniversitarie':
                              tasseUniversitarie('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', 'tasse', link_tasse, resp, subsection, detail);
      break;
    case 'borse':
                          borseDiStudio('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', 'borse', link_borse, resp, subsection);
      break;
    case 'trasferimenti':
                          trasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', 'trasferimenti', link_trasferimenti, resp, subsection);
      break;
    case 'supporto':
                    supporto('https://infostudenti.unitn.it/it/supporto-studenti', './Supporto_Home', 'supporto', link_supporto, resp);
      break;
    case 'liberaCircolazione':
                              borseDiStudio('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', 'borse', link_borse, resp, 'libera-circolazione');
      break;
    case 'openDay':
                    openDay('http://events.unitn.it/porteaperte-2017', './OpenDay_Home', resp);
      break;
    case 'rinnovi':
                              rinnovoIscrizioni('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', 'rinnovi', link_rinnovi, resp, subsection);
      break;
    case 'futuroStudente':
                          futuroStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', resp, subsection, detail);
      break;
    default: break;
  }

}


var deleteFolderAndFile = function (path, estensione) {
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
        $("#content-left strong").each(function() {
          var oneDate = $(this).text().trim();
          link_openDay.push(oneDate);
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
}

var openDay = function(link, dir, resp){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB OPEN DAY FUNCTION");
  openDayFolder(dir, options)
    .then(file => {
      readOpenDayFile(dir, file)
      .then((dates) => {
        openDaySaving(dates)
        .then((json) => {
          console.log("terzo promise");
          resp.end(json);
        });
      });
    })
    .catch((err) => {console.log(err); });
}

function openDaySaving(dates){
  return new Promise(
    function(resolve, reject){

    var json = JSON.stringify({
      days: dates,
      programs: programs,
      registration: registrazione
    });

    console.log("Sto creando il json");
    resolve(json);
  });
}

function infoFolder(dir, options){
  return new Promise(
    function(resolve, reject){
      if(!fs.existsSync(dir)){
        console.log("NEW INFO FOLDER");
        dw(options).then(result => {
          deleteFolderAndFile(dir, '.html');
          var file = fs.readdirSync(dir);
          console.log("FILE SALVATO");
          resolve(file);
        }).catch((err) => {reject("Impossibile accedere alla risorsa in questo momento. Riprovare più tardi"); });
      }else{
        var file = fs.readdirSync(dir);
        resolve(file);
      }
    }
  );
}

function readInfoFiles(dir, file, page, oggetto){
  return new Promise(
    function(resolve, reject){
      if(isEmptyObj(oggetto)){
        var $ = ch.load(fs.readFileSync(dir + "/" + file));
        $("a").each(function () {
            var oneLink = $(this).attr('href');
            var oneDescription = $(this).parent().siblings().text().trim();
            oneLink = String(oneLink);
            oneDescription = String(oneDescription);
            if(oneLink.includes('infostudenti')){
              if(page == 'tasse'){
                if(oneLink.includes('rimborso')){
                  link_tasse.rimborsi = oneLink;
                  link_tasse.explain_rimborsi = oneDescription;
                }else if(oneLink.includes('tasse')){
                  link_tasse.tasse = oneLink;
                  link_tasse.explain_tasse = oneDescription;
                }else if(oneLink.includes('pagamenti')){
                  link_tasse.pagamenti = oneLink;
                  link_tasse.explain_pagamenti = oneDescription;
                }else if(oneLink.includes('isee')  && !oneLink.includes('stranieri')){
                  link_tasse.iseeIT = oneLink;
                  link_tasse.explain_iseeIT = oneDescription;
                }else if(oneLink.includes('isee') && oneLink.includes('stranieri')){
                  link_tasse.iseeEX = oneLink;
                  link_tasse.explain_iseeEX = oneDescription;
                }
              }else if(page == 'ammissioni'){
                if(oneLink.includes('lauree-triennali') && oneLink.includes('lauree-magistrali')){
                  link_ammissioni.triennale = oneLink;
                  link_ammissioni.explain_triennale = oneDescription;
                }else{
                  link_ammissioni.magistrale = oneLink;
                  link_ammissioni.explain_magistrale = oneDescription;
                }
              }else if(page == 'immatricolazioni'){
                if(oneLink.includes('lauree-triennali') && oneLink.includes('lauree-magistrali')){
                  link_immatricolazioni.triennale = oneLink;
                  link_immatricolazioni.explain_triennale = oneDescription;
                }else{
                  link_immatricolazioni.magistrale = oneLink;
                  link_immatricolazioni.explain_magistrale = oneDescription;
                }
              }else if(page == 'rinnovi'){
                if(oneLink.includes('pagamento-tasse')){
                  link_rinnovi.tasse = oneLink;
                  link_rinnovi.explain_tasse = oneDescription;
                }else if(oneLink.includes('borsa-di-studio')){
                  link_rinnovi.borsa = oneLink;
                  link_rinnovi.explain_borsa = oneDescription;
                }else if(oneLink.includes('bisogni-speciali')){
                  link_rinnovi.particolari = oneLink;
                  link_rinnovi.explain_particolari = oneDescription;
                }
              }else if(page == 'borse'){
                if(oneLink.includes('borsa-di-studio') && oneLink.includes('posto-alloggio')){
                  link_borse.agevolazioni = oneLink;
                  link_borse.explain_agevolazioni = oneDescription;
                }else if(oneLink.includes('bisogni-speciali')){
                  link_borse.invalidita = oneLink;
                  link_borse.explain_invalidita = oneDescription;
                }else if(oneLink.includes('libera-circolazione')){
                  link_borse.circolazione = oneLink;
                  link_borse.explain_circolazione = oneDescription;
                }else if(oneLink.includes('attesa-di-laurea')){
                  link_borse.attesa = oneLink;
                  link_borse.explain_attesa = oneDescription;
                }
              }else if(page == 'trasferimenti'){
                if(oneLink.includes('verso-altro-ateneo')){
                  link_trasferimenti.verso = oneLink;
                  link_trasferimenti.explain_verso = oneDescription;
                }else if(oneLink.includes('da-altro-ateneo') && oneLink.includes('laurea-magistrale')){
                  link_trasferimenti.da_magistrale = oneLink;
                  link_trasferimenti.explain_da_magistrale = oneDescription;
                }
              }else if(page == 'supporto'){
                if(oneLink.includes('prenotazione')){
                  link_supporto.prenotazione = oneLink;
                  link_supporto.explain_prenotazione = oneDescription;
                }
              }
            }
        });
        resolve();
      }else{
        resolve();
      }
    }
  );
}

var ammissioni = function(link, dir, page, oggetto, resp, action){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB AMMISSIONI FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        ammissioniSaving(action)
        .then((json) => {
          console.log("terzo promise");
          resp.end(json);
        });
      });
    })
    .catch((err) => {console.log(err); });
}

function ammissioniSaving(action){
  return new Promise(
    function(resolve, reject){

    switch(action){
      case('ammissioni-triennali'):
                                    var json = JSON.stringify({
                                      explain: link_ammissioni.explain_triennale,
                                      link: link_ammissioni.triennale
                                    });
                                    resolve(json);
      break;
      case('ammissioni-magistrali'):
                                    var json = JSON.stringify({
                                      explain: link_ammissioni.explain_magistrale,
                                      link: link_ammissioni.magistrale
                                    });
                                    resolve(json);
      break;
    }

  });
}

var immatricolazioni = function(link, dir, page, oggetto, resp, action){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB IMMATRICOLAZIONI FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        immatricolazioniSaving(action)
        .then((json) => {
          console.log("terzo promise");
          resp.end(json);
        });
      });
    })
    .catch((err) => {console.log(err); });
}

function immatricolazioniSaving(action){
  return new Promise(
    function(resolve, reject){

    switch(action){
      case('immatricolazioni-triennali'):
                                    var json = JSON.stringify({
                                      explain: link_immatricolazioni.explain_triennale,
                                      link: link_immatricolazioni.triennale
                                    });
                                    resolve(json);
      break;

      case('immatricolazioni-magistrali'):
                                    var json = JSON.stringify({
                                      explain: link_immatricolazioni.explain_magistrale,
                                      link: link_immatricolazioni.magistrale
                                    });
                                    resolve(json);
      break;

    }

  });
}

var tasseUniversitarie = function(link, dir, page, oggetto, resp, action, detail){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        tasseUniversitarieSaving(action, detail)
        .then((json) => {
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function tasseUniversitarieSaving(action, detail){
  return new Promise(
    function(resolve, reject){

    switch(action){
      case('rimborsi'):
                        var json = JSON.stringify({
                          explain: link_tasse.explain_rimborsi,
                          link: link_tasse.rimborsi
                        });
                        resolve(json);
      break;

      case('pagamenti'):
                        var json = JSON.stringify({
                          explain: link_tasse.explain_pagamenti,
                          link: link_tasse.pagamenti
                        });
                        resolve(json);
      break;

      case('tasse'):
                    var json = JSON.stringify({
                      explain: link_tasse.explain_tasse,
                      link: link_tasse.tasse
                    });
                    resolve(json);
      break;

      case('isee'):
                    switch(detail){
                      case('residenti'):
                                        var json = JSON.stringify({
                                          explain: link_tasse.explain_iseeIT,
                                          link: link_tasse.iseeIT
                                        });
                                        resolve(json);

                      break;
                      case('non-residenti'):
                                              var json = JSON.stringify({
                                                explain: link_tasse.explain_iseeEX,
                                                link: link_tasse.iseeEX
                                              });
                                              resolve(json);

                      break;
                    }
      break;
    }
  });
}

var borseDiStudio = function(link, dir, page, oggetto, resp, action){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        borseDiStudioSaving(action)
        .then((json) => {
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function borseDiStudioSaving(action){
  return new Promise(
    function(resolve, reject){

    switch(action){
      case('bisogni-speciali'):
                        var json = JSON.stringify({
                          explain: link_borse.explain_invalidita,
                          link: link_borse.invalidita
                        });
                        resolve(json);
      break;

      case('attesa-di-laurea'):
                        var json = JSON.stringify({
                          explain: link_borse.explain_attesa,
                          link: link_borse.attesa
                        });
                        resolve(json);
      break;

      case('libera-circolazione'):
                    var json = JSON.stringify({
                      explain: link_borse.explain_circolazione,
                      link: link_borse.circolazione
                    });
                    resolve(json);
      break;

      case('borsa-e-alloggio'):
                    var json = JSON.stringify({
                      explain: link_borse.explain_agevolazioni,
                      link: link_borse.agevolazioni
                    });
                    resolve(json);
      break;
    }
  });
}

var trasferimenti = function(link, dir, page, oggetto, resp, action){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        trasferimentiSaving(action)
        .then((json) => {
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function trasferimentiSaving(action){
  return new Promise(
    function(resolve, reject){

    switch(action){
      case('trasferimenti-verso'):
                        var json = JSON.stringify({
                          explain: link_trasferimenti.explain_verso,
                          link: link_trasferimenti.verso
                        });
                        resolve(json);
      break;

      case('trasferimenti-da'):
                        var json = JSON.stringify({
                          explain: 'In progress',
                          link: 'Nothing'
                        });
                        resolve(json);
      break;

      case('trasferimenti-da-magistrale'):
                    var json = JSON.stringify({
                      explain: link_trasferimenti.explain_da_magistrale,
                      link: link_trasferimenti.da_magistrale
                    });
                    resolve(json);
      break;
    }
  });
}

var supporto = function(link, dir, page, oggetto, resp){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        supportoSaving()
        .then((json) => {
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function supportoSaving(){
  return new Promise(
    function(resolve, reject){

    var json = JSON.stringify({
      explain: link_supporto.explain_prenotazione,
      link: link_supporto.prenotazione
    });
    resolve(json);
  });
}

var rinnovoIscrizioni = function(link, dir, page, oggetto, resp, action){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB RINNOVI FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      console.log(" -> primo promise");
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        console.log(" -> secondo promise");
        rinnovoIscrizioniSaving(action)
        .then((json) => {
          console.log(" -> terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function rinnovoIscrizioniSaving(action){
  return new Promise(
    function(resolve, reject){

    switch(action){
      case('rinnovo-e-tasse'):
                        var json = JSON.stringify({
                          explain: link_rinnovi.explain_tasse,
                          link: link_rinnovi.tasse
                        });
                        resolve(json);
      break;

      case('rinnovo-e-borse'):
                        var json = JSON.stringify({
                          explain: link_rinnovi.explain_borsa,
                          link: link_rinnovi.borsa
                        });
                        resolve(json);
      break;

      case('rinnovo-bisogni-particolari'):
                    var json = JSON.stringify({
                      explain: link_rinnovi.explain_particolari,
                      link: link_rinnovi.particolari
                    });
                    resolve(json);
      break;
    }
  });
}

function studentFolder(dir, options){
  return new Promise(
    function(resolve, reject){
      if(!fs.existsSync(dir)){
        console.log("NEW STUDENT FOLDER");
        dw(options).then(result => {
          deleteFolderAndFile(dir, '.html');
          var file = fs.readdirSync(dir);
          console.log("FILE SALVATO");
          resolve(file);
        }).catch((err) => {reject("Impossibile accedere alla risorsa in questo momento. Riprovare più tardi"); });
      }else{
        var file = fs.readdirSync(dir);
        resolve(file);
      }
    }
  );
}

function readStudentFile(dir, file){
  return new Promise(
    function(resolve, reject){
      console.log("SECOND PROMISE");
      if(!saved){
        var $ = ch.load(fs.readFileSync(dir + "/" + file));
        $("#section-content ul.menu li.expanded > a").each(function() {
          var title = $(this).text().trim();
          var link = $(this).attr('href');

          controlAssign(title, link, $(this), $);

        });

        $("#section-content ul.menu li.expanded > span").each(function() {
          var title1 = $(this).text().trim();

          controlAssign(title1, "", $(this), $);
        });

        saved = true;
      }

    resolve();
    }
  );
}


function controlAssign(title, link, node, $){

  console.log(title.toLowerCase());
  switch(title.toLowerCase()){
    case 'didattica':
                      if(didattica.titolo == ""){
                        didattica.titolo = title;
                      }
                      if(link.length != 0 && didattica.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        didattica.diretto = link;
                      }

                      if(didattica.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim();
                          console.log(desc);
                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }

                          if(isEmptyObj(didattica.link)){
                            console.log('didattica.link è vuoto, lo riempio');
                            if(ref.includes('corsi'))
                              didattica.link.corsi = ref;
                            else if(ref.includes('dottorati'))
                              didattica.link.dottorati = ref;
                            else if(ref.includes('master'))
                              didattica.link.master = ref;
                          }
                        });
                      }

                      break;

    /*case 'iscrizioni':
                      if(iscrizioni.titolo == ""){
                        iscrizioni.titolo = title;
                      }
                      if(link.length != 0 && iscrizioni.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        iscrizioni.diretto = link;
                      }

                      if(iscrizioni.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          iscrizioni.link.push(ref)
                        });
                      }

                      break;

    case 'orientamento':
                      if(orientamento.titolo == ""){
                        orientamento.titolo = title;
                      }
                      if(link.length != 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        orientamento.diretto = link;
                      }

                      node.siblings().children("li").children("a").each(function(){
                        var ref = $(this).attr('href');
                        if(!ref.includes('http')){
                          ref = 'www.unitn.it' + ref;
                        }
                        orientamento.link.push(ref)
                      });

                      break;

    case 'agevolazioni':
                      if(agevolazioni.titolo == ""){
                        agevolazioni.titolo = title;
                      }
                      if(link.length != 0 && agevolazioni.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        agevolazioni.diretto = link;
                      }

                      if(agevolazioni.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          agevolazioni.link.push(ref)
                        });
                      }

                      break;

    case 'servizi':
                      if(servizi.titolo == ""){
                        servizi.titolo = title;
                      }
                      if(link.length != 0 && servizi.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        servizi.diretto = link;
                      }

                      if(servizi.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          servizi.link.push(ref)
                        });
                      }

                      break;

    case 'l\'ateneo':
                      if(ateneo.titolo == ""){
                        ateneo.titolo = title;
                      }
                      if(link.length != 0 && ateneo.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        ateneo.diretto = link;
                      }

                      if(ateneo.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          ateneo.link.push(ref)
                        });
                      }

                      break;

    case 'prospective international student':
                      if(international.titolo == ""){
                        international.titolo = title;
                      }
                      if(link.length != 0 && international.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        international.diretto = link;
                      }

                      if(international.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          international.link.push(ref)
                        });
                      }

                      break;

    case 'non solo studio':
                      if(nonSoloStudio.titolo == ""){
                        nonSoloStudio.titolo = title;
                      }
                      if(link.length != 0 && nonSoloStudio.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'www.unitn.it' + link;
                        }
                        nonSoloStudio.diretto = link;
                      }

                      if(nonSoloStudio.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          nonSoloStudio.link.push(ref)
                        });
                      }

                      break;*/
  }
}

var futuroStudente = function(link, dir, resp, subsection, detail){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB RINNOVI FUNCTION");
  studentFolder(dir, options)
    .then(file => {
      console.log(" -> primo promise");
      readStudentFile(dir, file)
      .then(() => {
        console.log(" -> secondo promise");
        futuroStudenteSaving(subsection, detail)
        .then((json) => {
          console.log(" -> terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

var futuroStudenteSaving = function(subsection, detail){
  return new Promise(
    function(resolve, reject){

      var json = JSON.stringify({
        explain: 'tutto arrivato',
        subsection: subsection,
        arg: detail
      });

      resolve(json);
    });
}
