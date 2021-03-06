function section4(rotta,fase,nameT,name){
    var url="https://unitnhelpbot.herokuapp.com/";
	url += rotta;

    if(fase != ""){
        url += "?fase=" + fase;
    }
    if(nameT != ""){
        url += "&nameT=" + nameT;
    }
    if(name != ""){
        url += "&name=" + name
    }

	$.getJSON(url, function(data) {
        presentazioneVettore(data['Choices'],"searchResults");
	});
}

function presentazioneTerzaScelta(nameT,ask,Choices) {
    $("#name3").show();

    $('#ask3').text(ask);

    var options = {
    	data: Choices,
        placeholder: "Fermata partenza",
        list: {
		    maxNumberOfElements: 10,
    		match: {
    			enabled: true
    		},
            onChooseEvent: function() {
                var name = $("#name3").getSelectedItemData();
                section4("linea","4",nameT,name);
		    }
	    },
        theme: "bootstrap"

    };

    $("#name3").easyAutocomplete(options);
}

function section3(rotta,fase,nameT,name){
    var url="https://unitnhelpbot.herokuapp.com/";
	url += rotta;

    if(fase != ""){
        url += "?fase=" + fase;
    }
    if(nameT != ""){
        url += "&nameT=" + nameT;
    }
    if(name != ""){
        url += "&name=" + name
    }

	$.getJSON(url, function(data) {
        presentazioneTerzaScelta(data['nameT'],data['Ask'],data['Choices']);
	});
}

function presentazioneSecondaScelta(nameT,ask,Choices) {
    $("#name2").show();

    $('#ask2').text(ask);

    var options = {
    	data: Choices,
        placeholder: "Direzione",
        list: {
		    maxNumberOfElements: 10,
    		match: {
    			enabled: true
    		},
            onChooseEvent: function() {
                var name = $("#name2").getSelectedItemData();
                section3("linea","3",nameT,name);
		    }
	    },
        theme: "bootstrap"

    };

    $("#name2").easyAutocomplete(options);
}

function section2(rotta,fase,name){
    var url="https://unitnhelpbot.herokuapp.com/";
	url += rotta;

    if(fase != ""){
        url += "?fase=" + fase;
    }
    if(name != ""){
        url += "&name=" + name
    }

	$.getJSON(url, function(data) {
        presentazioneSecondaScelta(data['nameT'],data['Ask'],data['Choices']);
	});
}

$(document).ready(function() {
	var results = parent.myJSON;
	var testo = results.Ask;
	var lista = results.Choices;

    $('#ask1').text(testo);

    var options = {
    	data: lista,
        placeholder: "Linea",
        list: {
		    maxNumberOfElements: 10,
    		match: {
    			enabled: true
    		},
            onChooseEvent: function() {
                var name = $("#name1").getSelectedItemData();
                section2("linea","2",name);
		    }
	    },
        theme: "bootstrap"

    };

    $("#name1").easyAutocomplete(options);
});
