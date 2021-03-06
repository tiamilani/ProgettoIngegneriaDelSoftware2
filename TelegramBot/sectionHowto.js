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
var link_openDay = [];
var programs = [];
var registrazione = [];

var didattica = {titolo: "", diretto: "", link: [] };
var iscrizioni = {titolo: "", diretto: "", link: [] };
var orientamento = {titolo: "", diretto: "", link: [] };
var agevolazioni = {titolo: "", diretto: "", link: [] };
var servizi = {titolo: "", diretto: "", link: [] };
var ateneo = {titolo: "", diretto: "", link: [] };
var international = {titolo: "", diretto: "", link: [] };
var nonSoloStudio = {titolo: "", diretto: "", link: [] };
var saved = false;

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
        }).catch((err) => {reject("Impossibile accedere alla risorsa in questo momento. Riprovare più tardi"); });
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

function readInfoFiles(dir, file, bot, msg, page, oggetto){
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

var downloadPageTasse = function (link, dir, bot, msg, action){
  let options = {
      urls: [link],
      directory: dir
  };

  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, bot, msg, 'tasse', link_tasse)
        .then(() => {
          if(action == 'rimborsi'){
            bot.sendMessage(msg.chat.id, link_tasse.explain_rimborsi + "\n\n" + link_tasse.rimborsi);
          }else if(action == 'tasse'){
            bot.sendMessage(msg.chat.id, link_tasse.explain_tasse + "\n\n" + link_tasse.tasse);
          }else if(action == 'pagamenti'){
            bot.sendMessage(msg.chat.id, link_tasse.explain_pagamenti + "\n\n" + link_tasse.pagamenti);
          }else if(action == "isee"){
            bot.sendMessage(msg.chat.id, link_tasse.explain_iseeIT + "\n\n" + link_tasse.iseeIT);
            bot.sendMessage(msg.chat.id, link_tasse.explain_iseeEX + "\n\n" + link_tasse.iseeEX);
          }
        })
				.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

};

var downloadPageAmmissioni = function (link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, bot, msg, 'ammissioni', link_ammissioni)
        .then((struttura) => {
          if(action == 'ammissioni_triennali'){
            bot.sendMessage(msg.chat.id, link_ammissioni.explain_triennale + "\n\n" + link_ammissioni.triennale)
          }else if(action == 'ammissioni_magistrali'){
            bot.sendMessage(msg.chat.id, link_ammissioni.explain_magistrale + "\n\n" + link_ammissioni.magistrale);
          }
        })
				.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

};

var downloadPageImmatricolazioni = function (link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, bot, msg, 'immatricolazioni', link_immatricolazioni)
        .then(() => {
          if(action == 'immatricolazioni_triennali'){
            bot.sendMessage(msg.chat.id, link_immatricolazioni.explain_triennale + "\n\n" + link_immatricolazioni.triennale)
          }else if(action == 'immatricolazioni_magistrali'){
            bot.sendMessage(msg.chat.id, link_immatricolazioni.explain_magistrale + "\n\n" + link_immatricolazioni.magistrale);
          }
        })
				.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

};

var downloadPageRinnovi = function (link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, bot, msg, 'rinnovi', link_rinnovi)
        .then(() => {
          if(action == 'rinnovi_tasse'){
            bot.sendMessage(msg.chat.id, link_rinnovi.explain_tasse + "\n\n" + link_rinnovi.tasse)
          }else if(action == 'rinnovi_borsa'){
            bot.sendMessage(msg.chat.id, link_rinnovi.explain_borsa + "\n\n" + link_rinnovi.borsa);
          }else if(action == 'rinnovi_particolari'){
            bot.sendMessage(msg.chat.id, link_rinnovi.explain_particolari + "\n\n" + link_rinnovi.particolari)
          }
        })
				.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

}

var downloadPageBorse = function(link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, bot, msg, 'borse', link_borse)
        .then(() => {
          if(action == 'borse_alloggi'){
            bot.sendMessage(msg.chat.id, link_borse.explain_agevolazioni + "\n\n" + link_borse.agevolazioni);
          }else if(action == 'bisogni_particolari'){
            bot.sendMessage(msg.chat.id, link_borse.explain_invalidita + "\n\n" + link_borse.invalidita);
          }else if(action == 'attesa_laurea'){
            bot.sendMessage(msg.chat.id, link_borse.explain_attesa + "\n\n" + link_borse.attesa);
          }else if(action == 'libera_circolazione'){
            bot.sendMessage(msg.chat.id, link_borse.explain_circolazione + "\n\n" + link_borse.circolazione);
          }
        })
				.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

}

