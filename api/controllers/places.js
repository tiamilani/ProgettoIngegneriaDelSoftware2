
function placesNearby (resp, map, city, range, type, nome) {
	map.placesNearby(
		{
			location: city,
			radius: range,
			language: "it",
			type: type,
			name: nome
		},
		function(err, response){
			if (!err) {
				//console.log(response.json);
				var json = JSON.stringify({
					response: response.json.results
				})
				resp.end(json);
			}
		}
	);
}

exports.luoghiUtili = function(req, resp) {
	//Messaggio per il log
	console.log("é stata richiesta la funzione per ottenere i luoghi utili!");

	resp.writeHead(200, {"Content-Type": "application/json"});

	var name = req.query.name;
	var place = req.query.place;

	var type
	var citta;

	switch (place) {
		case "trento":
			citta = {lat: 46.0702531, lng: 11.1216386};
			console.log("Citta trento");
			break;
		case "mesiano":
			citta = {lat: 46.0659393, lng: 11.1395838};
			console.log("Citta mesiano");
			break;
		case "povo":
			citta = {lat: 46.066294, lng: 11.153842};
			console.log("Citta povo");
			break;
		case "oltrecastello":
			citta = {lat: 46.0659393, lng: 11.1395838};
			console.log("Citta oltrecastello");
			break;
		case "specific":
			citta={lat: req.query.lat, lng: req.query.lng};
			console.log("Posizione specifica");
			break;
		default:
			citta = {lat: 46.0702531, lng: 11.1216386};
			console.log("Citta default");
			break;
	}

	var map = require('@google/maps').createClient({
		key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU'
	});

	var json;

	switch (name) {
		case "biblioteca":
			console.log("Name biblioteca");
			type="library";

			placesNearby(resp,map,citta,750,type,name);

			break;
		case "copisteria":
			console.log("Name copisteria");
			type="store";

			placesNearby(resp,map,citta,750,type,name);

			break;
		case "mensa":
			console.log("Name mensa");
			type="restaurant";
			if(place == "trento"){
				name="mensa opera universitaria";
				placesNearby(resp,map,citta,750,type,name);
			}
			else if(place == "mesiano" || place=="povo"){
				name="mensa opera universitaria";
				placesNearby(resp,map,citta,300,"",name);
			}
			else{
				name = "mensa";
				placesNearby(resp,map,citta,750,type,name);
			}

			break;
		case "facolta":
			console.log("Name facolta");
			type="university";

			if(place == "povo" || place == "mesiano"){
				name="dipartimento";

				placesNearby(resp,map,citta,400,"",name);
			}
			else{
				name="Univeristà";
				placesNearby(resp,map,citta,750,type,name);
			}

			break;
		default:

			console.log("Name default");
			name="errore";

			json = JSON.stringify({
				response: "Formatting error"
			})
			resp.end(json);

			break;
	}
};
