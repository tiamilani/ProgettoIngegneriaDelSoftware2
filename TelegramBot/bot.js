// ---------- REQUIRE ----------
const fun = require ('./functions.js');
const how = require('./howto.js');
const http = require ('http');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const dw = require('website-scraper');
const ch = require('cheerio');
const similar = require('string-similarity');

const keywords = ['home', 'howto', 'ammissioni', 'immatricolazioni', 'borse di studio', 'tasse universitarie', 'supporto', 'libera circolazione', 'trasferimenti',
                  'open day', 'rinnovo iscrizioni', 'futuro studente', 'didattica', 'orientamento', 'iscrizioni', 'agevolazioni', 'ateneo', 'servizi',
                  'non solo studio', 'prospective international student', 'ammissioni lauree e lauree magistrali a ciclo unico', 'ammissioni lauree magistrali',
                  'immatricolazioni lauree e lauree magistrali a ciclo unico', 'immatricolazioni lauree magistrali', 'pagamenti', 'rimborsi', 'tasse a.a. 17-18',
                  'isee a.a. 17-18', 'borse di studio e posto alloggio', 'dichiarazione di invalidità o disabilità', 'attesa di laurea', 'trasferimento verso un altro ateneo',
                  'trasferimento da un altro ateneo', 'trasferimento da un altro ateneo laurea magistrale', 'rinnovo iscrizione con pagamento tasse',
                  'rinnovo iscrizione con richiesta di borsa di studio', 'rinnovo iscrizione studenti con bisogni particolari'];

// ---------- BOT CONFIG ----------

const TOKEN = process.env.TELEGRAM_TOKEN || '417759810:AAFHuTH4figL2WqKsEGem0ZIggf6zbonV80';
const options = {
    webHook: {
        port: process.env.PORT || 443
    }
};
const url = process.env.APP_URL || 'https://botingse2.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);
console.log('BOT STARTED');

// ---------- FEATURES ----------

bot.on('text', (msg) => {
    //bot.sendMessage(msg.chat.id, msg.text.toLowerCase());
    if (msg.text.toLowerCase().includes("giulia") || msg.text.toLowerCase().includes("ilaria") || msg.text.toLowerCase().includes("virginia")) {
        bot.sendMessage(msg.chat.id, "Ti Amo <3");
    }
    else if(msg.text.toLowerCase() === "se2")
    {
        var text = "In questa sezione puoi ottenere il menu e visualizzare le telecamere delle mense";
    	var keyboard = {
            reply_markup: JSON.stringify({
                keyboard: [
    				['/Povo1_PastoLesto', '/Povo1_PastoCompleto'],
    				['/Mesiano_1', '/Mesiano_2'],
    				['/Tommaso_Gar', '/Menu_Mensa'],
    				['/Nearest', '/Imposta_Promemoria_Mensa']
                ],
                one_time_keyboard: true,
                resize_keyboard: true
            })
        };

        bot.sendMessage(msg.chat.id, text, keyboard);
    }
});

