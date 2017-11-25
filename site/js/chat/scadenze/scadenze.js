var scadenza;

scadenza = function()
{
	var url="https://unitnhelpbot.herokuapp.com/scadenze";

	$.getJSON(url, function(data) {
		parent.twonav(9,data);
	});
}
