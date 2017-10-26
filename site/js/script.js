var links = [
    'page/response.html'
];

var one, two;
var myJSON = undefined;
var responseFunction = undefined;

$(document).ready(function() {
	one = document.getElementById('iframeChat');
  	two = document.getElementById('iframeResponse');

	$("#container-fluid").css("padding-top", $(".navbar-fixed-top").height());
	document.getElementById("iframeChat").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height())+ "px";
	document.getElementById("iframeResponse").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height() - 30) + "px";
});

$( window ).resize(function() {
	$("#container-fluid").css("padding-top", $(".navbar-fixed-top").height());
  document.getElementById("iframeChat").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height()) + "px";
  document.getElementById("iframeResponse").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height() - 30) + "px";
});

function twonav(idx,json) {
	myJSON = json;
    two.src=links[idx];
}
