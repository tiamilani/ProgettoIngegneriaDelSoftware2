'use strict';

exports.function = function(req, response) {
	console.log("Request handler function was called.");
	response.writeHead(200, {"Content-Type": "application/json"});
	var otherArray = ["item1", "item2"];
	var otherObject = { item1: "ciao come stai qui tutt", item2: "item2val" };
	var json = JSON.stringify({
	anObject: otherObject,
	anArray: otherArray,
	another: "item"
	});
	response.end(json);

	//res.json(task);
};
