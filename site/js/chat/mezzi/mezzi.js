var mezzi;

mezzi = function(rotta,fase,documento)
{
	var url="https://unitnhelpbot.herokuapp.com/";
	url += rotta;

    if(fase != ""){
        url += "?fase=" + fase;
    }

	$.getJSON(url, function(data) {
		var myJSON = JSON.stringify(data);
		parent.twonav(documento,data);
	});
}
