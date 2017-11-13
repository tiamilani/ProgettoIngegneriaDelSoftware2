'use strict';
const fun = require('../../TelegramBot/functions.js');


exports.function = function(req, response) {
	var par = req.query.ciao;
	console.log("Request handler list_all_tasks was called.");
	response.writeHead(200, {"Content-Type": "application/json"});
	var otherArray = ["item1", "item2"];
	var otherObject = { item1: "ciao come stai qui tutt", item2: "item2val" };
	var json = JSON.stringify({
	anObject: otherObject,
	anArray: otherArray,
	another: "item",
	parameterURL: par
	});
	response.end(json);

	//res.json(task);
};


/*---2017-10-31---*/
exports.dwAvvisi = function(request, response)
{
	var dipartimentoRichiesto = request.query.dipartimento;

	//console.log("Request handler list_all_tasks was called.");
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});

	try
	{
		Promise.all([fun.richiestaAvvisi(dipartimentoRichiesto, null, null)]).then(values =>
		{
			var json = JSON.stringify
			({
				dipartimento: dipartimentoRichiesto,
				avvisiDelGiorno: values
			});

			response.end(json);
		});
	}
	catch (err) { console.log(err.message); }
};
