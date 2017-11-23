var NodeGeocoder = require('node-geocoder');

function placesNearby (resp, map, city, range, type, nome, latlngKnown, geocoder) {
	if(latlngKnown == 0){
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
						response: response.json.results,
						place: city
					})
					resp.end(json);
				}
			}
		);
	} else {
		geocoder.geocode(city, function(err, res) {
		  	var lati = res[0].latitude;
			var long = res[0].longitude;

			map.placesNearby(
				{
					location: {lat: lati, lng: long},
					radius: range,
					language: "it",
					type: type,
					name: nome
				},
				function(err, response){
					if (!err) {
						//console.log(response.json);
						var json = JSON.stringify({
							response: response.json.results,
							place: city
						})
						resp.end(json);
					}
				}
			);
		});
	}
}

exports.luoghiUtili = function(req, resp) {
	//Messaggio per il log
	console.log("é stata richiesta la funzione per ottenere i luoghi utili!");

	resp.writeHead(200, {"Content-Type": "application/json"});

	var name = req.query.name;
	var place = req.query.place;
	var type;
	var citta;


	var map = require('@google/maps').createClient({
		key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU'
	});

	var options = {
	  provider: 'google',

	  // Optional depending on the providers
	  httpAdapter: 'https', // Default
	  apiKey: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU', // for Mapquest, OpenCage, Google Premier
	  formatter: null         // 'gpx', 'string', ...
	};

	var geocoder = NodeGeocoder(options);
	var latlngKnown = 0;

	switch (place) {
		case "trento":
			latlngKnown = 0;
			citta = {lat: 46.0702531, lng: 11.1216386};
			console.log("Citta trento");
			break;
		case "mesiano":
			latlngKnown = 0;
			citta = {lat: 46.0659393, lng: 11.1395838};
			console.log("Citta mesiano");
			break;
		case "povo":
			latlngKnown = 0;
			citta = {lat: 46.066294, lng: 11.153842};
			console.log("Citta povo");
			break;
		case "oltrecastello":
			latlngKnown = 0;
			citta = {lat: 46.0659393, lng: 11.1395838};
			console.log("Citta oltrecastello");
			break;
		default:
			latlngKnown = 1;
			citta=place;
			console.log("Citta default");
			break;
	}

	switch (name) {
		case "biblioteca":
			console.log("Name biblioteca");
			type="library";
			placesNearby(resp,map,citta,1000,type,name,latlngKnown,geocoder);
			break;
		case "copisteria":
			console.log("Name copisteria");
			type="store";
			placesNearby(resp,map,citta,1000,type,name,latlngKnown,geocoder);
			break;
		case "mensa":
			console.log("Name mensa");
			type="restaurant";
			if(place == "trento"){
				name="mensa opera universitaria";
				placesNearby(resp,map,citta,750,type,name,latlngKnown,geocoder);
			}
			else if(place == "mesiano" || place=="povo"){
				name="mensa opera universitaria";
				placesNearby(resp,map,citta,300,"",name,latlngKnown,geocoder);
			}
			else{
				name = "mensa";
				placesNearby(resp,map,citta,750,type,name,latlngKnown,geocoder);
			}

			break;
		case "facolta":
			console.log("Name facolta");
			type="university";

			if(place == "povo" || place == "mesiano"){
				name="dipartimento";
				placesNearby(resp,map,citta,400,"",name,latlngKnown,geocoder);
			}
			else{
				name="Univeristà";
				placesNearby(resp,map,citta,1000,type,name,latlngKnown,geocoder);
			}

			break;
		default:

			console.log("Name default");
			placesNearby(resp,map,citta,1000,"",name,latlngKnown,geocoder);

			break;
	}
};
