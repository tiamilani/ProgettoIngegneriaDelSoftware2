const httpMocks = require('node-mocks-http');
const urban = require('./../api/controllers/scadenze.js');
const db = require('./../TelegramBot/sectionDevelop.js');

var databaseConnection = undefined;

beforeAll(() => {
	console.log("inizio");
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
	return db.initiateConnection(databaseConnection).then((con) => { databaseConnection = con; });
});

describe('Scadenze', () => {
	test('Scadenze value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/scadenze'
		});
		const response = httpMocks.createResponse();
	 	urban.mostraScadenze(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Scadenze value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/scadenze'
		});
		const response = httpMocks.createResponse();
	 	urban.mostraScadenze(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Scadenze value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/scadenze'
		});
		const response = httpMocks.createResponse();
	 	urban.mostraScadenze(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Scadenze value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/scadenze'
		});
		const response = httpMocks.createResponse();
	 	urban.mostraScadenze(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Scadenze value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/scadenzee'
		});
		const response = httpMocks.createResponse();
	 	urban.mostraScadenze(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Scadenze value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/scadenzee'
		});
		const response = httpMocks.createResponse();
	 	urban.mostraScadenze(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Scadenze value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/scadenzee'
		});
		const response = httpMocks.createResponse();
	 	urban.mostraScadenze(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});
});


afterAll(() => {
  console.log("fine");
  done();
});
