var NodeGeocoder = require('node-geocoder');

function placesNearby (map, city, range, type, nome, latlngKnown, geocoder) {
	return new Promise((resolve, reject) => {
		if(latlngKnown == 0){
			map.placesNearby({
					location: city,
					radius: range,
					language: "it",
					type: type,
					name: nome
				})
				.asPromise()
				.then((response) => {
					var json = JSON.stringify({
						response: response.json.results,
						place: city
					})
					return resolve(json);
				})
				.catch((err) => {
					return reject(err);
				});
		} else {
			geocoder.geocode(city, function(err, res) {
			  	var lati = res[0].latitude;
				var long = res[0].longitude;

				map.placesNearby({
						location: {lat: lati, lng: long},
						radius: range,
						language: "it",
						type: type,
						name: nome
					})
					.asPromise()
					.then((response) => {
						var json = JSON.stringify({
							response: response.json.results,
							place: {lat: lati, lng: long}
						})
						return resolve(json);
					})
					.catch((err) => {
						return reject(err);
					});
			});
		}
	});
}

exports.luoghiUtili = function(req, resp) {
	return new Promise((resolve, reject) => {

		var name = req.query.name;
		var place = req.query.place;

		if(place == null || place == undefined || place == ""){
			resp.status(404).send('Not found');
			return resolve("Richiesta non gestibile");
		}

		resp.writeHead(200, {"Content-Type": "application/json"});

		var type;
		var citta;


		var map = require('@google/maps').createClient({
			key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU',
			Promise: Promise
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
				break;
			case "mesiano":
				latlngKnown = 0;
				citta = {lat: 46.0659393, lng: 11.1395838};
				break;
			case "povo":
				latlngKnown = 0;
				citta = {lat: 46.066294, lng: 11.153842};
				break;
			default:
				latlngKnown = 1;
				citta=place;
				break;
		}

		switch (name) {
			case "biblioteca":
				type="library";
				placesNearby(map,citta,1000,type,name,latlngKnown,geocoder)
					.then((json) => {
						resp.end(json);
						return resolve("OK");
					})
					.catch((err) => {
						resp.status(404).send('Not found');
						return resolve(err);
					});
				break;
			case "copisteria":
				type="store";
				placesNearby(map,citta,1000,type,name,latlngKnown,geocoder)
					.then((json) => {
						resp.end(json);
						return resolve("OK");
					})
					.catch((err) => {
						resp.status(404).send('Not found');
						return resolve(err);
					});
				break;
			case "mensa":
				type="restaurant";
				if(place == "trento"){
					name="mensa opera universitaria";
					placesNearby(map,citta,750,type,name,latlngKnown,geocoder)
						.then((json) => {
							resp.end(json);
							return resolve("OK");
						})
						.catch((err) => {
							resp.status(404).send('Not found');
							return resolve(err);
						});
				}
				else if(place == "mesiano" || place=="povo"){
					name="mensa opera universitaria";
					placesNearby(map,citta,300,"",name,latlngKnown,geocoder)
						.then((json) => {
							resp.end(json);
							return resolve("OK");
						})
						.catch((err) => {
							resp.status(404).send('Not found');
							return resolve(err);
						});
				}
				else{
					name = "mensa";
					placesNearby(map,citta,750,type,name,latlngKnown,geocoder)
						.then((json) => {
							resp.end(json);
							return resolve("OK");
						})
						.catch((err) => {
							resp.status(404).send('Not found');
							return resolve(err);
						});
				}

				break;
			case "facolta":
				type="university";

				if(place == "povo" || place == "mesiano"){
					name="dipartimento";
					placesNearby(map,citta,400,"",name,latlngKnown,geocoder)
						.then((json) => {
							resp.end(json);
							return resolve("OK");
						})
						.catch((err) => {
							resp.status(404).send('Not found');
							return resolve(err);
						});
				}
				else{
					name="Univeristà";
					placesNearby(map,citta,1000,type,name,latlngKnown,geocoder)
						.then((json) => {
							resp.end(json);
							return resolve("OK");
						})
						.catch((err) => {
							resp.status(404).send('Not found');
							return resolve(err);
						});
				}

				break;
			default:
				placesNearby(map,citta,1000,"",name,latlngKnown,geocoder)
					.then((json) => {
						resp.end(json);
						return resolve("OK");
					})
					.catch((err) => {
						resp.status(404).send('Not found');
						return resolve(err);
					});

				break;
		}
	});
};

exports.placesNearby = placesNearby;
