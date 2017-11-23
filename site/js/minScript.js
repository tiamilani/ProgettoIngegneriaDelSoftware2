$(document).ready(function() {
	$("#container").css("padding-top", $(".navbar-fixed-top").height());
});

$( window ).resize(function() {
	$("#container").css("padding-top", $(".navbar-fixed-top").height());
});
