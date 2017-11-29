const httpMocks = require('node-mocks-http');
const place = require('./../api/controllers/places.js');
const NodeGeocoder = require('node-geocoder');
var map = undefined;

const trento = {lat: 46.0702531, lng: 11.1216386};
const latlngUnKnow = 0;
const latlngKnow = 1;

const typeLibrary = "library";

const nameBiblioteca = "biblioteca";

const trentoBiblio = 'http://unitnhelpbot.herokuapp.com/localizza?name=biblioteca&place=trento'
const trentoCopisteria = 'http://unitnhelpbot.herokuapp.com/localizza?name=copisteria&place=trento'
const trentoMensa = 'http://unitnhelpbot.herokuapp.com/localizza?name=mensa&place=trento'
const trentoFacolta = 'http://unitnhelpbot.herokuapp.com/localizza?name=facolta&place=trento'

const mesianoBiblio = 'http://unitnhelpbot.herokuapp.com/localizza?name=biblioteca&place=mesiano'
const mesianoCopisteria = 'http://unitnhelpbot.herokuapp.com/localizza?name=copisteria&place=mesiano'
const mesianoMensa = 'http://unitnhelpbot.herokuapp.com/localizza?name=mensa&place=mesiano'
const mesianoFacolta = 'http://unitnhelpbot.herokuapp.com/localizza?name=facolta&place=mesiano'

const povoBiblio = 'http://unitnhelpbot.herokuapp.com/localizza?name=biblioteca&place=povo'
const povoCopisteria = 'http://unitnhelpbot.herokuapp.com/localizza?name=copisteria&place=povo'
const povoMensa = 'http://unitnhelpbot.herokuapp.com/localizza?name=mensa&place=povo'
const povoFacolta = 'http://unitnhelpbot.herokuapp.com/localizza?name=facolta&place=povo'

const bassanoBiblio = 'http://unitnhelpbot.herokuapp.com/localizza?name=biblioteca&place=bassano'
const bassanoLibreria = 'http://unitnhelpbot.herokuapp.com/localizza?name=libreria&place=bassano'

const nameVuoto = 'http://unitnhelpbot.herokuapp.com/localizza?name=&place=trento'
const placeVuoto = 'http://unitnhelpbot.herokuapp.com/localizza?name=biblioteca&place='
const nameEPlaceVuoti = 'http://unitnhelpbot.herokuapp.com/localizza?name=&place='

const nameNullo = 'http://unitnhelpbot.herokuapp.com/localizza?place=trento'
const placeNullo = 'http://unitnhelpbot.herokuapp.com/localizza?name=biblioteca'
const nameEPlaceNulli = 'http://unitnhelpbot.herokuapp.com/localizza'

