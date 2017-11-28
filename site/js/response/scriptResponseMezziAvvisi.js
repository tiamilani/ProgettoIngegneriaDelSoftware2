$(document).ready(function() {
	var results = parent.myJSON;
	var testo = results.Ask;
	var listaAvvisi = results.Choices;

	var avvisi = "<h2>"+testo+"</h2>";
	for (var i = 0; i < listaAvvisi.length; i++) {
		avvisi += "<div class=\"col-md-12\"><h3>"+listaAvvisi[i].route_short_name+"</h3><p>"+listaAvvisi[i].route_long_name+"</p><hr></div>";
	}

	$(avvisi).appendTo('#rowAvvisi');
});