bot.on('text', (msg) => {
  // -- SEZIONE HOW TO --
  else if(msg.text.toLowerCase() == "howto"){
      var text = "In questa sezione puoi ottenere le informazioni sul corretto svolgimento delle diverse pratiche legate all'Università";
      var keyboard = {
          reply_markup: JSON.stringify({
              keyboard: [
                ['Ammissioni', 'Immatricolazioni'],
                ['Tasse Universitarie', 'Borse di studio'],
                ['Trasferimenti', 'Supporto'],
                ['Libera Circolazione', 'Open Day'],
                ['Rinnovo Iscrizioni', 'Futuro Studente'],
              ],
              one_time_keyboard: true,
              resize_keyboard: true
          })
      };
      console.log("HOW TO");
      bot.sendMessage(msg.chat.id, text, keyboard);

  }else if(msg.text.toLowerCase() == "tasse universitarie"){
      var text = "Qui puoi trovare tutte le informazioni sulle tasse che ti possono interessare. Seleziona un argomento da sotto";
      var keyboard = {
          reply_markup: JSON.stringify({
              keyboard: [
                  ['Tasse A.A. 17-18', 'ISEE A.A. 17-18'],
                  ['Pagamenti', 'Rimborsi'],
              ],
              one_time_keyboard: true,
              resize_keyboard: true
          })
      };
      console.log("TASSE UNIVERSITARIE");
      how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'init');
      bot.sendMessage(msg.chat.id, text, keyboard);

  }else if(msg.text.toLowerCase() == "rimborsi"){
    how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'rimborsi');
  }else if(msg.text.toLowerCase() == "pagamenti"){
    how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'pagamenti');
  }else if(msg.text.toLowerCase() == "tasse a.a. 17-18"){
    how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'tasse');
  }else if(msg.text.toLowerCase() == "isee a.a. 17-18"){
    how.homeTasse('https://infostudenti.unitn.it/it/tasse-universitarie', './Tasse_Home', bot, msg, 'isee');
  }else if(msg.text.toLowerCase() == "ammissioni"){

    var text = "Qui puoi trovare tutte e le informazioni sulle ammissioni ai corsi di laurea che ti possono interessare";
    var keyboard = {
      reply_markup: JSON.stringify({
        keyboard: [
            ['Ammissioni Lauree e Lauree Magistrali a ciclo unico'],
            ['Ammissioni Lauree Magistrali']
        ],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    };
    console.log("AMMISSIONI");
    how.homeAmmissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', bot, msg, 'init');
    bot.sendMessage(msg.chat.id, text, keyboard);
  }else if(msg.text.toLowerCase() == 'ammissioni lauree e lauree magistrali a ciclo unico'){
    how.homeAmmissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', bot, msg, 'ammissioni_triennali');
  }else if(msg.text.toLowerCase() == 'ammissioni lauree magistrali'){
    how.homeAmmissioni('https://infostudenti.unitn.it/it/ammissioni', './Ammissioni_Home', bot, msg, 'ammissioni_magistrali');
  }else if(msg.text.toLowerCase() == "immatricolazioni"){

    var text = "Qui puoi trovare tutte e le informazioni sulle immatricolazioni ai corsi di laurea che ti possono interessare";
    var keyboard = {
      reply_markup: JSON.stringify({
        keyboard: [
            ['Immatricolazioni Lauree e Lauree Magistrali a ciclo unico'],
            ['Immatricolazioni Lauree Magistrali']
        ],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    };
    console.log("IMMATRICOLAZIONI");
    how.homeImmatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', bot, msg, 'init');
    bot.sendMessage(msg.chat.id, text, keyboard);
  }else if(msg.text.toLowerCase() == 'immatricolazioni lauree e lauree magistrali a ciclo unico'){
    how.homeImmatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', bot, msg, 'immatricolazioni_triennali');
  }else if(msg.text.toLowerCase() == 'immatricolazioni lauree magistrali'){
    how.homeImmatricolazioni('https://infostudenti.unitn.it/it/immatricolazioni', './Immatricolazioni_Home', bot, msg, 'immatricolazioni_magistrali');
  }else if(msg.text.toLowerCase() == "rinnovo iscrizioni"){

    var text = "Qui puoi trovare tutte e le informazioni sui rinnovi delle iscrizioni ai corsi di laurea";
    var keyboard = {
      reply_markup: JSON.stringify({
        keyboard: [
            ['Rinnovo iscrizione con pagamento tasse'],
            ['Rinnovo iscrizione con richiesta borsa di studio'],
            ['Rinnovo iscrizione studenti con bisogni particolari']
        ],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    };
    console.log("RINNOVI");
    how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'init');
    bot.sendMessage(msg.chat.id, text, keyboard);
  }else if(msg.text.toLowerCase() == 'rinnovo iscrizione con pagamento tasse'){
    how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'rinnovi_tasse');
  }else if(msg.text.toLowerCase() == 'rinnovo iscrizione con richiesta borsa di studio'){
    how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'rinnovi_borsa');
  }else if(msg.text.toLowerCase() == 'rinnovo iscrizione studenti con bisogni particolari'){
    how.homeRinnovi('https://infostudenti.unitn.it/it/rinnovo-iscrizioni', './Rinnovi_Home', bot, msg, 'rinnovi_particolari');
  }else if(msg.text.toLowerCase() == 'borse di studio'){

    var text = "Qui puoi trovare tutte le informazioni sulle borse di studio e le agevolazioni fornite dall'Università";
    var keyboard = {
      reply_markup: JSON.stringify({
        keyboard: [
            ['Borse di studio e Posto alloggio'],
            ['Dichiarazione di invalidità o disabilità'],
            ['Attesa di Laurea', 'Libera circolazione']
        ],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    };
    console.log("BORSE");
    how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'init');
    bot.sendMessage(msg.chat.id, text, keyboard);
  }else if(msg.text.toLowerCase() == 'borse di studio e posto alloggio'){
    how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'borse_alloggi');
  }else if(msg.text.toLowerCase() == 'dichiarazione di invalidità o disabilità'){
    how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'bisogni_particolari');
  }else if(msg.text.toLowerCase() == 'attesa di laurea'){
    how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'attesa_laurea');
  }else if(msg.text.toLowerCase() == 'libera circolazione'){
    how.homeBorse('https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', './Borse_Home', bot, msg, 'libera_circolazione');
  }else if(msg.text.toLowerCase() == 'trasferimenti'){

    var text = "Qui puoi trovare tutte le informazioni riguardanti le modalità e i requisiti per i trasferimenti da e verso UniTrento";
    var keyboard = {
      reply_markup: JSON.stringify({
        keyboard: [
            ['Trasferimento verso un altro ateneo'],
            ['Trasferimento da un altro ateno'],
            ['Trasferimento da un altro ateneo Laurea Magistrale']
        ],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    };
    console.log("TRASFERIMENTI");
    how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'init');
    bot.sendMessage(msg.chat.id, text, keyboard);
  }else if(msg.text.toLowerCase() == 'trasferimento verso un altro ateneo'){
    how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Traferimenti_Home', bot, msg, 'trasferimenti_verso');
  }else if(msg.text.toLowerCase() == 'trasferimento da un altro ateneo laurea magistrale'){
    how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'trasferimenti_da_magistrale');
  }else if(msg.text.toLowerCase() == 'trasferimento da un altro ateno'){
    how.homeTrasferimenti('https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', './Trasferimenti_Home', bot, msg, 'trasferimenti_da_triennale');
  }else if(msg.text.toLowerCase() == 'supporto'){
    console.log("SUPPORTO");
    how.homeSupporto('https://infostudenti.unitn.it/it/supporto-studenti', './Supporto_Home', bot, msg, 'init');
  }else if(msg.text.toLowerCase() == 'open day'){
    console.log("OPEN DAY");
    how.homeOpenDay('http://events.unitn.it/porteaperte-2017', './OpenDay_Home', bot, msg, 'init');
  }else if(msg.text.toLowerCase() == 'futuro studente'){

    var text = "Sei un futuro studente UNITN o vorresti diventarlo? Non riesci ad orientarti nelle varie pagine del sito e non trovi quello che ti serve?" +
              " Questa sezione è proprio quello che stai cercando! Seleziona uno degli argomenti qui sotto!";
    var keyboard = {
      reply_markup: JSON.stringify({
        keyboard: [
            ['Didattica', 'Iscrizioni'],
            ['Orientamento', 'Agevolazioni'],
            ['Servizi', 'Ateneo'],
            ['Prospective International Student'],
            ['Non solo studio']
        ],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    };

    console.log("FUTURO STUDENTE");
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'init');
    bot.sendMessage(msg.chat.id, text, keyboard);
  }else if(msg.text.toLowerCase() == 'didattica'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'didattica');
  }else if(msg.text.toLowerCase() == 'iscrizioni'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'iscrizioni');
  }else if(msg.text.toLowerCase() == 'orientamento'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'orientamento');
  }else if(msg.text.toLowerCase() == 'agevolazioni'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'agevolazioni');
  }else if(msg.text.toLowerCase() == 'servizi'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'servizi');
  }else if(msg.text.toLowerCase() == 'ateneo'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'ateneo');
  }else if(msg.text.toLowerCase() == 'prospective international student'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'international');
  }else if(msg.text.toLowerCase() == 'non solo studio'){
    how.homeFuturoStudente('http://www.unitn.it/futuro-studente', './Futuro_Studente', bot, msg, 'studio');
  }else if(msg.text.toLowerCase() == 'home'){
    var text = "Eccoti di nuovo nel menù principale!";
    var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
        ['/Mezzi', 'HowTo'],
        ['/Mensa'],
        ['/OperaUniTN']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);
  }else{
    var matches = similar.findBestMatch(msg.text.toLowerCase(), keywords);
    bot.sendMessage(msg.chat.id, "Non ho trovato il comando desiderato. Forse intendevi " + matches.bestMatch.target + "?");
  }
});