describe('Controllo della correttezza di placesNearby con le biblioteche', () => {
    beforeAll(() => {
        map = require('@google/maps').createClient({
    		key: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU',
    		Promise: Promise
    	});

        var options = {
    	  provider: 'google',

    	  // Optional depending on the providers
    	  httpAdapter: 'https', // Default
    	  apiKey: 'AIzaSyA_rBZuYeP8ONgMXRnIOpO0t0XWtod08lU', // for Mapquest, OpenCage, Google Premier
    	  formatter: null         // 'gpx', 'string', ...
    	};
        geocoder = NodeGeocoder(options);
    });

    test('Test che la lista di biblioteche a trento contenga \"Biblioteca Comunale di Trento\"', () => {
        expect.assertions(1);
        return place.placesNearby(map,trento,1000,typeLibrary,nameBiblioteca,latlngUnKnow,geocoder).then(data => {
            const parsedData = JSON.parse(data);
            var vet =[];

            for(var i=0; i<parsedData['response'].length; i++)
                vet.push(parsedData['response'][i]['geometry']);

            expect(vet).toContainEqual(expect.objectContaining({"location": {"lat": 46.0697938, "lng": 11.1208752}, "viewport": {"northeast": {"lat": 46.07108943029149, "lng": 11.1222373802915}, "southwest": {"lat": 46.06839146970849, "lng": 11.1195394197085}}}));
        });
    });

    test('Test che la lista di biblioteche a trento contenga \"Biblioteca dell\'Ufficio Beni Archeologici\"', () => {
        expect.assertions(1);
        return place.placesNearby(map,trento,1000,typeLibrary,nameBiblioteca,latlngUnKnow,geocoder).then(data => {
            const parsedData = JSON.parse(data);
            var vet =[];

            for(var i=0; i<parsedData['response'].length; i++)
                vet.push(parsedData['response'][i]['geometry']);

            expect(vet).toContainEqual(expect.objectContaining({"location": {"lat": 46.0720086,"lng": 11.1259138},"viewport": {"northeast": {"lat": 46.0733192302915,"lng": 11.1272289802915},"southwest": {"lat": 46.0706212697085,"lng": 11.1245310197085}}}));
        });
    });

    test('Test che il place ottenuto dalla richiesta di biblioteche a trento sia corretto', () =>{
        expect.assertions(1);
        return place.placesNearby(map,trento,1000,typeLibrary,nameBiblioteca,latlngUnKnow,geocoder).then(data => {
            const parsedData = JSON.parse(data);

            expect(parsedData['place']).toEqual(trento);
        });
    });

    test('Test che venga restituita la lista di biblioteche a trento anche se latlngKnow è settata a 1, controllo contenga \"Biblioteca Comunale di Trento\" e \"Biblioteca dell\'Ufficio Beni Archeologici\"', () =>{
        expect.assertions(2);
        return place.placesNearby(map,"Trento TN",1000,typeLibrary,nameBiblioteca,latlngKnow,geocoder).then(data => {
            const parsedData = JSON.parse(data);
            var vet =[];

            for(var i=0; i<parsedData['response'].length; i++)
                vet.push(parsedData['response'][i]['geometry']);

            expect(vet).toContainEqual(expect.objectContaining({"location": {"lat": 46.0697938, "lng": 11.1208752}, "viewport": {"northeast": {"lat": 46.07108943029149, "lng": 11.1222373802915}, "southwest": {"lat": 46.06839146970849, "lng": 11.1195394197085}}}));
            expect(vet).toContainEqual(expect.objectContaining({"location": {"lat": 46.0720086,"lng": 11.1259138},"viewport": {"northeast": {"lat": 46.0733192302915,"lng": 11.1272289802915},"southwest": {"lat": 46.0706212697085,"lng": 11.1245310197085}}}));
        });
    });

    test('Test che venga restituita la lista di biblioteche di un\'altra città (Bassano) che non sia tra quelle pre-settate, \"Biblioteca Civica e Archivio\"', () =>{
        expect.assertions(1);
        return place.placesNearby(map,"Bassano",1000,typeLibrary,nameBiblioteca,latlngKnow,geocoder).then(data => {
            const parsedData = JSON.parse(data);
            var vet =[];

            for(var i=0; i<parsedData['response'].length; i++)
                vet.push(parsedData['response'][i]['geometry']);

            expect(vet).toContainEqual(expect.objectContaining({"location": {"lat": 45.765896, "lng": 11.735995}, "viewport": {"northeast": {"lat": 45.7672715302915, "lng": 11.7373303802915}, "southwest": {"lat": 45.7645735697085, "lng": 11.7346324197085}}}));
        });
    });
});

describe('Test funzione luoghiUtili', () => {
    test('Controllo che la richiesta di biblioteche a trento vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: trentoBiblio
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di copisteria a trento vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: trentoCopisteria
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di mensa a trento vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: trentoMensa
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di facolta a trento vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: trentoFacolta
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });

    test('Controllo che la richiesta di biblioteche a mesiano vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: mesianoBiblio
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di copisteria a mesiano vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: mesianoCopisteria
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di mensa a mesiano vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: mesianoMensa
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di facolta a mesiano vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: mesianoFacolta
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });

    test('Controllo che la richiesta di biblioteche a povo vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: povoBiblio
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di copisteria a povo vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: povoCopisteria
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di mensa a povo vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: povoMensa
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di facolta a povo vada buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: povoFacolta
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });

    test('Controllo che la richiesta di una città scelta dall\'utente con un name NON specifico vada a buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: bassanoBiblio
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta di una città scelta dall\'utente con un name specifico vada a buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: bassanoLibreria
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });

    test('Controllo che la richiesta con name vuoto vada a buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: nameVuoto
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta con place vuoto venga gestita correttamente e dia errore', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: placeVuoto
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('Richiesta non gestibile');
    });
    test('Controllo che la richiesta con name e place vuoti venga gestita correttamente e dia errore', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: nameEPlaceVuoti
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('Richiesta non gestibile');
    });

    test('Controllo che la richiesta con name non inserito vada a buon fine', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: nameNullo
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('OK');
    });
    test('Controllo che la richiesta con place non inserito venga gestita correttamente e dia errore', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: placeNullo
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('Richiesta non gestibile');
    });
    test('Controllo che la richiesta con name e place non inseriti venga gestita correttamente e dia errore', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: nameEPlaceNulli
        });

        const response = httpMocks.createResponse();

        expect.assertions(1);
        return expect(place.luoghiUtili(request, response)).resolves.toBe('Richiesta non gestibile');
    });
});
