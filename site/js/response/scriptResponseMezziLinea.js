function section2(route,fase,name){
    
}

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
                section2("linea","2",name);
		    }
	    },
        theme: "bootstrap"

    };

    $("#name").easyAutocomplete(options);
});
