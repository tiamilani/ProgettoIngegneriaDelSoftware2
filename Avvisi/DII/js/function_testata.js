<!--

function fPre(sImg,sSrc) {

				//############ fPre:  Funzione per il precaricamento delle immagini  ###########
				//  sImg : Stringa con nome immagine (ID dell'html) 
				//  sSrc : nome e percorso dell'immagine 
				//##############################################################################

	        if (document.images) {
        	       eval(sImg + ' = new Image()')
	              eval(sImg + '.src = "' + sSrc + '"')
        	load=true}
	}

//CARICA LE IMMAGINI DEL MENU
	
	fPre("testata_1", dominio + "images/testata/ita_on.gif")
	fPre("testata_2", dominio + "images/testata/eng_on.gif")
	fPre("testata_3", dominio + "images/testata/home_on.gif")
	fPre("testata_4", dominio + "images/testata/search_on.gif")
	fPre("testata_5", dominio + "images/testata/map_on.gif")
	fPre("testata_6", dominio + "images/testata/people_on.gif")
	

function ON_testata(N_testata) {
	if (document.images && load) {

		if(N_testata==1)	document.testata1.src = eval("testata_" + N_testata + ".src");
		if(N_testata==2)	document.testata2.src = eval("testata_" + N_testata + ".src");
		if(N_testata==3)	document.testata3.src = eval("testata_" + N_testata + ".src");
		if(N_testata==4)	document.testata4.src = eval("testata_" + N_testata + ".src");
		if(N_testata==5)	document.testata5.src = eval("testata_" + N_testata + ".src");
		if(N_testata==6)	document.testata6.src = eval("testata_" + N_testata + ".src");
	}
}

function OFF_testata(N_testata) {
	if (document.images && load) {

		if(N_testata==1)	document.testata1.src =  dominio + "images/testata/ita_off.gif";
		if(N_testata==2)	document.testata2.src =  dominio + "images/testata/eng_off.gif";
		if(N_testata==3)	document.testata3.src =  dominio + "images/testata/home_off.gif";
		if(N_testata==4)	document.testata4.src =  dominio + "images/testata/search_off.gif";
		if(N_testata==5)	document.testata5.src =  dominio + "images/testata/map_off.gif";
		if(N_testata==6)	document.testata6.src =  dominio + "images/testata/people_off.gif";
	}
}


function ON_dx(N_dx) {
	if (document.images && load) {

		if(N_dx==2)	document.dx2.src = eval("dx_" + N_dx + ".src");
	}
}


// -->