var downloadPageTrasferimenti = function(link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, bot, msg, 'trasferimenti', link_trasferimenti)
        .then(() => {
          if(action == 'trasferimenti_verso'){
            bot.sendMessage(msg.chat.id, link_trasferimenti.explain_verso + "\n\n" + link_trasferimenti.verso);
          }else if(action == 'trasferimenti_da_magistrale'){
            bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_magistrale + "\n\n" + link_trasferimenti.da_magistrale);
          }else if(action == 'centro'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_centro + "\n\n" + link_trasferimenti.da_centro);
          }else if(action == 'povo'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_povo + "\n\n" + link_trasferimenti.da_povo);
          }else if(action == 'rovereto'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_rovereto + "\n\n" + link_trasferimenti.da_rovereto);
          }else if(action == 'cibio'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_cibio + "\n\n" + link_trasferimenti.da_cibio);
          }else if(action == 'dii'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_industriale + "\n\n" + link_trasferimenti.da_industriale);
          }else if(action == 'enologia'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_enologia + "\n\n" + link_trasferimenti.da_enologia);
          }else if(action == 'dicam'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_dicam + "\n\n" + link_trasferimenti.da_dicam);
          }else if(action == 'edile'){
						bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_edile + "\n\n" + link_trasferimenti.da_edile);
          }
        })
				.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

}

var downloadPageSupporto = function(link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  infoFolder(dir, options)
    .then(file => {
      readInfoFiles(dir, file, bot, msg, 'supporto', link_supporto)
        .then(() => {
          bot.sendMessage(msg.chat.id, link_supporto.explain_prenotazione + "\n\n" + link_supporto.prenotazione);
        })
				.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

}

var downloadPageOpenDay = function (link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE BOT OPEN DAY FUNCTION");
  openDayFolder(dir, options)
    .then(file => {
      readOpenDayFile(dir, file)
      .then((dates) => {
        var giorni = "";
        for(j = 0; j < dates.length; j++){
          giorni = giorni + dates[j] + "\n";
        }
        var prenotazioni = "";
        for(i = 0; i < registrazione.length; i++){
          prenotazioni = prenotazioni + registrazione[i] + "\n";
        }

        var message = "I giorni previsti per Porte Aperte sono: \n\n" + giorni +
                      "\nSono disponibili i seguenti programmi: \n\n" + programs +
                      "\n\nInoltre, per poter partecipare, è necessaria la registrazione \n\n" + prenotazioni;

        bot.sendMessage(msg.chat.id, message);
      })
			.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });

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

function readStudentFile(dir, file, bot, msg){
  return new Promise(
    function(resolve, reject){
      console.log("SECOND PROMISE");
      if(!saved){
        var $ = ch.load(fs.readFileSync(dir + "/" + file));
        $("#section-content ul.menu li.expanded > a").each(function() {
          var title = $(this).text().trim();
          var link = $(this).attr('href');

          controlAssign(title, link, bot, msg, $(this), $);

        });

        $("#section-content ul.menu li.expanded > span").each(function() {
          var title1 = $(this).text().trim();

          controlAssign(title1, "", bot, msg, $(this), $);
        });

        saved = true;
      }

    resolve();
    }
  );
}


var downloadPageFuturoStudente = function(link, dir, bot, msg, action){
  let options = {
    urls: [link],
    directory: dir
  };

  console.log("INSIDE FUTURO STUDENTE FUNCTION");
  studentFolder(dir, options)
    .then(file => {
      readStudentFile(dir, file, bot, msg)
      .then(() => {

        switch(action){
          case 'didattica':
														var text = "Eccoti nella sezione " + didattica.titolo + "\n\n";
                            if(didattica.diretto.length != 0){
                              text = text + didattica.diretto + "\n\n"
                            }
                            for(var i = 0; i < didattica.link.length; i++)
                              text = text + didattica.link[i].descrizione + "\n" + didattica.link[i].pagina + "\n\n";
														bot.sendMessage(msg.chat.id, text);

                            break;
          case 'iscrizioni':
                            var text = "Eccoti nella sezione " + iscrizioni.titolo + "\n\n";
                            if(iscrizioni.diretto.length != 0){
                              text = text + iscrizioni.diretto + "\n\n"
                            }
                            for(var i = 0; i < iscrizioni.link.length; i++)
                              text = text + iscrizioni.link[i].descrizione + "\n" + iscrizioni.link[i].pagina + "\n\n";
                            bot.sendMessage(msg.chat.id, text);
                            break;
          case 'orientamento':
                            var text = "Eccoti nella sezione " + orientamento.titolo + "\n\n";
                            if(orientamento.diretto.length != 0){
                              text = text + orientamento.diretto + "\n\n"
                            }
                            for(var i = 0; i < orientamento.link.length; i++)
                              text = text + orientamento.link[i].descrizione + "\n" + orientamento.link[i].pagina + "\n\n";
                            bot.sendMessage(msg.chat.id, text);
                            break;
          case 'agevolazioni':
                            var text = "Eccoti nella sezione " + agevolazioni.titolo + "\n\n";
                            if(agevolazioni.diretto.length != 0){
                              text = text + agevolazioni.diretto + "\n\n"
                            }
                            for(var i = 0; i < agevolazioni.link.length; i++)
                              text = text + agevolazioni.link[i].descrizione + "\n" + agevolazioni.link[i].pagina + "\n\n";
                            bot.sendMessage(msg.chat.id, text);
                            break;
          case 'servizi':
                            var text = "Eccoti nella sezione " + servizi.titolo + "\n\n";
                            if(servizi.diretto.length != 0){
                              text = text + servizi.diretto + "\n\n"
                            }
                            for(var i = 0; i < servizi.link.length; i++)
                              text = text + servizi.link[i].descrizione + "\n" + servizi.link[i].pagina + "\n\n";
                            bot.sendMessage(msg.chat.id, text);
                            break;
          case 'ateneo':
                            var text = "Eccoti nella sezione " + ateneo.titolo + "\n\n";
                            if(ateneo.diretto.length != 0){
                              text = text + ateneo.diretto + "\n\n"
                            }
                            for(var i = 0; i < ateneo.link.length; i++)
                              text = text + ateneo.link[i].descrizione + "\n" + ateneo.link[i].pagina + "\n\n";
                            bot.sendMessage(msg.chat.id, text);
                            break;
          case "international":
                            var text = "Eccoti nella sezione " + international.titolo + "\n\n";
                            if(international.diretto.length != 0){
                              text = text + international.diretto + "\n\n"
                            }
                            for(var i = 0; i < international.link.length; i++)
                              text = text + international.link[i].descrizione + "\n" + international.link[i].pagina + "\n\n";
                            bot.sendMessage(msg.chat.id, text);
                            break;
          case "studio":
                            var text = "Eccoti nella sezione " + nonSoloStudio.titolo + "\n\n";
                            if(nonSoloStudio.diretto.length != 0){
                              text = text + nonSoloStudio.diretto + "\n\n"
                            }
                            for(var i = 0; i < nonSoloStudio.link.length; i++)
                              text = text + nonSoloStudio.link[i].descrizione + "\n" + nonSoloStudio.link[i].pagina + "\n\n";
                            bot.sendMessage(msg.chat.id, text);
                            break;
          default: break;
        }

        console.log("COMPLETED");
      })
			.catch((err) => {console.log(err); });
    })
    .catch((err) => {console.log(err); });
}

function controlAssign(title, link, bot, msg, node, $){

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

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }

                          var couple = {descrizione: desc, pagina: ref};
                          didattica.link.push(couple);

                        });
                      }

                      break;

    case 'iscrizioni':
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
                          var desc = $(this).text().trim();

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          var couple = {descrizione: desc, pagina: ref};
                          iscrizioni.link.push(couple);

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

                      if(orientamento.link.length == 0){
                        node.siblings().children("li").children("a").each(function(){
                          var ref = $(this).attr('href');
                          var desc = $(this).text().trim();

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          var couple = {descrizione: desc, pagina: ref};
                          orientamento.link.push(couple);

                        });
                      }

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
                          var desc = $(this).text().trim();

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          var couple = {descrizione: desc, pagina: ref};
                          agevolazioni.link.push(couple);

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
                          var desc = $(this).text().trim();

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          var couple = {descrizione: desc, pagina: ref};
                          servizi.link.push(couple);

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
                          var desc = $(this).text().trim();

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          var couple = {descrizione: desc, pagina: ref};
                          ateneo.link.push(couple);

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
                          var desc = $(this).text().trim();

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          var couple = {descrizione: desc, pagina: ref};
                          international.link.push(couple);

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
                          var desc = $(this).text().trim();

                          if(!ref.includes('http')){
                            ref = 'www.unitn.it' + ref;
                          }
                          var couple = {descrizione: desc, pagina: ref};
                          nonSoloStudio.link.push(couple);

                        });
                      }

                      break;
  }
}


