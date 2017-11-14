var reload;

$(document).ready(function() {
	document.getElementById("chatCard").style.height = ($( window ).height() - 30) + "px";
	document.getElementById("chat").style.height = ($( window ).height() - 40) + "px";
	reload = function() {
        location.reload();
    }
});

$( window ).resize(function() {
	document.getElementById("chatCard").style.height = ($( window ).height() - 30) + "px";
	document.getElementById("chat").style.height = ($( window ).height() - 40) + "px";
});
