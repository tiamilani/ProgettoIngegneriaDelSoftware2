// ---------- REQUIRE ----------
const dw = require('website-scraper');
const fs = require('fs');
const ext = require('path');
const rmrf = require('rimraf');
const rc = require('read-chunk');
const ft = require('file-type');
const ch = require('cheerio');

// ---------- FUNCTIONS ----------
var deleteAll = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory())
				fs.unlinkSync(curPath);
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


// // ---------- HOW To BEGIN----------
//
// var deleteFolderAndFile = function (path, estensione) {
// 	if (fs.existsSync(path)) {
// 		fs.readdirSync(path).forEach(function(file, index){
// 			var curPath = path + "/" + file;
// 			if (!fs.lstatSync(curPath).isDirectory()) {
// 				if(ext.extname(curPath) != estensione)
// 					fs.unlinkSync(curPath);
// 			}
// 			else {
// 				deleteFolderAndFile(curPath);
// 				try { fs.rmdirSync(curPath); } catch(e) { }
// 			}
// 		});
// 	}
// }
//
// function isEmptyObj(obj) {
//   for(var key in obj){
//     if(obj.hasOwnProperty(key))
//       return false;
//   }
//   return true;
// }
//
// function openDayFolder(dir, options){
//   return new Promise(
//     function(resolve, reject){
//       if(!fs.existsSync(dir)){
//         console.log("NEW OPEN DAY FOLDER");
//         dw(options).then(result => {
//           deleteFolderAndFile(dir, '.html');
//           var file = fs.readdirSync(dir);
//           console.log("FILE SALVATO");
//           resolve(file);
//         }).catch((err) => {reject("Impossibile accedere alla risorsa in questo momento. Riprovare più tardi"); });
//       }else{
//         var file = fs.readdirSync(dir);
//         resolve(file);
//       }
//     }
//   );
// }
//
// function readOpenDayFile(dir, file, bot, msg){
//   return new Promise(
//     function(resolve, reject){
//       if(isEmptyObj(link_openDay)){
//         var $ = ch.load(fs.readFileSync(dir + "/" + file));
//         $("#content-left strong").each(function() {
//           var oneDate = $(this).text().trim();
//           link_openDay.push(oneDate);
//           var insert = $(this).children().attr('href');
//           if(insert != undefined && insert.includes('http')){
//             programs.push(insert);
//           }
//         });
//         $("#content-right a").each(function() {
//           var prenota = $(this).attr('href');
//           registrazione.push(prenota);
//         });
//         resolve(link_openDay);
//       }else{
//         resolve(link_openDay);
//       }
//     }
//   );
// }
//
// function infoFolder(dir, options){
//   return new Promise(
//     function(resolve, reject){
//       if(!fs.existsSync(dir)){
//         console.log("NEW FOLDER");
//         dw(options).then(result => {
//           deleteFolderAndFile(dir, '.html');
//           var file = fs.readdirSync(dir);
//           console.log("FILE SALVATO");
//           resolve(file);
//         }).catch((err) => {reject("Impossibile accedere alla risorsa in questo momento. Riprovare più tardi"); });
//       }else{
//         var file = fs.readdirSync(dir);
//         resolve(file);
//       }
//     }
//   );
// }
//
// function readInfoFiles(dir, file, bot, msg, page, oggetto){
//   return new Promise(
//     function(resolve, reject){
//       if(isEmptyObj(oggetto)){
//         var $ = ch.load(fs.readFileSync(dir + "/" + file));
//         $("a").each(function () {
//             var oneLink = $(this).attr('href');
//             var oneDescription = $(this).parent().siblings().text().trim();
//             oneLink = String(oneLink);
//             oneDescription = String(oneDescription);
//             if(oneLink.includes('infostudenti')){
//               if(page == 'tasse'){
//                 if(oneLink.includes('rimborso')){
//                   link_tasse.rimborsi = oneLink;
//                   link_tasse.explain_rimborsi = oneDescription;
//                 }else if(oneLink.includes('tasse')){
//                   link_tasse.tasse = oneLink;
//                   link_tasse.explain_tasse = oneDescription;
//                 }else if(oneLink.includes('pagamenti')){
//                   link_tasse.pagamenti = oneLink;
//                   link_tasse.explain_pagamenti = oneDescription;
//                 }else if(oneLink.includes('isee')  && !oneLink.includes('stranieri')){
//                   link_tasse.iseeIT = oneLink;
//                   link_tasse.explain_iseeIT = oneDescription;
//                 }else if(oneLink.includes('isee') && oneLink.includes('stranieri')){
//                   link_tasse.iseeEX = oneLink;
//                   link_tasse.explain_iseeEX = oneDescription;
//                 }
//               }else if(page == 'ammissioni'){
//                 if(oneLink.includes('lauree-triennali') && oneLink.includes('lauree-magistrali')){
//                   link_ammissioni.triennale = oneLink;
//                   link_ammissioni.explain_triennale = oneDescription;
//                 }else{
//                   link_ammissioni.magistrale = oneLink;
//                   link_ammissioni.explain_magistrale = oneDescription;
//                 }
//               }else if(page == 'immatricolazioni'){
//                 if(oneLink.includes('lauree-triennali') && oneLink.includes('lauree-magistrali')){
//                   link_immatricolazioni.triennale = oneLink;
//                   link_immatricolazioni.explain_triennale = oneDescription;
//                 }else{
//                   link_immatricolazioni.magistrale = oneLink;
//                   link_immatricolazioni.explain_magistrale = oneDescription;
//                 }
//               }else if(page == 'rinnovi'){
//                 if(oneLink.includes('pagamento-tasse')){
//                   link_rinnovi.tasse = oneLink;
//                   link_rinnovi.explain_tasse = oneDescription;
//                 }else if(oneLink.includes('borsa-di-studio')){
//                   link_rinnovi.borsa = oneLink;
//                   link_rinnovi.explain_borsa = oneDescription;
//                 }else if(oneLink.includes('bisogni-speciali')){
//                   link_rinnovi.particolari = oneLink;
//                   link_rinnovi.explain_particolari = oneDescription;
//                 }
//               }else if(page == 'borse'){
//                 if(oneLink.includes('borsa-di-studio') && oneLink.includes('posto-alloggio')){
//                   link_borse.agevolazioni = oneLink;
//                   link_borse.explain_agevolazioni = oneDescription;
//                 }else if(oneLink.includes('bisogni-speciali')){
//                   link_borse.invalidita = oneLink;
//                   link_borse.explain_invalidita = oneDescription;
//                 }else if(oneLink.includes('libera-circolazione')){
//                   link_borse.circolazione = oneLink;
//                   link_borse.explain_circolazione = oneDescription;
//                 }else if(oneLink.includes('attesa-di-laurea')){
//                   link_borse.attesa = oneLink;
//                   link_borse.explain_attesa = oneDescription;
//                 }
//               }else if(page == 'trasferimenti'){
//                 if(oneLink.includes('verso-altro-ateneo')){
//                   link_trasferimenti.verso = oneLink;
//                   link_trasferimenti.explain_verso = oneDescription;
//                 }else if(oneLink.includes('da-altro-ateneo') && oneLink.includes('laurea-magistrale')){
//                   link_trasferimenti.da_magistrale = oneLink;
//                   link_trasferimenti.explain_da_magistrale = oneDescription;
//                 }
//               }else if(page == 'supporto'){
//                 if(oneLink.includes('prenotazione')){
//                   link_supporto.prenotazione = oneLink;
//                   link_supporto.explain_prenotazione = oneDescription;
//                 }
//               }
//             }
//         });
//         resolve();
//       }else{
//         resolve();
//       }
//     }
//   );
// }
//
// var downloadPageTasse = function (link, dir, bot, msg, action){
//   let options = {
//       urls: [link],
//       directory: dir
//   };
//
//   infoFolder(dir, options)
//     .then(file => {
//       readInfoFiles(dir, file, bot, msg, 'tasse', link_tasse)
//         .then(() => {
//           if(action == 'rimborsi'){
//             bot.sendMessage(msg.chat.id, link_tasse.explain_rimborsi + "\n\n" + link_tasse.rimborsi);
//           }else if(action == 'tasse'){
//             bot.sendMessage(msg.chat.id, link_tasse.explain_tasse + "\n\n" + link_tasse.tasse);
//           }else if(action == 'pagamenti'){
//             bot.sendMessage(msg.chat.id, link_tasse.explain_pagamenti + "\n\n" + link_tasse.pagamenti);
//           }else if(action == "isee"){
//             bot.sendMessage(msg.chat.id, link_tasse.explain_iseeIT + "\n\n" + link_tasse.iseeIT);
//             bot.sendMessage(msg.chat.id, link_tasse.explain_iseeEX + "\n\n" + link_tasse.iseeEX);
//           }
//         });
//     })
//     .catch((err) => {console.log(err); });
//
// };
//
// var downloadPageAmmissioni = function (link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   infoFolder(dir, options)
//     .then(file => {
//       readInfoFiles(dir, file, bot, msg, 'ammissioni', link_ammissioni)
//         .then(() => {
//           if(action == 'ammissioni_triennali'){
//             bot.sendMessage(msg.chat.id, link_ammissioni.explain_triennale + "\n\n" + link_ammissioni.triennale)
//           }else if(action == 'ammissioni_magistrali'){
//             bot.sendMessage(msg.chat.id, link_ammissioni.explain_magistrale + "\n\n" + link_ammissioni.magistrale);
//           }
//         });
//     })
//     .catch((err) => {console.log(err); });
//
// };
//
// var downloadPageImmatricolazioni = function (link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   infoFolder(dir, options)
//     .then(file => {
//       readInfoFiles(dir, file, bot, msg, 'immatricolazioni', link_immatricolazioni)
//         .then(() => {
//           if(action == 'immatricolazioni_triennali'){
//             bot.sendMessage(msg.chat.id, link_immatricolazioni.explain_triennale + "\n\n" + link_immatricolazioni.triennale)
//           }else if(action == 'immatricolazioni_magistrali'){
//             bot.sendMessage(msg.chat.id, link_immatricolazioni.explain_magistrale + "\n\n" + link_immatricolazioni.magistrale);
//           }
//         });
//     })
//     .catch((err) => {console.log(err); });
//
// };
//
// var downloadPageRinnovi = function (link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   infoFolder(dir, options)
//     .then(file => {
//       readInfoFiles(dir, file, bot, msg, 'rinnovi', link_rinnovi)
//         .then(() => {
//           if(action == 'rinnovi_tasse'){
//             bot.sendMessage(msg.chat.id, link_rinnovi.explain_tasse + "\n\n" + link_rinnovi.tasse)
//           }else if(action == 'rinnovi_borsa'){
//             bot.sendMessage(msg.chat.id, link_rinnovi.explain_borsa + "\n\n" + link_rinnovi.borsa);
//           }else if(action == 'rinnovi_particolari'){
//             bot.sendMessage(msg.chat.id, link_rinnovi.explain_particolari + "\n\n" + link_rinnovi.particolari)
//           }
//         });
//     })
//     .catch((err) => {console.log(err); });
//
// }
//
// var downloadPageBorse = function(link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   infoFolder(dir, options)
//     .then(file => {
//       readInfoFiles(dir, file, bot, msg, 'borse', link_borse)
//         .then(() => {
//           if(action == 'borse_alloggi'){
//             bot.sendMessage(msg.chat.id, link_borse.explain_agevolazioni + "\n\n" + link_borse.agevolazioni);
//           }else if(action == 'bisogni_particolari'){
//             bot.sendMessage(msg.chat.id, link_borse.explain_invalidita + "\n\n" + link_borse.invalidita);
//           }else if(action == 'attesa_laurea'){
//             bot.sendMessage(msg.chat.id, link_borse.explain_attesa + "\n\n" + link_borse.attesa);
//           }else if(action == 'libera_circolazione'){
//             bot.sendMessage(msg.chat.id, link_borse.explain_circolazione + "\n\n" + link_borse.circolazione);
//           }
//         });
//     })
//     .catch((err) => {console.log(err); });
//
// }
//
// var downloadPageTrasferimenti = function(link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   infoFolder(dir, options)
//     .then(file => {
//       readInfoFiles(dir, file, bot, msg, 'trasferimenti', link_trasferimenti)
//         .then(() => {
//           if(action == 'trasferimenti_verso'){
//             bot.sendMessage(msg.chat.id, link_trasferimenti.explain_verso + "\n\n" + link_trasferimenti.verso);
//           }else if(action == 'trasferimenti_da_magistrale'){
//             bot.sendMessage(msg.chat.id, link_trasferimenti.explain_da_magistrale + "\n\n" + link_trasferimenti.da_magistrale);
//           }else if(action == 'trasferimenti_da_triennale'){
//             bot.sendMessage(msg.chat.id, "In Progress");
//           }
//         });
//     })
//     .catch((err) => {console.log(err); });
//
// }
//
// var downloadPageSupporto = function(link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   infoFolder(dir, options)
//     .then(file => {
//       readInfoFiles(dir, file, bot, msg, 'supporto', link_supporto)
//         .then(() => {
//           bot.sendMessage(msg.chat.id, link_supporto.explain_prenotazione + "\n\n" + link_supporto.prenotazione);
//         });
//     })
//     .catch((err) => {console.log(err); });
//
// }
//
// var downloadPageOpenDay = function (link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   console.log("INSIDE OPEN DAY FUNCTION");
//   openDayFolder(dir, options)
//     .then(file => {
//       readOpenDayFile(dir, file, bot, msg)
//       .then((dates) => {
//         var giorni = "";
//         for(j = 0; j < dates.length; j++){
//           giorni = giorni + dates[j] + "\n";
//         }
//         var prenotazioni = "";
//         for(i = 0; i < registrazione.length; i++){
//           prenotazioni = prenotazioni + registrazione[i] + "\n";
//         }
//
//         var message = "I giorni previsti per Porte Aperte sono: \n\n" + giorni +
//                       "\nSono disponibili i seguenti programmi: \n\n" + programs +
//                       "\n\nInoltre, per poter partecipare, è necessaria la registrazione \n\n" + prenotazioni;
//
//         bot.sendMessage(msg.chat.id, message);
//       });
//     })
//     .catch((err) => {console.log(err); });
//
// }
//
// function studentFolder(dir, options){
//   return new Promise(
//     function(resolve, reject){
//       if(!fs.existsSync(dir)){
//         console.log("NEW STUDENT FOLDER");
//         dw(options).then(result => {
//           deleteFolderAndFile(dir, '.html');
//           var file = fs.readdirSync(dir);
//           console.log("FILE SALVATO");
//           resolve(file);
//         }).catch((err) => {reject("Impossibile accedere alla risorsa in questo momento. Riprovare più tardi"); });
//       }else{
//         var file = fs.readdirSync(dir);
//         resolve(file);
//       }
//     }
//   );
// }
//
// function readStudentFile(dir, file, bot, msg){
//   return new Promise(
//     function(resolve, reject){
//       console.log("SECOND PROMISE");
//       if(!saved){
//         var $ = ch.load(fs.readFileSync(dir + "/" + file));
//         $("#section-content ul.menu li.expanded > a").each(function() {
//           var title = $(this).text().trim();
//           var link = $(this).attr('href');
//
//           controlAssign(title, link, bot, msg, $(this), $);
//
//         });
//
//         $("#section-content ul.menu li.expanded > span").each(function() {
//           var title1 = $(this).text().trim();
//
//           controlAssign(title1, "", bot, msg, $(this), $);
//         });
//
//         saved = true;
//       }
//
//     resolve();
//     }
//   );
// }
//
//
// var downloadPageFuturoStudente = function(link, dir, bot, msg, action){
//   let options = {
//     urls: [link],
//     directory: dir
//   };
//
//   console.log("INSIDE FUTURO STUDENTE FUNCTION");
//   studentFolder(dir, options)
//     .then(file => {
//       readStudentFile(dir, file, bot, msg)
//       .then(() => {
//
//         switch(action){
//           case 'didattica':
//                             bot.sendMessage(msg.chat.id, "Titolo: " + didattica.titolo + " e link diretto: " + didattica.diretto);
//                             for(var i = 0; i < didattica.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + didattica.link[i]);
//
//                             break;
//           case 'iscrizioni':
//                             bot.sendMessage(msg.chat.id, "Titolo: " + iscrizioni.titolo + " e link diretto: " + iscrizioni.diretto);
//                             for(var i = 0; i < iscrizioni.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + iscrizioni.link[i]);
//
//                             break;
//           case 'orientamento':
//                             bot.sendMessage(msg.chat.id, "Titolo: " + orientamento.titolo + " e link diretto: " + orientamento.diretto);
//                             for(var i = 0; i < orientamento.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + orientamento.link[i]);
//
//                             break;
//           case 'agevolazioni':
//                             bot.sendMessage(msg.chat.id, "Titolo: " + agevolazioni.titolo + " e link diretto: " + agevolazioni.diretto);
//                             for(var i = 0; i < agevolazioni.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + agevolazioni.link[i]);
//
//                             break;
//           case 'servizi':
//                             bot.sendMessage(msg.chat.id, "Titolo: " + servizi.titolo + " e link diretto: " + servizi.diretto);
//                             for(var i = 0; i < servizi.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + servizi.link[i]);
//
//                             break;
//           case 'ateneo':
//                             bot.sendMessage(msg.chat.id, "Titolo: " + ateneo.titolo + " e link diretto: " + ateneo.diretto);
//                             for(var i = 0; i < ateneo.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + ateneo.link[i]);
//
//                             break;
//           case "international":
//                             bot.sendMessage(msg.chat.id, "Titolo: " + international.titolo + " e link diretto: " + international.diretto);
//                             for(var i = 0; i < international.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + international.link[i]);
//
//                             break;
//           case "studio":
//                             bot.sendMessage(msg.chat.id, "Titolo: " + nonSoloStudio.titolo + " e link diretto: " + nonSoloStudio.diretto);
//                             for(var i = 0; i < nonSoloStudio.link.length; i++)
//                               bot.sendMessage(msg.chat.id, "Link " + i + ": " + nonSoloStudio.link[i]);
//
//                             break;
//           default: break;
//         }
//
//         console.log("COMPLETED");
//       });
//     })
//     .catch((err) => {console.log(err); });
// }
//
// function controlAssign(title, link, bot, msg, node, $){
//
//   console.log(title.toLowerCase());
//   switch(title.toLowerCase()){
//     case 'didattica':
//                       if(didattica.titolo == ""){
//                         didattica.titolo = title;
//                       }
//                       if(link.length != 0 && didattica.diretto.length == 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         didattica.diretto = link;
//                       }
//
//                       if(didattica.link.length == 0){
//                         node.siblings().children("li").children("a").each(function(){
//                           var ref = $(this).attr('href');
//                           if(!ref.includes('http')){
//                             ref = 'www.unitn.it' + ref;
//                           }
//                           didattica.link.push(ref)
//                         });
//                       }
//
//                       break;
//
//     case 'iscrizioni':
//                       if(iscrizioni.titolo == ""){
//                         iscrizioni.titolo = title;
//                       }
//                       if(link.length != 0 && iscrizioni.diretto.length == 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         iscrizioni.diretto = link;
//                       }
//
//                       if(iscrizioni.link.length == 0){
//                         node.siblings().children("li").children("a").each(function(){
//                           var ref = $(this).attr('href');
//                           if(!ref.includes('http')){
//                             ref = 'www.unitn.it' + ref;
//                           }
//                           iscrizioni.link.push(ref)
//                         });
//                       }
//
//                       break;
//
//     case 'orientamento':
//                       if(orientamento.titolo == ""){
//                         orientamento.titolo = title;
//                       }
//                       if(link.length != 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         orientamento.diretto = link;
//                       }
//
//                       node.siblings().children("li").children("a").each(function(){
//                         var ref = $(this).attr('href');
//                         if(!ref.includes('http')){
//                           ref = 'www.unitn.it' + ref;
//                         }
//                         orientamento.link.push(ref)
//                       });
//
//                       break;
//
//     case 'agevolazioni':
//                       if(agevolazioni.titolo == ""){
//                         agevolazioni.titolo = title;
//                       }
//                       if(link.length != 0 && agevolazioni.diretto.length == 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         agevolazioni.diretto = link;
//                       }
//
//                       if(agevolazioni.link.length == 0){
//                         node.siblings().children("li").children("a").each(function(){
//                           var ref = $(this).attr('href');
//                           if(!ref.includes('http')){
//                             ref = 'www.unitn.it' + ref;
//                           }
//                           agevolazioni.link.push(ref)
//                         });
//                       }
//
//                       break;
//
//     case 'servizi':
//                       if(servizi.titolo == ""){
//                         servizi.titolo = title;
//                       }
//                       if(link.length != 0 && servizi.diretto.length == 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         servizi.diretto = link;
//                       }
//
//                       if(servizi.link.length == 0){
//                         node.siblings().children("li").children("a").each(function(){
//                           var ref = $(this).attr('href');
//                           if(!ref.includes('http')){
//                             ref = 'www.unitn.it' + ref;
//                           }
//                           servizi.link.push(ref)
//                         });
//                       }
//
//                       break;
//
//     case 'l\'ateneo':
//                       if(ateneo.titolo == ""){
//                         ateneo.titolo = title;
//                       }
//                       if(link.length != 0 && ateneo.diretto.length == 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         ateneo.diretto = link;
//                       }
//
//                       if(ateneo.link.length == 0){
//                         node.siblings().children("li").children("a").each(function(){
//                           var ref = $(this).attr('href');
//                           if(!ref.includes('http')){
//                             ref = 'www.unitn.it' + ref;
//                           }
//                           ateneo.link.push(ref)
//                         });
//                       }
//
//                       break;
//
//     case 'prospective international student':
//                       if(international.titolo == ""){
//                         international.titolo = title;
//                       }
//                       if(link.length != 0 && international.diretto.length == 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         international.diretto = link;
//                       }
//
//                       if(international.link.length == 0){
//                         node.siblings().children("li").children("a").each(function(){
//                           var ref = $(this).attr('href');
//                           if(!ref.includes('http')){
//                             ref = 'www.unitn.it' + ref;
//                           }
//                           international.link.push(ref)
//                         });
//                       }
//
//                       break;
//
//     case 'non solo studio':
//                       if(nonSoloStudio.titolo == ""){
//                         nonSoloStudio.titolo = title;
//                       }
//                       if(link.length != 0 && nonSoloStudio.diretto.length == 0){
//                         if(!link.includes('http')){
//                           link = 'www.unitn.it' + link;
//                         }
//                         nonSoloStudio.diretto = link;
//                       }
//
//                       if(nonSoloStudio.link.length == 0){
//                         node.siblings().children("li").children("a").each(function(){
//                           var ref = $(this).attr('href');
//                           if(!ref.includes('http')){
//                             ref = 'www.unitn.it' + ref;
//                           }
//                           nonSoloStudio.link.push(ref)
//                         });
//                       }
//
//                       break;
//   }
// }
//
// // ---------- HOW TO END -------------


// ---------- EXPORTS ----------
exports.richiestaFile = downloadFiles;
exports.richiestaFotoMensa = downloadPhoto;
exports.distanceBetween = getDistance;