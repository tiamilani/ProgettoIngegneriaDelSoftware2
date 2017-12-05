$(document).ready(function() {
	$(".container-body").css("margin-top", $(".navbar-fixed-top").height() + 10);
});

$( window ).resize(function() {
	$(".container-body").css("margin-top", $(".navbar-fixed-top").height() + 10);
});

$(document).ready(function() {
	$("#last").css("margin-bottom", $(".footer-fixed-bottom").height() + 10);
});

$( window ).resize(function() {
	$("#last").css("margin-bottom", $(".footer-fixed-bottom").height() + 10);
});

$(document).ready(function() {
	$(".container-fluid").children("div").children(".col-md-8").css("height", $(".container-fluid").children("div").children(".col-md-4").height());
});

$(document).ready(function() {
	$(".col-md-8").each(function() {
		//console.log("L'altezza del div è " + $(this).outerHeight());
		var pad = calcTopPadding($(this));
		$(this).css("padding-top", pad);
		$(this).css("padding-bottom", pad);
	});
});

$(window).resize(function() {
	$(".col-md-8").each(function() {
		//console.log("L'altezza del div è " + $(this).outerHeight());
		var pad = calcTopPadding($(this));
		$(this).css("padding-top", pad);
		$(this).css("padding-bottom", pad);
	});
});


function calcTopPadding(elem){
	var altezza = 0;

	altezza = altezza + $(elem).children("h2").outerHeight(true);

	$(elem).find("p").each(function(index){
		//console.log("elemento " + index);
		altezza = altezza + $(this).outerHeight(true);
		//console.log(altezza);
	});
	//console.log(altezza);
	/*console.log("Il padding interno dovrebbe essere: " +
							$(elem).outerHeight() + " - " + altezza + " / 2 = " +($(elem).outerHeight() - altezza) / 2);*/

	return ($(elem).outerHeight() - altezza) / 2;
}
