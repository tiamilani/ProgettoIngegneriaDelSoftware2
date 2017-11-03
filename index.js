const bot = require('./TelegramBot/bot');

//Libraries
var http = require('http');

//create a server
var server = http.createServer(
    function (req, res) {
        //HTML head (type of the page)
        res.writeHead(200, {'Content-Type': 'text/plain'});

        //HTML content
        res.end('Hello World');
    }
);

//listen in a specific port
server.listen(process.env.PORT || 80);

//check status
console.log('Server listening on port '+process.env.PORT);
/*
const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/position', function (req, res) {
    //write response
    res.write('Risposta di una funzione in index.js');
	alert(sum);
    //send response
    res.end();
});

app.listen((process.env.PORT || 12050));

console.log('Server running at http://localhost:12050/');*/
