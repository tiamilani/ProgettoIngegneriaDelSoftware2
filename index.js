var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

app.use(function(req, res, next) {
	console.log('Something is happening.');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	if (req.method === 'Options') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        return res.status(200).json({});
    }
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/Routes'); //importing route

routes(app); //register the route

/*
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'Options') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});*/

app.listen(port);

const bot = require('./TelegramBot/bot');

console.log('todo list RESTful API server started on: ' + port);


/*var express = require('express');
const TelegramBotClient = require('telegram-bot-client');
const client = new TelegramBotClient(process.env.TELEGRAM_TOKEN);

module.exports = client;

const app = express();
const randomstring = require('randomstring');
const WEBHOOK_TOKEN = randomstring.generate(16);

console.log('LOG: ' + __filename);

client.setWebhook(`https://botingse2.herokuapp.com:443/${WEBHOOK_TOKEN}`);
var bot = require('./TelegramBot/bot.js');
app.use(`/${WEBHOOK_TOKEN}`, bot);*/


//const bot = require('./TelegramBot/bot');

/*
//Libraries
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);

//const url = process.env.APP_URL
//const TOKEN = process.env.TELEGRAM_TOKEN

//app.use(`/${TOKEN}`, require('./TelegramBot/bot')),

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});*/
//create a server
/*var server = http.createServer(
    function (req, res) {
        //HTML head (type of the page)
        //res.writeHead(200, {'Content-Type': 'text/plain'});
		//res.end('hello world!');


		response.writeHead(301,
		  {Location: 'http://whateverhostthiswillbe:8675/'+newRoom}
		);
		response.end();


		res.redirect('/home/mattia/Documenti/Universita/Corsi/3Anno/1Semestre/IngegneriaDelSoftware2/Progetto/ProgettoIngegneriaDelSoftware2/index.html');

    }
);*/

//listen in a specific port
//server.listen(process.env.PORT || 12000);

//check status
//console.log('Server listening on port 12000');
/*
const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const app = express();
>>>>>>> 6372169... .

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/Routes'); //importing route

routes(app); //register the route

/*
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'Options') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});*/

app.listen(port);

const bot = require('./TelegramBot/bot');

console.log('todo list RESTful API server started on: ' + port);
