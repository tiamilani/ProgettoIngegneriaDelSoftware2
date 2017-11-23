$(document).ready(function() {
	var results = parent.myJSON;
	var days = results.days;
    var programs = results.programs;
    var registration = results.registration;

	var giorni = "";
	for (var i = 0; i < listaAvvisi.length; i++) {
		giorni += "<div class=\"col-md-12\"><p>"+days[i]+"</p><hr></div>";
	}

	$(giorni).appendTo('#rowHowTo');

	$("#programma").prop("href", programs);
	$("#registration").prop("href", registration);
});
