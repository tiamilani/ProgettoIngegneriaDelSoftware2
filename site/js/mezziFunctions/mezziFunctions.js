var showResult;
var presentazioneVettore;
var presentazioneSingolo;

function toDate(dStr, format) {
	var now = new Date();
	if (format == "h:m:s") {
        var arrSplit = dStr.split(":");
 		now.setHours(arrSplit[0]);
 		now.setMinutes(arrSplit[1]);
 		now.setSeconds(arrSplit[2]);
 		return now;
	}else
		return "Invalid Format";
}

presentazioneSingolo = function(object){
    var result = "<div class=\"col-md-3 alignColumn\">"
        + "<h3 class=\"getPMargin\"><i class=\"em em-bus\"></i>  " + object['route_short_name'] + "</h3>"
        + "<p><i class=\"em em-arrow_right\"></i></i> Direzione: " + object['trip_headsign'] + "</p>"
        + "</div>"
        + "<div class=\"col-md-3 alignColumn\">"
        + "<p><i class=\"em em-busstop\"></i> Fermata: " + object['stop_name'] + "</p>";
    if(object['departure_time'] === object['arrival_time'])
        result += "<p><i class=\"em em-clock2\"></i> " + object['arrival_time'] + "</p>";
    else{
        var t2 = toDate(object['arrival_time'], "h:m:s");
        var t1 = toDate(object['departure_time'], "h:m:s")

        let diff = parseInt((t1-t2)/(60*1000));
        result += "<p><i class=\"em em-clock2\"></i> " + object['arrival_time'] + " partirà dopo "+ diff +" minuti</p>";
    }
    result += "</div>"
        + "<div class=\"col-md-4 alignColumn\">"
        + "<p><i class=\"em em-wheelchair\"></i> ";

    switch(parseInt(object['wheelchair_boarding'])) {
        case 0:
            result += "Non so se la fermata è attrezzata";
            break;
        case 1:
            result += "Fermata attrezzata ma non per tutti i mezzi";
            break;
        case 2:
            result += "Fermata non attrezzata";
            break;
    }

    result += "</p><p><i class=\"em em-wheelchair\"></i> "

    switch(parseInt(object['wheelchair_accessible'])) {
        case 0:
            result += "Non so se il veicolo è attrezzato";
            break;
        case 1:
            result += "Veicolo attrezzato, al massimo 1 passeggero";
            break;
        case 2:
            result += "Veicolo non attrezzato";
            break;
    }

    result += "</p></div>"
        + "<div class=\"col-md-2 alignColumn\">"
        + "<a class=\"btn btn-primary\" href=\"https://www.google.com/maps/dir/?api=1&destination=" + object['stop_lat'] + "," + object['stop_lon'] + "\" target=\"_blank\">Come ci arrivo?</a>"
        + "</div>";
    return result;
}

presentazioneVettore = function(choices,rowName) {
    var vettore = choices;
    var result = "";

	if(vettore == undefined) {
		result += "<div class=\"row rowStops\"><div class=\"col-md-12\"><h2>Mi dispiace ma non ho trovato alcuna corsa disponibile <i class=\"em em-cry\"></i></h2></div><hr></div>"
		$('#'+rowName+'').html(result);
		return;
	}

    for (var i = 0; i < vettore.length; i++) {
        result += "<div class=\"row rowStops\">";
		result += presentazioneSingolo(vettore[i]);
        result += "<hr></div>";
	}

	$('#'+rowName+'').html(result);
}

showResult = function(rotta,fase,name,rowName)
{
	var url="https://unitnhelpbot.herokuapp.com/";
	url += rotta;

    if(fase != ""){
        url += "?fase=" + fase;
    }
    if(name != ""){
        url += "&name=" + name
    }

	$.getJSON(url, function(data) {
        presentazioneVettore(data['Choices'],rowName);
	});
}
