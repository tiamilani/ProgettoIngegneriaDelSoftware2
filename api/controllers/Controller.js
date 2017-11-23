'use strict';

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
