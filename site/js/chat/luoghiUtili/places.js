var places;

places = function(name, place)
{
	var url="https://botingse2.herokuapp.com/localizza?";
	url += "name=" + name + "&";
	url += "place=" + place;
	console.log("url: " + url);
	$.getJSON(url, function(data) {
		var myJSON = JSON.stringify(data);
		parent.twonav(0,data);
	});
}
