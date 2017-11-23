$(document).ready(function() {
	var results = parent.myJSON;
	var explain = results.explain;
    var link = results.link;
    var section = results.section;

    $('#title').append(section);

    var explanation = "<div class=\"col-md-12\"><p>"+explain+"</p><hr></div>";
    $(explanation).appendTo('#rowHowTo');

	$("#linkPagina").prop("href", link);
});
