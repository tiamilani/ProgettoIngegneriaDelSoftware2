//$(document).ready(function() {

	var map;
	var infowindow;

	var city = {lat: parent.myJSON.place.lat, lng: parent.myJSON.place.lng};

	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
		  center: city,
		  zoom: 16
		});

		infowindow = new google.maps.InfoWindow();

		function createMarker(place) {
			var placeLoc = place.geometry.location;
			var marker = new google.maps.Marker({
				map: map,
				animation: google.maps.Animation.DROP,
				position: place.geometry.location
			});

			google.maps.event.addListener(marker, 'click', function() {
				var stato;
				if(place.opening_hours != undefined){
					if(place.opening_hours.open_now == true)
						stato = 'aperto';
					else
						stato = 'chiuso';
				} else {
					stato = 'Non so se aperto o chiuso :(';
				}

				var valutazione;
				if(place.rating != undefined){
					valutazione = place.rating + '/5';
				} else {
					valutazione = 'Non ha ancora una valutazione';
				}

				var contentString = '<div id="content">'+
							'<div id="siteNotice">'+
							'</div>'+
							'<h2 id="firstHeading" class="firstHeading">'+place.name+'</h2>'+
							'<div id="bodyContent">'+
							'<p>Si trova nei pressi di: ' + place.vicinity + '</p>'+
							'<p>Ora &egrave;: '+ stato + '</p>' +
							'<p>Valutazione: ' + valutazione + '</p>'+
							'<p><a href="https://www.google.com/maps/dir/?api=1&destination='+place.geometry.location.lat+','+place.geometry.location.lng+'" target="_blank">Apri su google maps</a>'+
							'</div>'+
							'</div>';

				infowindow.setContent(contentString);
				infowindow.open(map, this);
			});
		}

		var results = parent.myJSON.response;
		for (var i = 0; i < results.length; i++) {
		  createMarker(results[i]);
	  	}
	}
//});
