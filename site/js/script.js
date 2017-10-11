$(document).ready(function() {
	$("#trigger").click(function() {
		$.getJSON($("#url").val(), function(data) {
    		//data is the JSON string
			var myJSON = JSON.stringify(data);
			$("#demo").html(myJSON);
		});
    });
});
