<<<<<<< HEAD

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
=======
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
>>>>>>> develop
}

exports.luoghiUtili = function(req, resp) {
	//Messaggio per il log
	console.log("é stata richiesta la funzione per ottenere i luoghi utili!");

	resp.writeHead(200, {"Content-Type": "application/json"});

	var name = req.query.name;
	var place = req.query.place;

<<<<<<< HEAD
	var type
	var citta;

	switch (place) {
		case "trento":
=======
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
>>>>>>> develop
			citta = {lat: 46.0702531, lng: 11.1216386};
			console.log("Citta trento");
			break;
		case "mesiano":
<<<<<<< HEAD
=======
			latlngKnown = 0;
>>>>>>> develop
			citta = {lat: 46.0659393, lng: 11.1395838};
			console.log("Citta mesiano");
			break;
		case "povo":
<<<<<<< HEAD
=======
			latlngKnown = 0;
>>>>>>> develop
			citta = {lat: 46.066294, lng: 11.153842};
			console.log("Citta povo");
			break;
		case "oltrecastello":
<<<<<<< HEAD
			citta = {lat: 46.0659393, lng: 11.1395838};
			console.log("Citta oltrecastello");
			break;
		case "specific":
			citta={lat: req.query.lat, lng: req.query.lng};
			console.log("Posizione specifica");
			break;
		default:
			citta = {lat: 46.0702531, lng: 11.1216386};
=======
			latlngKnown = 0;
			citta = {lat: 46.0659393, lng: 11.1395838};
			console.log("Citta oltrecastello");
			break;
		default:
			latlngKnown = 1;
			citta=place;
>>>>>>> develop
			console.log("Citta default");
			break;
	}

<<<<<<< HEAD
	var map = require('@google/maps').createClient({
		key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU'
	});

=======
>>>>>>> develop
	var json;

	switch (name) {
		case "biblioteca":
			console.log("Name biblioteca");
			type="library";

<<<<<<< HEAD
			placesNearby(resp,map,citta,750,type,name);
=======
			placesNearby(resp,map,citta,1000,type,name,latlngKnown,geocoder);
>>>>>>> develop

			break;
		case "copisteria":
			console.log("Name copisteria");
			type="store";

<<<<<<< HEAD
			placesNearby(resp,map,citta,750,type,name);
=======
			placesNearby(resp,map,citta,1000,type,name,latlngKnown,geocoder);
>>>>>>> develop

			break;
		case "mensa":
			console.log("Name mensa");
			type="restaurant";
			if(place == "trento"){
				name="mensa opera universitaria";
<<<<<<< HEAD
				placesNearby(resp,map,citta,750,type,name);
			}
			else if(place == "mesiano" || place=="povo"){
				name="mensa opera universitaria";
				placesNearby(resp,map,citta,300,"",name);
			}
			else{
				name = "mensa";
				placesNearby(resp,map,citta,750,type,name);
=======
				placesNearby(resp,map,citta,750,type,name,latlngKnown,geocoder);
			}
			else if(place == "mesiano" || place=="povo"){
				name="mensa opera universitaria";
				placesNearby(resp,map,citta,300,"",name,latlngKnown,geocoder);
			}
			else{
				name = "mensa";
				placesNearby(resp,map,citta,750,type,name,latlngKnown,geocoder);
>>>>>>> develop
			}

			break;
		case "facolta":
			console.log("Name facolta");
			type="university";

			if(place == "povo" || place == "mesiano"){
				name="dipartimento";

<<<<<<< HEAD
				placesNearby(resp,map,citta,400,"",name);
			}
			else{
				name="Univeristà";
				placesNearby(resp,map,citta,750,type,name);
=======
				placesNearby(resp,map,citta,400,"",name,latlngKnown,geocoder);
			}
			else{
				name="Univeristà";
				placesNearby(resp,map,citta,1000,type,name,latlngKnown,geocoder);
>>>>>>> develop
			}

			break;
		default:

			console.log("Name default");
<<<<<<< HEAD
			name="errore";

			json = JSON.stringify({
				response: "Formatting error"
			})
			resp.end(json);
=======
			placesNearby(resp,map,citta,1000,"",name,latlngKnown,geocoder);
>>>>>>> develop

			break;
	}
};
