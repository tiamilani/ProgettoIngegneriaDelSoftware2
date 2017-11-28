$(document).ready(function() {
	var results = parent.myJSON;
	var testo = results.Ask;
	var lista = results.Choices;

    $('#ask1').text(testo);

    var options = {
    	data: lista,
        placeholder: "Fermata",
        list: {
		    maxNumberOfElements: 10,
    		match: {
    			enabled: true
    		},
            onChooseEvent: function() {
                var name = $("#name").getSelectedItemData();
                showResult("next","2",name,"searchResults");
		    }
	    },
        theme: "bootstrap"

    };

    $("#name").easyAutocomplete(options);
});
