var avvisi;

avvisi = function(dipartimento)
{
	var url="https://bot-avvisi.herokuapp.com/avvisi?dipartimento=";
	url += dipartimento;

	$.getJSON(url, function(data) {
		var myJSON = JSON.stringify(data);
		parent.twonav(2,data);
	});
}
