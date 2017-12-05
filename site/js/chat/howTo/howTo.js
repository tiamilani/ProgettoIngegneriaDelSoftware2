var howTo;
var howToOpenDay;

howTo = function(section,sub,detail)
{
	var url="https://unitnhelpbot.herokuapp.com/howto?section=";
	url += section;
    if(sub != ""){
        url += "&sub=";
        url += sub;
    }
    if(detail != ""){
        url += "&detail="
        url += detail;
    }

	console.log("URL: " + url);

	$.getJSON(url, function(data) {
		var myJSON = JSON.stringify(data);
		parent.twonav(2,data);
	});
}

howToOpenDay = function(section)
{
	var url="https://unitnhelpbot.herokuapp.com/howto?section=";
	url += section;
	console.log("URL: " + url);

	$.getJSON(url, function(data) {
		var myJSON = JSON.stringify(data);
		parent.twonav(3,data);
	});
}