bot.on('location', (msg) => {
    console.log("IN");
    // Povo1_1 - Povo1_2 - Mesiano1 - Mesiano2 - TommasoGar
    var mense = [[46.066917, 11.150173], [46.066917, 11.150173], [46.066202, 11.139990], [46.064463, 11.138816], [46.066946, 11.117216]];
    var myPos = [msg.location.latitude, msg.location.longitude];

    let i;
    let nM;
    let min = 9999999;
    let tmp;
    for (i = 0; i < mense.length; i++)
    {
        tmp = fun.distanceBetween(myPos, mense[i]);
        if(tmp < min)
        {
            min = tmp;
            nM = i;
        }
    }

    console.log("INVIO");

    var text;
    switch(nM) {
        case 0: text = "La mensa attualmente più vicina è:\nPovo1_PastoLesto"; break;
        case 1: text = "La mensa attualmente più vicina è:\nPovo1_PastoCompleto"; break;
        case 2: text = "La mensa attualmente più vicina è:\nMesiano1"; break;
        case 3: text = "La mensa attualmente più vicina è:\nMesiano2"; break;
        case 4: text = "La mensa attualmente più vicina è:\nTommaso_Gar"; break;
    }

    bot.sendVenue(msg.chat.id, (mense[nM])[0], (mense[nM])[1], text);
});

