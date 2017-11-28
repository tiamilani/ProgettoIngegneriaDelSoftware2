$(document).ready(function() {
	var results = parent.myJSON;
	var days = results.programs.date;
    var registration = results.registration;

	var giorni = "";
	for (var i = 0; i < days.length; i++) {
		giorni += "<div class=\"col-md-12\">"
				+ "<p>"+days[i].data+"</p>"
		if(days[i].link != "")
			giorni += "<a class=\"btn btn-primary\" href=\""+days[i].link+"\" target=\"_blank\">Programa</a>";

		giorni += "<hr></div>";
	}

	$(giorni).appendTo('#rowHowTo');
	$("#registration").prop("href", registration);
});
