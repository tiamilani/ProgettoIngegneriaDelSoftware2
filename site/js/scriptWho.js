$(document).ready(function() {
	$("#ciao").css("margin-top", $(".navbar-fixed-top").height() + 10);
});

$( window ).resize(function() {
	$("#ciao").css("margin-top", $(".navbar-fixed-top").height() + 10);
});

$(document).ready(function() {
	$("#mappa").css("margin-bottom", $(".footer-fixed-bottom").height() + 10);
});

$( window ).resize(function() {
	$("#mappa").css("margin-bottom", $(".footer-fixed-bottom").height() + 10);
});
