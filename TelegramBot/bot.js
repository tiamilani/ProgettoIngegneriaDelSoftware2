// ---------- REQUIRE ----------
const http = require ('http');
const TelegramBot = require('node-telegram-bot-api');
const fun = require('./functions.js');
console.log('REQUIRE FATTI');
// ---------- BOT CONFIG ----------
// replace the value below with the Telegram token you receive from @BotFather
const token = '477082505:AAGtG4_xRltfUzhNluQnX_U4-y4oghxYQPk';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
console.log('BOT STARTED');
// ---------- FEATURES ----------

//Questi sono tutti eventi

//Se riceve testo
bot.on('text', (msg) => { //Salva il testo 'text' in msg
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
                one_time_keyboard: true,  //Quando clicchi la tastiera una volta, poi si nasconde
                resize_keyboard: true
            })
        };

        //Metodo del bot che invia un messaggio: richiede idChat, testo, [lista di bottoni]
        bot.sendMessage(msg.chat.id, text, keyboard);
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

    //Invia posizione, richiede id, lat, lon, testo
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


/* --- 2017-10-31 ---*/

//bot.onText(/\/IngegneriaAmbientaleCivileMeccanica/, (msg) =>
bot.onText(/DICAM/, (msg) =>
{
  fun.richiestaAvvisi("DICAM", bot, msg);
});

//bot.onText(/\/IngegneriaCivile/, (msg) =>
bot.onText(/DII/, (msg) =>
{
  fun.richiestaAvvisi("DII", bot, msg);
});

//bot.onText(/\/Fisica_Matematica_IngegneriaScienzeInformazione/, (msg) =>
bot.onText(/CISCA/, (msg) =>
{
  fun.richiestaAvvisi("CISCA", bot, msg);
});


bot.onText(/Avvisi/, (msg) =>
{
  var text = "In questa sezione puoi ottenere gli avvisi del giorno dei vari dipartimenti";
  var keyboard =
  {
    reply_markup: JSON.stringify(
      {
        keyboard: [
          //['/IngegneriaAmbientaleCivileMeccanica'],
          //['/IngegneriaCivile'],
          //['/Fisica_Matematica_IngegneriaScienzeInformazione']
          ['DICAM'],
          ['DII'],
          ['CISCA']
        ],
        one_time_keyboard: true, resize_keyboard: true
      })
  };

  bot.sendMessage(msg.chat.id, text, keyboard);
});

bot.onText(/\/start/, (msg) => {
	console.log('START RICEVUTO');
	const chatId = msg.chat.id;
    //Creazione dei bottoni. È gestito come una matrice
    var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['Avvisi'],
				['Mezzi'],
				['Mensa'],
				['OperaUniTN']
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    };

    bot.sendMessage(msg.chat.id, "Benvenuto!\nSeleziona un\'opzione per cominciare", keyboard);
});
