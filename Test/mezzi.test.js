const httpMocks = require('node-mocks-http');
const urban = require('./../api/controllers/mezzi.js');
const db = require('./../TelegramBot/sectionDevelop.js');

var databaseConnection = undefined;

beforeAll(() => {
	console.log("inizio");
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
	return db.initiateConnection(databaseConnection);
});


test('createHome return home keyboard', () => {
	expect(db.createHome()).not.toEqual([]);
	expect(db.createHome()).toBeDefined();
});


test('Fermata_F1 return Ask value', () => {
	const request = httpMocks.createRequest({
		method: 'GET',
		url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
	});

	const response = httpMocks.createResponse();

 	urban.Fermata(request, response);

	const property = JSON.parse(response._getData());

	expect(property).toBeDefined();
	/*expect(property).toBeCalledWith(
		expect.objectContaining({
			Ask: expect.any(String)
		}),
	);*/
});

afterAll(() => {
  console.log("fine");
});
