$(document).ready(function() {
	var results = parent.myJSON;
	var explain = results.explain;
    var link = results.link;
    var section = results.section;
	var subsection = results.subsection;

    $('#title').append(section);

    var explanation = "<div class=\"col-md-12\"><h2>"+subsection+"</h2><p>"+explain+"</p><hr></div>";
    $(explanation).appendTo('#rowHowTo');

	console.log("Link inserito: " + link);
	$("#linkPagina").prop("href", "http://" + link);
});
