'use strict';
const ch = require('cheerio');
const dw = require('website-scraper');
const fs = require('fs');
const ext = require('path');

var link_tasse = {};
var link_ammissioni = {};
var link_immatricolazioni = {};
var link_rinnovi = {};
var link_borse = {};
var link_trasferimenti = {};
var link_supporto = {};
var link_openDay = {};
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

  var section = req.query.section;
  var subsection = req.query.sub;
  var detail = req.query.detail;


  console.log('Switch per verificare la richiesta in corso');
  //resp.writeHead(200, {"Content-Type": "application/json"});

  switch (section) {
    case 'ammissioni':
                      ammissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', 'ammissioni', link_ammissioni, resp, section, subsection);
      break;

    case 'immatricolazioni':
                            immatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', 'immatricolazioni', link_immatricolazioni, resp, section, subsection);
      break;
    case 'tasseUniversitarie':
                              tasseUniversitarie('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', 'tasse', link_tasse, resp, section, subsection, detail);
      break;
    case 'borse':
                          borseDiStudio('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', 'borse', link_borse, resp, section, subsection);
      break;
    case 'trasferimenti':
                          trasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', 'trasferimenti', link_trasferimenti, resp, section, subsection, detail);
      break;
    case 'supporto':
                    supporto('https://infostudenti.unitn.it/it/supporto-studenti', './Supporto_Home', 'supporto', link_supporto, resp, section);
      break;
    case 'liberaCircolazione':
                              borseDiStudio('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', 'borse', link_borse, resp, section, 'libera-circolazione');
      break;
    case 'openDay':
                    openDay('http://events.unitn.it/porteaperte-2017', './OpenDay_Home', resp);
      break;
    case 'rinnovi':
                              rinnovoIscrizioni('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', 'rinnovi', link_rinnovi, resp, section, subsection);
      break;
    case 'futuroStudente':
                          futuroStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', resp, section, subsection, detail);
      break;
    case null:
    case undefined:
    case "":
              resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
      break;
    default: resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters"); break;
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
        var indice = 0;
        link_openDay.date = [];
        $("#content-left strong").each(function() {
          link_openDay.date[indice] = {};
          var oneDate = $(this).text().trim();
          link_openDay.date[indice].data = oneDate;
          var insert = $(this).children().attr('href');
          if(insert != undefined && insert.includes('http')){
            link_openDay.date[indice].link = insert;
          }else{
            link_openDay.date[indice].link = "";
          }
          indice++;
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
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function openDaySaving(dates){
  return new Promise(
    function(resolve, reject){

    var json = JSON.stringify({
      programs: dates,
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
                }else if(oneLink.includes('ammissione-passaggio-corso') || oneLink.includes('ammissione-con-passaggio-di-corso')){
									if(oneLink.includes('economia-giurisprudenza')){
										link_trasferimenti.da_centro = oneLink;
										link_trasferimenti.explain_da_centro = oneDescription;
									}else if(oneLink.includes('fisica-matematica')){
										link_trasferimenti.da_povo = oneLink;
										link_trasferimenti.explain_da_povo = oneDescription;
									}else if(oneLink.includes('psicologia')){
										link_trasferimenti.da_rovereto = oneLink;
										link_trasferimenti.explain_da_rovereto = oneDescription;
									}else if(oneLink.includes('scienze-tecnologie')){
										link_trasferimenti.da_cibio = oneLink;
										link_trasferimenti.explain_da_cibio = oneDescription;
									}else if(oneLink.includes('ingegneria-industriale')){
										link_trasferimenti.da_industriale = oneLink;
										link_trasferimenti.explain_da_industriale = oneDescription;
									}else if(oneLink.includes('viticoltura-ed-enologia')){
										link_trasferimenti.da_enologia = oneLink;
										link_trasferimenti.explain_da_enologia = oneDescription;
									}else if(oneLink.includes('civile-ambiente')){
										link_trasferimenti.da_dicam = oneLink;
										link_trasferimenti.explain_da_dicam = oneDescription;
									}else if(oneLink.includes('edile-architettura')){
										link_trasferimenti.da_edile = oneLink;
										link_trasferimenti.explain_da_edile = oneDescription;
									}
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

var ammissioni = function(link, dir, page, oggetto, resp, section, subsection){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB AMMISSIONI FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        ammissioniSaving(section, subsection)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log("terzo promise -> parametri forniti corretti, invio la risposta");
          resp.end(json);
        })
        .catch((err) => {
          console.log("Bad request format: missing subsection");
          resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
        });
      });
    })
    .catch((err) => {console.log(err); });
}

function ammissioniSaving(section, subsection){
  return new Promise(
    function(resolve, reject){

    switch(subsection){
      case('ammissioni-triennali'):
                                    var json = JSON.stringify({
                                      explain: link_ammissioni.explain_triennale,
                                      link: link_ammissioni.triennale,
                                      section: section,
                                      subsection: subsection
                                    });
                                    resolve(json);
      break;
      case('ammissioni-magistrali'):
                                    var json = JSON.stringify({
                                      explain: link_ammissioni.explain_magistrale,
                                      link: link_ammissioni.magistrale,
                                      section: section,
                                      subsection: subsection
                                    });
                                    resolve(json);
      break;
      case null:
      case undefined:
      case "":
              reject("400 BAD REQUEST");
      break;
      default: reject("400 BAD REQUEST"); break;
    }

  });
}

var immatricolazioni = function(link, dir, page, oggetto, resp, section, subsection){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB IMMATRICOLAZIONI FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        immatricolazioniSaving(section, subsection)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {
          console.log("Bad request format: missing subsection");
          resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
        });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function immatricolazioniSaving(section, subsection){
  return new Promise(
    function(resolve, reject){

    switch(subsection){
      case('immatricolazioni-triennali'):
                                    var json = JSON.stringify({
                                      explain: link_immatricolazioni.explain_triennale,
                                      link: link_immatricolazioni.triennale,
                                      section: section,
                                      subsection: subsection
                                    });
                                    resolve(json);
      break;

      case('immatricolazioni-magistrali'):
                                    var json = JSON.stringify({
                                      explain: link_immatricolazioni.explain_magistrale,
                                      link: link_immatricolazioni.magistrale,
                                      section: section,
                                      subsection: subsection
                                    });
                                    resolve(json);
      break;
      case null:
      case undefined:
      case "":
              reject("400 BAD REQUEST");
      break;
      default: reject("400 BAD REQUEST"); break;

    }

  });
}

var tasseUniversitarie = function(link, dir, page, oggetto, resp, section, subsection, detail){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        tasseUniversitarieSaving(section, subsection, detail)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {
          console.log("Bad request format: missing subsection or detail parameters");
          resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
        });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function tasseUniversitarieSaving(section, subsection, detail){
  return new Promise(
    function(resolve, reject){

    switch(subsection){
      case('rimborsi'):
                        var json = JSON.stringify({
                          explain: link_tasse.explain_rimborsi,
                          link: link_tasse.rimborsi,
                          section: section,
                          subsection: subsection,
                        });
                        resolve(json);
      break;

      case('pagamenti'):
                        var json = JSON.stringify({
                          explain: link_tasse.explain_pagamenti,
                          link: link_tasse.pagamenti,
                          section: section,
                          subsection: subsection,
                        });
                        resolve(json);
      break;

      case('tasse'):
                    var json = JSON.stringify({
                      explain: link_tasse.explain_tasse,
                      link: link_tasse.tasse,
                      section: section,
                      subsection: subsection,
                    });
                    resolve(json);
      break;

      case('isee'):
                    switch(detail){
                      case('residenti'):
                                        var json = JSON.stringify({
                                          explain: link_tasse.explain_iseeIT,
                                          link: link_tasse.iseeIT,
                                          section: section,
                                          subsection: subsection,
                                          detail: detail
                                        });
                                        resolve(json);

                      break;
                      case('non-residenti'):
                                              var json = JSON.stringify({
                                                explain: link_tasse.explain_iseeEX,
                                                link: link_tasse.iseeEX,
                                                section: section,
                                                subsection: subsection,
                                                detail: detail
                                              });
                                              resolve(json);

                      break;
                      case null:
                      case undefined:
                      case "":
                              reject("400 BAD REQUEST");
                      break;
                      default: reject("400 BAD REQUEST"); break;
                    }
      break;
      case null:
      case undefined:
      case "":
              reject("400 BAD REQUEST");
      break;
      default: reject("400 BAD REQUEST"); break;
    }
  });
}

var borseDiStudio = function(link, dir, page, oggetto, resp, section, subsection){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        borseDiStudioSaving(section, subsection)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {
          console.log("Bad request format: missing subsection");
          resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
        });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function borseDiStudioSaving(section, subsection){
  return new Promise(
    function(resolve, reject){

    switch(subsection){
      case('bisogni-speciali'):
                        var json = JSON.stringify({
                          explain: link_borse.explain_invalidita,
                          link: link_borse.invalidita,
                          section: section,
                          subsection: subsection
                        });
                        resolve(json);
      break;

      case('attesa-di-laurea'):
                        var json = JSON.stringify({
                          explain: link_borse.explain_attesa + "Attesa di laurea",
                          link: link_borse.attesa,
                          section: section,
                          subsection: subsection
                        });
                        resolve(json);
      break;

      case('libera-circolazione'):
                    var json = JSON.stringify({
                      explain: link_borse.explain_circolazione,
                      link: link_borse.circolazione,
                      section: section,
                      subsection: subsection
                    });
                    resolve(json);
      break;

      case('borsa-e-alloggio'):
                    var json = JSON.stringify({
                      explain: link_borse.explain_agevolazioni,
                      link: link_borse.agevolazioni,
                      section: section,
                      subsection: subsection
                    });
                    resolve(json);
      break;
      case null:
      case undefined:
      case "":
              reject("400 BAD REQUEST");
      break;
      default: reject("400 BAD REQUEST"); break;
    }
  });
}

var trasferimenti = function(link, dir, page, oggetto, resp, section, subsection, detail){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        trasferimentiSaving(section, subsection, detail)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {
          console.log("Bad request format: missing subsection or detail parameters");
          resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
        });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function trasferimentiSaving(section, subsection, detail){
  return new Promise(
    function(resolve, reject){

    switch(subsection){
      case('trasferimenti-verso'):
                        var json = JSON.stringify({
                          explain: link_trasferimenti.explain_verso,
                          link: link_trasferimenti.verso,
                          section: section,
                          subsection: subsection
                        });
                        resolve(json);
      break;

      case('trasferimenti-da'):
                        switch(detail){
                          case('centro'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_centro,
                                            link: link_trasferimenti.da_centro,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);

                          break;
                          case('povo'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_povo,
                                            link: link_trasferimenti.da_povo,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                          break;
                          case('rovereto'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_rovereto,
                                            link: link_trasferimenti.da_rovereto,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                          break;
                          case('cibio'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_cibio,
                                            link: link_trasferimenti.da_cibio,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                          break;
                          case('dii'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_industriale,
                                            link: link_trasferimenti.da_industriale,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                          break;
                          case('enologia'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_enologia,
                                            link: link_trasferimenti.da_enologia,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                          break;
                          case('dicam'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_dicam,
                                            link: link_trasferimenti.da_dicam,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                          break;
                          case('edile'):
                                          var json = JSON.stringify({
                                            explain: link_trasferimenti.explain_da_edile,
                                            link: link_trasferimenti.da_edile,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                          break;
                          case null:
                          case undefined:
                          case "":
                                  reject("400 BAD REQUEST");
                          break;
                          default: reject("400 BAD REQUEST"); break;
                        }
      break;

      case('trasferimenti-da-magistrale'):
                    var json = JSON.stringify({
                      explain: link_trasferimenti.explain_da_magistrale,
                      link: link_trasferimenti.da_magistrale,
                      section: section,
                      subsection: subsection
                    });
                    resolve(json);
      break;
      case null:
      case undefined:
      case "":
              reject("400 BAD REQUEST");
      break;
      default: reject("400 BAD REQUEST"); break;
    }
  });
}

var supporto = function(link, dir, page, oggetto, resp, section){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB TASSE FUNCTION");
  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, page, oggetto)
      .then(() => {
        supportoSaving(section)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log("terzo promise");
          resp.end(json);
        })
        .catch((err) => {console.log(err); });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function supportoSaving(section){
  return new Promise(
    function(resolve, reject){

    var json = JSON.stringify({
      explain: link_supporto.explain_prenotazione,
      link: link_supporto.prenotazione,
      section: section
    });
    resolve(json);
  });
}

var rinnovoIscrizioni = function(link, dir, page, oggetto, resp, section, subsection){
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
        rinnovoIscrizioniSaving(section, subsection)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log(" -> terzo promise");
          resp.end(json);
        })
        .catch((err) => {
          console.log("Bad request format: missing subsection or detail parameters");
          resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
        });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function rinnovoIscrizioniSaving(section, subsection){
  return new Promise(
    function(resolve, reject){

    switch(subsection){
      case('rinnovo-e-tasse'):
                        var json = JSON.stringify({
                          explain: link_rinnovi.explain_tasse,
                          link: link_rinnovi.tasse,
                          section: section,
                          subsection: subsection
                        });
                        resolve(json);
      break;

      case('rinnovo-e-borse'):
                        var json = JSON.stringify({
                          explain: link_rinnovi.explain_borsa,
                          link: link_rinnovi.borsa,
                          section: section,
                          subsection: subsection
                        });
                        resolve(json);
      break;

      case('rinnovo-bisogni-particolari'):
                    var json = JSON.stringify({
                      explain: link_rinnovi.explain_particolari,
                      link: link_rinnovi.particolari,
                      section: section,
                      subsection: subsection
                    });
                    resolve(json);
      break;
      case null:
      case undefined:
      case "":
              reject("400 BAD REQUEST");
      break;
      default: reject("400 BAD REQUEST"); break;
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

  switch(title.toLowerCase()){
    case 'didattica':
                      if(didattica.titolo == ""){
                        didattica.titolo = title;
                      }
                      if(link.length != 0 && didattica.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        didattica.diretto = link;
                      }

                      if(isEmptyObj(didattica.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('corsi'))
                            didattica.link.corsi = ref;
                          else if(desc.includes('dottorati'))
                            didattica.link.dottorati = ref;
                          else if(desc.includes('master'))
                            didattica.link.master = ref;

                        });
                      }

                      break;

    case 'iscrizioni':
                      if(iscrizioni.titolo == ""){
                        iscrizioni.titolo = title;
                      }
                      if(link.length != 0 && iscrizioni.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        iscrizioni.diretto = link;
                      }

                      if(isEmptyObj(iscrizioni.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('ammissione')){
                            iscrizioni.link.ammissioni = ref;
                          }
                          else if(desc.includes('infostudenti'))
                            iscrizioni.link.info = ref;
                          else if(desc.includes('titoli'))
                            iscrizioni.link.titoli = ref;
                          else if(desc.includes('tasse'))
                            iscrizioni.link.tasse = ref;

                        });
                      }

                      break;

    case 'orientamento':
                      if(orientamento.titolo == ""){
                        orientamento.titolo = title;
                      }
                      if(link.length != 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        orientamento.diretto = link;
                      }

                      if(isEmptyObj(orientamento.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('costo'))
                            orientamento.link.costo = ref;
                          else if(desc.includes('sito orienta'))
                            orientamento.link.orienta = ref;
                          else if(desc.includes('unitrento'))
                            orientamento.link.unitrento = ref;

                        });
                      }

                      break;

    case 'agevolazioni':
                      if(agevolazioni.titolo == ""){
                        agevolazioni.titolo = title;
                      }
                      if(link.length != 0 && agevolazioni.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        agevolazioni.diretto = link;
                      }

                      if(isEmptyObj(agevolazioni.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('borse'))
                            agevolazioni.link.borse = ref;
                          else if(desc.includes('alloggi'))
                            agevolazioni.link.alloggi = ref;
                          else if(desc.includes('servizi'))
                            agevolazioni.link.servizi = ref;
                          else if(desc.includes('collegio'))
                            agevolazioni.link.clesio = ref;

                        });
                      }

                      break;

    case 'servizi':
                      if(servizi.titolo == ""){
                        servizi.titolo = title;
                      }
                      if(link.length != 0 && servizi.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        servizi.diretto = link;
                      }

                      if(isEmptyObj(servizi.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('biblioteca'))
                            servizi.link.biblioteca = ref;
                          else if(desc.includes('mense'))
                            servizi.link.mense = ref;
                          else if(desc.includes('alloggi'))
                            servizi.link.alloggi = ref;
                          else if(desc.includes('job guidance'))
                            servizi.link.job = ref;
                          else if(desc.includes('cla'))
                            servizi.link.cla = ref;
                          else if(desc.includes('consulenza'))
                            servizi.link.consulenza = ref;
                          else if(desc.includes('matlab'))
                            servizi.link.matlab = ref;
                          else if(desc.includes('informatici')){
                            servizi.link.informatici = ref;
                          }
                          else if(desc.includes('civile'))
                            servizi.link.civile = ref;
                          else if(desc.includes('speciali'))
                            servizi.link.speciali = ref;
                          else if(desc.includes('tutorato'))
                            servizi.link.tutorato = ref;

                        });
                      }

                      break;

    case 'l\'ateneo':
                      if(ateneo.titolo == ""){
                        ateneo.titolo = title;
                      }
                      if(link.length != 0 && ateneo.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        ateneo.diretto = link;
                      }

                      if(isEmptyObj(ateneo.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('presentazione'))
                            ateneo.link.presentazione = ref;
                          else if(desc.includes('strutture'))
                            ateneo.link.strutture = ref;
                          else if(desc.includes('numeri'))
                            ateneo.link.numeri = ref;
                          else if(desc.includes('rankings'))
                            ateneo.link.rankings = ref;
                          else if(desc.includes('trentino'))
                            ateneo.link.trentino = ref;
                          else if(desc.includes('raggiungerci'))
                            ateneo.link.indicazioni = ref;

                        });
                      }

                      break;

    case 'prospective international student':
                      if(international.titolo == ""){
                        international.titolo = title;
                      }
                      if(link.length != 0 && international.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        international.diretto = link;
                      }

                      if(isEmptyObj(international.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('students'))
                            international.link.students = ref;
                          else if(desc.includes('lavorare'))
                            international.link.lavorare = ref;

                        });
                      }

                      break;

    case 'non solo studio':
                      if(nonSoloStudio.titolo == ""){
                        nonSoloStudio.titolo = title;
                      }
                      if(link.length != 0 && nonSoloStudio.diretto.length == 0){
                        if(!link.includes('http')){
                          link = 'http://www.unitn.it' + link;
                        }
                        nonSoloStudio.diretto = link;
                      }

                      if(isEmptyObj(nonSoloStudio.link)){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim().toLowerCase();

                          if(!ref.includes('http')){
                            ref = 'http://www.unitn.it' + ref;
                          }

                          if(desc.includes('apple'))
                            nonSoloStudio.link.apple = ref;
                          else if(desc.includes('associazione studentesche')){
                            nonSoloStudio.link.studenti = ref;
                          }
                          else if(desc.includes('opera'))
                            nonSoloStudio.link.opera = ref;
                          else if(desc.includes('prestabici'))
                            nonSoloStudio.link.prestabici = ref;
                          else if(desc.includes('rappresentanti'))
                            nonSoloStudio.link.rappresentanti = ref;
                          else if(desc.includes('associazioni universitarie'))
                            nonSoloStudio.link.associazioni = ref;
                          else if(desc.includes('uni.sport'))
                            nonSoloStudio.link.sport = ref;
                          else if(desc.includes('giovani'))
                            nonSoloStudio.link.giovani = ref;

                        });
                      }

                      break;
  }
}

