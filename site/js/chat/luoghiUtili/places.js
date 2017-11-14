var places;
var url="https://botingse2.herokuapp.com/localizza?";

$(document).ready(function() {
	places = function(name, place)
    {
		url += "name=" + name + "&";
		url += "place=" + place;
		$.getJSON(url, function(data) {
			var myJSON = JSON.stringify(data);
			parent.twonav(0,data);
		});
    }
});