exports.getLinkTasse = function(){
	return link_tasse;
}

exports.getLinkAmmissioni = function(){
	return link_ammissioni;
}

exports.getLinkImmatricolazioni = function(){
	return link_immatricolazioni;
}

exports.getLinkRinnovi = function(){
	return link_rinnovi;
}

exports.getLinkBorse = function(){
	return link_borse;
}

exports.getLinkTrasferimenti = function(){
	return link_trasferimenti;
}

exports.getLinkSupporto = function(){
	return link_supporto;
}

exports.getDidattica = function(){
	return didattica;
}

//--------- FUNZIONI ESPORTATE DA UTILIZZARE NEI TEST ------------
exports.openDayFolder = openDayFolder;
exports.infoFolder = infoFolder;
exports.studentFolder = studentFolder;
exports.readOpenDayFile = readOpenDayFile;
exports.readInfoFiles = readInfoFiles;
exports.readStudentFile = readStudentFile;

//--------- FUNZIONI DA ESPORTARE DA UTILIZZARE COME API ------------
exports.homeTasse = downloadPageTasse;
exports.homeAmmissioni = downloadPageAmmissioni;
exports.homeImmatricolazioni = downloadPageImmatricolazioni;
exports.homeRinnovi = downloadPageRinnovi;
exports.homeBorse = downloadPageBorse;
exports.homeTrasferimenti = downloadPageTrasferimenti;
exports.homeSupporto = downloadPageSupporto;
exports.homeOpenDay = downloadPageOpenDay;
exports.homeFuturoStudente = downloadPageFuturoStudente;
