var avvisi;

avvisi = function(dipartimento)
{
	var url="https://bot-avvisi.herokuapp.com/avvisi?dipartimento=";
	console.log("Ciao, io dovrei fare la richiesta :)");
	url += dipartimento;
	console.log("La richiesta sarà: " + url);

	$.getJSON(url, function(data) {
		console.log("La richiesta è partita");
		var myJSON = JSON.stringify(data);
		parent.twonav(1,data);
	});
}
