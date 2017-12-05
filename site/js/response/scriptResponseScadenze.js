$(document).ready(function() {
	var results = parent.myJSON;
	var ask = results['Ask'];
	$('#description').append(ask);

	var lista = results['Choices'];
	var scadenze = "";
	for (var i = 0; i < lista.length; i++) {
        if(lista[i]['DataInizio'] != undefined)
            scadenze += "<div class=\"col-md-12\"><p>"+lista[i]['Argomento']+"</p><p></i> Dal <b>" + lista[i]['DataInizio'] + "</b> fino al <b>"+lista[i]['DataFine']+"</b></p><hr></div>";
        else
		      scadenze += "<div class=\"col-md-12\"><p></i> "+lista[i]['Argomento']+"</p><p></i> Fino al <b>"+lista[i]['DataFine']+"</b></p><hr></div>";
	}

	$(scadenze).appendTo('#rowScadenze');
});
