$(document).ready(function() {
	var results = parent.myJSON;
	var dipartimento = results.dipartimento;
	$('#title').append(dipartimento);

	var urlDipartimento = results.urlDipartimento;
	$("#linkDipartimento").prop("href", urlDipartimento);

	var listaAvvisi = results.avvisiDelGiorno;
	var avvisi = "";
	for (var i = 0; i < listaAvvisi.length; i++) {
		avvisi += "<div class=\"col-md-12\"><p>"+listaAvvisi[i]+"</p><hr></div>";
	}

	$(avvisi).appendTo('#rowAvvisi');
});