bot.onText(/\/Bandi_BdS/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/borse-di-studio', './Bandi_BdS', bot, msg);
});

bot.onText(/\/Graduatorie_BdS/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/borse-di-studio/graduatorie', './Graduatorie_BdS', bot, msg);
});

bot.onText(/\/Bandi_150O/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/150-ore/bandi', './Bandi_150O', bot, msg);
});

bot.onText(/\/Graduatorie_15O/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/150-ore/graduatorie', './Graduatorie_15O', bot, msg);
});

bot.onText(/\/Menu_Mensa/, (msg) => {
	var text = "Attendi un attimo...";
	bot.sendMessage(msg.chat.id, text);

	fun.richiestaFile('http://www.operauni.tn.it/servizi/ristorazione/menu', './Menu_Mensa', bot, msg);
});

bot.onText(/\/Imposta_Promemoria_Bandi/, (msg) => {
	setTimeout(function () {
		bot.sendMessage(msg.chat.id, "Hai impostato un promemoria 10 minuti fa!");
	}, 600 * 1000);
});

bot.onText(/\/Povo1_PastoLesto/, (msg) => {
    bot.sendPhoto(msg.chat.id, "./WebcamMense/Povo02.jpg", {caption : "Mensa Pasto Completo di Povo1"} );

    /*var options = { method: "HEAD", host: "ftp.tn.ymir.eu", port: 80, path: "/Povo01.jpg" };
	var request = http.request ( options, function ( response ) {
    	if(response.statusCode === 200)
			bot.sendPhoto(msg.chat.id, "http://ftp.tn.ymir.eu/Povo01.jpg", {caption : "Mensa Pasto Lesto di Povo1"} );
		else
			bot.sendMessage(msg.chat.id, "Sembra che la videocamera abbia qualcosa che non va...");
	});

	request.end();*/
});