var futuroStudente = function(link, dir, resp, section, subsection, detail){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE WEB FUTURO STUDENTE FUNCTION");
  studentFolder(dir, options)
    .then(file => {
      console.log(" -> primo promise");
      readStudentFile(dir, file)
      .then(() => {
        console.log(" -> secondo promise");
        futuroStudenteSaving(section, subsection, detail)
        .then((json) => {
          resp.writeHead(200, {"Content-Type": "application/json"});
          console.log(" -> terzo promise");
          resp.end(json);
        })
        .catch((err) => {
          console.log("Bad request format: missing subsection or detail parameters");
          resp.status(400).send("Bad Request! There is an error in your request, please check for mispelled or incorrect parameters");
        });
      })
      .catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

var futuroStudenteSaving = function(section, subsection, detail){
  return new Promise(
    function(resolve, reject){

      switch(subsection){
        case('didattica'):
                          switch(detail){
                            case('corsi'):
                                          var json = JSON.stringify({
                                            explain: "",
                                            link: didattica.link.corsi,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                            break;
                            case('dottorati'):
                                              var json = JSON.stringify({
                                                explain: "",
                                                link: didattica.link.dottorati,
                                                section: section,
                                                subsection: subsection,
                                                detail: detail
                                              });
                                              resolve(json);
                            break;
                            case('master'):
                                            var json = JSON.stringify({
                                              explain: "",
                                              link: didattica.link.master,
                                              section: section,
                                              subsection: subsection,
                                              detail: detail
                                            });
                                            resolve(json);
                            break;
                            case null:
                            case undefined:
                            case "":
                                    reject("400 BAD REQUEST");
                            break;
                            default: reject("400 BAD REQUEST"); break;
                          }
        break;
        case('iscrizioni'):
                            switch(detail){
                              case('ammissioni'):
                                                  var json = JSON.stringify({
                                                    explain: "",
                                                    link: iscrizioni.link.ammissioni,
                                                    section: section,
                                                    subsection: subsection,
                                                    detail: detail
                                                  });
                                                  resolve(json);
                              break;
                              case('infostudenti'):
                                                    var json = JSON.stringify({
                                                      explain: "",
                                                      link: iscrizioni.link.info,
                                                      section: section,
                                                      subsection: subsection,
                                                      detail: detail
                                                    });
                                                    resolve(json);
                              break;
                              case('riconoscimento-titoli'):
                                                            var json = JSON.stringify({
                                                              explain: "",
                                                              link: iscrizioni.link.titoli,
                                                              section: section,
                                                              subsection: subsection,
                                                              detail: detail
                                                            });
                                                            resolve(json);
                              break;
                              case('tasse'):
                                            var json = JSON.stringify({
                                              explain: "",
                                              link: iscrizioni.link.tasse,
                                              section: section,
                                              subsection: subsection,
                                              detail: detail
                                            });
                                            resolve(json);
                              break;
                              case null:
                              case undefined:
                              case "":
                                      reject("400 BAD REQUEST");
                              break;
                              default: reject("400 BAD REQUEST"); break;
                            }
        break;
        case('orientamento'):
                              switch(detail){
                                case('costo'):
                                              var json = JSON.stringify({
                                                explain: "",
                                                link: orientamento.link.costo,
                                                section: section,
                                                subsection: subsection,
                                                detail: detail
                                              });
                                              resolve(json);
                                break;
                                case('sito-orienta'):
                                                      var json = JSON.stringify({
                                                        explain: "",
                                                        link: orientamento.link.orienta,
                                                        section: section,
                                                        subsection: subsection,
                                                        detail: detail
                                                      });
                                                      resolve(json);
                                break;
                                case('unitrento-orienta'):
                                                          var json = JSON.stringify({
                                                            explain: "",
                                                            link: orientamento.link.unitrento,
                                                            section: section,
                                                            subsection: subsection,
                                                            detail: detail
                                                          });
                                                          resolve(json);
                                break;
                                case null:
                                case undefined:
                                case "":
                                        reject("400 BAD REQUEST");
                                break;
                                default: reject("400 BAD REQUEST");break;
                              }
        break;
        case('agevolazioni'):
                            switch(detail){
                              case('borse'):
                                            var json = JSON.stringify({
                                              explain: "",
                                              link: agevolazioni.link.borse,
                                              section: section,
                                              subsection: subsection,
                                              detail: detail
                                            });
                                            resolve(json);
                              break;
                              case('alloggi'):
                                                var json = JSON.stringify({
                                                  explain: "",
                                                  link: agevolazioni.link.alloggi,
                                                  section: section,
                                                  subsection: subsection,
                                                  detail: detail
                                                });
                                                resolve(json);
                              break;
                              case('servizi-opera'):
                                                    var json = JSON.stringify({
                                                      explain: "",
                                                      link: agevolazioni.link.servizi,
                                                      section: section,
                                                      subsection: subsection,
                                                      detail: detail
                                                    });
                                                    resolve(json);
                              break;
                              case('collegio'):
                                                var json = JSON.stringify({
                                                  explain: "",
                                                  link: agevolazioni.link.clesio,
                                                  section: section,
                                                  subsection: subsection,
                                                  detail: detail
                                                });
                                                resolve(json);
                              break;
                              case null:
                              case undefined:
                              case "":
                                      reject("400 BAD REQUEST");
                              break;
                              default: reject("400 BAD REQUEST"); break;
                            }
        break;
        case('servizi'):
                            switch(detail){
                              case('biblioteca'):
                                                  var json = JSON.stringify({
                                                    explain: "",
                                                    link: servizi.link.biblioteca,
                                                    section: section,
                                                    subsection: subsection,
                                                    detail: detail
                                                  });
                                                  resolve(json);
                              break;
                              case('mense'):
                                              var json = JSON.stringify({
                                                explain: "",
                                                link: servizi.link.mense,
                                                section: section,
                                                subsection: subsection,
                                                detail: detail
                                              });
                                              resolve(json);
                              break;
                              case('alloggi'):
                                                var json = JSON.stringify({
                                                  explain: "",
                                                  link: servizi.link.alloggi,
                                                  section: section,
                                                  subsection: subsection,
                                                  detail: detail
                                                });
                                                resolve(json);
                              break;
                              case('job-guidance'):
                                                    var json = JSON.stringify({
                                                      explain: "",
                                                      link: servizi.link.job,
                                                      section: section,
                                                      subsection: subsection,
                                                      detail: detail
                                                    });
                                                    resolve(json);
                              break;
                              case('cla'):
                                          var json = JSON.stringify({
                                            explain: "",
                                            link: servizi.link.cla,
                                            section: section,
                                            subsection: subsection,
                                            detail: detail
                                          });
                                          resolve(json);
                              break;
                              case('consulenza'):
                                                  var json = JSON.stringify({
                                                    explain: "",
                                                    link: servizi.link.consulenza,
                                                    section: section,
                                                    subsection: subsection,
                                                    detail: detail
                                                  });
                                                  resolve(json);
                              break;
                              case('matlab'):
                                              var json = JSON.stringify({
                                                explain: "",
                                                link: servizi.link.matlab,
                                                section: section,
                                                subsection: subsection,
                                                detail: detail
                                              });
                                              resolve(json);
                              break;
                              case('informatici'):
                                                  var json = JSON.stringify({
                                                    explain: "",
                                                    link: servizi.link.informatici,
                                                    section: section,
                                                    subsection: subsection,
                                                    detail: detail
                                                  });
                                                  resolve(json);
                              break;
                              case('civile'):
                                              var json = JSON.stringify({
                                                explain: "",
                                                link: servizi.link.civile,
                                                section: section,
                                                subsection: subsection,
                                                detail: detail
                                              });
                                              resolve(json);
                              break;s
                              case('bisogni-speciali'):
                                                        var json = JSON.stringify({
                                                          explain: "",
                                                          link: servizi.link.speciali,
                                                          section: section,
                                                          subsection: subsection,
                                                          detail: detail
                                                        });
                                                        resolve(json);
                              break;
                              case('tutorato'):
                                                var json = JSON.stringify({
                                                  explain: "",
                                                  link: servizi.link.tutorato,
                                                  section: section,
                                                  subsection: subsection,
                                                  detail: detail
                                                });
                                                resolve(json);
                              break;
                              case null:
                              case undefined:
                              case "":
                                      reject("400 BAD REQUEST");
                              break;
                              default: reject("400 BAD REQUEST"); break;
                            }
        break;
        case('ateneo'):
                            switch(detail){
                              case('presentazione'):
                                                    var json = JSON.stringify({
                                                      explain: "",
                                                      link: ateneo.link.presentazione,
                                                      section: section,
                                                      subsection: subsection,
                                                      detail: detail
                                                    });
                                                    resolve(json);
                              break;
                              case('strutture'):
                                                var json = JSON.stringify({
                                                  explain: "",
                                                  link: ateneo.link.strutture,
                                                  section: section,
                                                  subsection: subsection,
                                                  detail: detail
                                                });
                                                resolve(json);
                              break;
                              case('numeri'):
                                              var json = JSON.stringify({
                                                explain: "",
                                                link: ateneo.link.numeri,
                                                section: section,
                                                subsection: subsection,
                                                detail: detail
                                              });
                                              resolve(json);
                              break;
                              case('rankings'):
                                                var json = JSON.stringify({
                                                  explain: "",
                                                  link: ateneo.link.rankings,
                                                  section: section,
                                                  subsection: subsection,
                                                  detail: detail
                                                });
                                                resolve(json);
                              break;
                              case('trentino-e-trento'):
                                                        var json = JSON.stringify({
                                                          explain: "",
                                                          link: ateneo.link.trentino,
                                                          section: section,
                                                          subsection: subsection,
                                                          detail: detail
                                                        });
                                                        resolve(json);
                              break;
                              case('come-raggiungerci'):
                                                        var json = JSON.stringify({
                                                          explain: "",
                                                          link: ateneo.link.indicazioni,
                                                          section: section,
                                                          subsection: subsection,
                                                          detail: detail
                                                        });
                                                        resolve(json);
                              break;
                              case null:
                              case undefined:
                              case "":
                                      reject("400 BAD REQUEST");
                              break;
                              default: reject("400 BAD REQUEST"); break;
                            }
        break;
        case('pis'):
                            switch(detail){
                              case('international-in-trento'):
                                                              var json = JSON.stringify({
                                                                explain: "",
                                                                link: international.link.students,
                                                                section: section,
                                                                subsection: subsection,
                                                                detail: detail
                                                              });
                                                              resolve(json);
                              break;
                              case('studiare-lavorare'):
                                                        var json = JSON.stringify({
                                                          explain: "",
                                                          link: international.link.lavorare,
                                                          section: section,
                                                          subsection: subsection,
                                                          detail: detail
                                                        });
                                                        resolve(json);
                              break;
                              case null:
                              case undefined:
                              case "":
                                      reject("400 BAD REQUEST");
                              break;
                              default: reject("400 BAD REQUEST"); break;
                            }
        break;
        case('non-solo-studio'):
                            switch(detail){
                              case('apple'):
                                            var json = JSON.stringify({
                                              explain: "",
                                              link: nonSoloStudio.link.apple,
                                              section: section,
                                              subsection: subsection,
                                              detail: detail
                                            });
                                            resolve(json);
                              break;
                              case('associazioni-studentesche'):
                                                                var json = JSON.stringify({
                                                                  explain: "",
                                                                  link: nonSoloStudio.link.studenti,
                                                                  section: section,
                                                                  subsection: subsection,
                                                                  detail: detail
                                                                });
                                                                resolve(json);
                              break;
                              case('opera'):
                                            var json = JSON.stringify({
                                              explain: "",
                                              link: nonSoloStudio.link.opera,
                                              section: section,
                                              subsection: subsection,
                                              detail: detail
                                            });
                                            resolve(json);
                              break;
                              case('prestabici'):
                                                  var json = JSON.stringify({
                                                    explain: "",
                                                    link: nonSoloStudio.link.prestabici,
                                                    section: section,
                                                    subsection: subsection,
                                                    detail: detail
                                                  });
                                                  resolve(json);
                              break;
                              case('rappresentanti'):
                                                      var json = JSON.stringify({
                                                        explain: "",
                                                        link: nonSoloStudio.link.rappresentanti,
                                                        section: section,
                                                        subsection: subsection,
                                                        detail: detail
                                                      });
                                                      resolve(json);
                              break;
                              case('associazioni-universitarie'):
                                                                  var json = JSON.stringify({
                                                                    explain: "",
                                                                    link: nonSoloStudio.link.associazioni,
                                                                    section: section,
                                                                    subsection: subsection,
                                                                    detail: detail
                                                                  });
                                                                  resolve(json);
                              break;
                              case('unisport'):
                                                var json = JSON.stringify({
                                                  explain: "",
                                                  link: nonSoloStudio.link.sport,
                                                  section: section,
                                                  subsection: subsection,
                                                  detail: detail
                                                });
                                                resolve(json);
                              break;
                              case('link-giovani'):
                                                    var json = JSON.stringify({
                                                      explain: "",
                                                      link: nonSoloStudio.link.giovani,
                                                      section: section,
                                                      subsection: subsection,
                                                      detail: detail
                                                    });
                                                    resolve(json);
                              break;
                              case null:
                              case undefined:
                              case "":
                                      reject("400 BAD REQUEST");
                              break;
                              default: reject("400 BAD REQUEST"); break;
                            }
        break;
        case null:
        case undefined:
        case "":
                reject("400 BAD REQUEST");
        break;
        default: reject("400 BAD REQUEST"); break;
      }
  });
}


exports.infoFolder = infoFolder;
exports.studentFolder = studentFolder;
exports.readInfoFiles = readInfoFiles;
exports.readStudentFile = readStudentFile;
exports.ammissioniSaving = ammissioniSaving;
exports.tasseUniversitarieSaving = tasseUniversitarieSaving;
exports.immatricolazioniSaving = immatricolazioniSaving;
exports.rinnovoIscrizioniSaving = rinnovoIscrizioniSaving;
exports.borseDiStudioSaving = borseDiStudioSaving;
exports.trasferimentiSaving = trasferimentiSaving;
exports.futuroStudenteSaving = futuroStudenteSaving;
