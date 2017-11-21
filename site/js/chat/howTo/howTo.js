var howTo;
var howToopenDay;

howTo = function(section,sub,detail)
{
	var url="https://unitnhelpcenter.herokuapp.com/howto?section=";
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

howToopenDay = function(section)
{
	var url="https://unitnhelpcenter.herokuapp.com/howto?section=";
	url += section;
	console.log("URL: " + url);

	$.getJSON(url, function(data) {
		var myJSON = JSON.stringify(data);
		parent.twonav(3,data);
	});
}