bot.onText(/\/Povo1_PastoCompleto/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/Povo02.jpg", {caption : "Mensa Pasto Completo di Povo1"} );
});

bot.onText(/\/Mesiano_1/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/mesiano01.jpg", {caption : "Mensa di Mesiano"} );
});

bot.onText(/\/Mesiano_2/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/mesiano02.jpg", {caption : "Mensa di Mesiano"} );
});

bot.onText(/\/Tommaso_Gar/, (msg) => {
	bot.sendPhoto(msg.chat.id, "./WebcamMense/tgar.jpg", {caption : "Mensa di Tommaso Gar"} );
});

bot.onText(/\/Imposta_Promemoria_Mensa/, (msg) => {
	setTimeout(function () {
		bot.sendMessage(msg.chat.id, "Hai impostato un promemoria 10 minuti fa!");
	}, 600 * 1000);
});

/*bot.onText(/\/Bus/, (msg) => {
    bot.sendMessage(msg.chat.id, "TO DO...");
});*/

bot.onText(/\/Imposta_Promemoria_Mezzi/, (msg) => {
	setTimeout(function () {
		bot.sendMessage(msg.chat.id, "Hai impostato un promemoria 10 minuti fa!");
	}, 600 * 1000);
});

bot.onText(/\/Nearest/, (msg) => {
    var text = "Ora ti indicherò quale mensa è più vicina a te... Inizia con l'inviarmi la tua posizione!";
    var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
    			[ { text: 'Invia Posizione', request_location: true } ]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);
});

bot.onText(/\/Mezzi/, (msg) => {
    /*var text = "In questa sezione puoi ottenere informazioni riguardanti i mezzi di trasporto";
	var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
				['/Bus'],
				['/Treno'],
                ['/Imposta_Promemoria_Mezzi']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);*/

    bot.sendMessage(msg.chat.id, "TO DO...");
});

bot.onText(/\/Mensa/, (msg) => {
    fun.richiestaFotoMensa('http://www.operauni.tn.it/servizi/ristorazione/webcam', './WebcamMense', ['Povo01.jpg', 'Povo02.jpg', 'mesiano01.jpg', 'mesiano02.jpg', 'tgar.jpg']);

    bot.sendMessage(msg.chat.id, "Per questioni legali puoi vedere le webcam solo se inserisci la password:");
});

bot.onText(/\/OperaUniTN/, (msg) => {
    var text = "In questa sezione puoi ottenere i vari documenti:\nBdS -> Borse di Studio\n150O -> Servizio 150 Ore";
	var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
				['/Bandi_BdS', '/Graduatorie_BdS'],
				['/Bandi_150O', '/Graduatorie_15O'],
				['/Imposta_Promemoria_Bandi']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);
});

bot.onText(/\/start/, (msg) => {
    var text = "Benvenuto " + msg.from.first_name + "!\nUniTN Help Center è un bot sviluppato per aiutare attuali e/o futuri studenti dell'Università degli Studi di Trento in vari ambiti della propria vita quotidiana";

    var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
				['/Mezzi', 'HowTo'],
				['/Mensa'],
				['/OperaUniTN']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, text, keyboard);
});
