var links = [
    'site/page/luoghiUtili.html',
	'site/page/avvisi.html',
    'site/page/howTo.html',
    'site/page/howToOpenDay.html',
    'site/page/mezzi/fermata.html',
    'site/page/mezzi/linea.html',
    'site/page/mezzi/next.html',
    'site/page/mezzi/avvisi.html',
    'site/page/mezzi/tariffe.html',
    'site/page/scadenze.html'
];

var one, two;
var myJSON = undefined;
var responseFunction = undefined;

$(document).ready(function() {
	one = document.getElementById('iframeChat');
  	two = document.getElementById('iframeResponse');

	$("#container-fluid").css("margin-top", $(".navbar-fixed-top").height());
    $("#container-fluid2").css("margin-top", $(".navbar-fixed-top").height());
	document.getElementById("iframeChat").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height())+ "px";
	document.getElementById("iframeResponse").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height() - 30) + "px";
});

$( window ).resize(function() {
	$("#container-fluid").css("margin-top", $(".navbar-fixed-top").height());
    $("#container-fluid2").css("margin-top", $(".navbar-fixed-top").height());
  document.getElementById("iframeChat").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height()) + "px";
  document.getElementById("iframeResponse").style.height = ($( window ).height()-$(".navbar-fixed-top").height()-$(".footer-fixed-bottom").height() - 30) + "px";
});

function twonav(idx,json) {
	myJSON = json;
    two.src=links[idx];
}
