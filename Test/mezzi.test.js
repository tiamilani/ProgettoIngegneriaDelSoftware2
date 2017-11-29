const httpMocks = require('node-mocks-http');
const urban = require('./../api/controllers/mezzi.js');
const db = require('./../TelegramBot/sectionDevelop.js');

var databaseConnection = undefined;

// npm test -- mezzi.test.js --forceExit --silent

beforeAll(() => {
	console.log("inizio");
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
	return db.initiateConnection(databaseConnection).then((con) => { databaseConnection = con; });
});

describe('createHome', () => {
	test('createHome return home keyboard', () => {
		expect(db.createHome()).not.toEqual([]);
		expect(db.createHome()).toBeDefined();
	});
});


describe('Fermata_F1', () => {
	test('Fermata_F1 value Ask is defined', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});

	test('Fermata_F1 value contain ASK', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeCalledWith(
					expect.objectContaining({
						Ask: expect.any(String)
					}),
				);
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});

	test('Fermata_F1 value Choices contains Oltrecastello', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeCalledWith(
					expect.objectContaining({
						Choices: expect.arrayContaining('Oltrecastello')
					}),
				);
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});



});

describe('Fermata_F2', () => {
	test('Fermata_F2 value Ask is defined', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});

	test('Fermata_F2 value contain ASK', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeCalledWith(
					expect.objectContaining({
						Ask: expect.any(String)
					}),
				);
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});

	test('Fermata_F2 value contains nameT', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeCalledWith(
					expect.objectContaining({
						nameT: expect.any(String)
					}),
				);
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});

	test('Fermata_F2 value Choices contains 5', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeCalledWith(
					expect.objectContaining({
						Choices: expect.arrayContaining('5')
					}),
				);
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});
});

describe('Fermata_F3', () => {
	test('Fermata_F3 value Ask is undefined', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=3&nameT=fermata_Oltrecastello&name=5'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeUndefined();
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});

	test('Fermata_F3 value Choices is defined', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});

		const response = httpMocks.createResponse();

	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeCalledWith(
					expect.objectContaining({
						Choices: expect.any(Array)
					}),
				);
			})
			.catch((err) => {
				const property = JSON.parse(response._getData());

				expect(property).toBeDefined();
			})
	});
});

afterAll(() => {
  console.log("fine");
  done();
});
