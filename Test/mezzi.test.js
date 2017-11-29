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
	test('createHome value not be empty', () => {
		expect(db.createHome()).not.toEqual([]);
	});

	test('createHome value is defined', () => {
		expect(db.createHome()).toBeDefined();
	});
});

describe('Fermata_F1', () => {
	test('Fermata_F1 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Fermata_F1 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Fermata_F1 value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Fermata_F1 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Fermata_F1 value contains Choices with Array contains value Oltrecastello on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.arrayContaining(['Oltrecastello']),
					}),
				);
			});
	});

	test('Fermata_F1 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Fermata_F1 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Fermata_F1 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
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

describe('Fermata_F2', () => {
	test('Fermata_F2 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Fermata_F2 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Fermata_F2 value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Fermata_F2 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Fermata_F2 value contains Choices with Array contains value 5 on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.arrayContaining(['5']),
					}),
				);
			});
	});

	test('Fermata_F2 value contain nameT with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						nameT: expect.any(String),
					}),
				);
			});
	});

	test('Fermata_F2 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Fermata_F2 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Fermata_F2 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
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

describe('Fermata_F3', () => {
	test('Fermata_F3 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=3&nameT=fermata_Oltrecastello&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Fermata_F3 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=3&nameT=fermata_Oltrecastello&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Fermata_F3 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=3&nameT=fermata_Oltrecastello&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Fermata_F3 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=3&nameT=fermata_Oltrecastello&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Fermata_F3 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=3&nameT=fermata_Oltrecastello&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Fermata_F3 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/fermata?fase=3&nameT=fermata_Oltrecastello&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Fermata(request, response)
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

describe('Linea_F1', () => {
	test('Linea_F1 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Linea_F1 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F1 value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Linea_F1 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Linea_F1 value contains Choices with Array contains value 5 on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.arrayContaining(['5']),
					}),
				);
			});
	});

	test('Linea_F1 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Linea_F1 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F1 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
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

describe('Linea_F2', () => {
	test('Linea_F2 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=2&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Linea_F2 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=2&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F2 value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=2&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Linea_F2 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=2&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Linea_F2 value contains Choices with Array contains value 5 on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=2&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.arrayContaining(['Oltrecastello']),
					}),
				);
			});
	});

	test('Linea_F2 value contain nameT with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=2&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						nameT: expect.any(String),
					}),
				);
			});
	});

	test('Linea_F2 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Linea_F2 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F2 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&name=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
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

describe('Linea_F3', () => {
	test('Linea_F3 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=3&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Linea_F3 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=3&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F3 value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=3&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Linea_F3 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=3&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Linea_F3 value contains Choices with Array contains value 5 on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=3&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.arrayContaining(['Oltrecastello']),
					}),
				);
			});
	});

	test('Linea_F3 value contain nameT with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=3&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						nameT: expect.any(String),
					}),
				);
			});
	});

	test('Linea_F3 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Linea_F3 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F3 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&nameT=linea_5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
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

describe('Linea_F4', () => {
	test('Linea_F4 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=4&nameT=linea_5_direzione_Oltrecastello&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Linea_F4 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=4&nameT=linea_5_direzione_Oltrecastello&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F4 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=4&nameT=linea_5_direzione_Oltrecastello&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Linea_F4 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&nameT=linea_5_direzione_Oltrecastello&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Linea_F4 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&nameT=linea_5_direzione_Oltrecastello&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Linea_F4 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/linea?fase=5&nameT=linea_5_direzione_Oltrecastello&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Linea(request, response)
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

describe('Next_F1', () => {
	test('Next_F1 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Next_F1 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Next_F1 value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Next_F1 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Next_F1 value contains Choices with Array contains value 5 on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=1'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.arrayContaining(['Oltrecastello']),
					}),
				);
			});
	});

	test('Next_F1 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Next_F1 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Next_F1 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=5'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
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

describe('Next_F2', () => {
	test('Next_F2 value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Next_F2 value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Next_F2 value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=2&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Next_F2 value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Next_F2 value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Next_F2 value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/next?fase=5&name=Oltrecastello'
		});
		const response = httpMocks.createResponse();
	 	urban.Next(request, response)
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

describe('Avvisi_Linee', () => {
	test('Avvisi_Linee value is defined on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/avvisilinee'
		});
		const response = httpMocks.createResponse();
	 	urban.Avvisi_Linee(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			});
	});

	test('Avvisi_Linee value contain Object on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/avvisilinee'
		});
		const response = httpMocks.createResponse();
	 	urban.Avvisi_Linee(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Avvisi_Linee value contain ASK with String on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/avvisilinee'
		});
		const response = httpMocks.createResponse();
	 	urban.Avvisi_Linee(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Ask: expect.any(String),
					}),
				);
			});
	});

	test('Avvisi_Linee value contains Choices with Array on success', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/avvisilinee'
		});
		const response = httpMocks.createResponse();
	 	urban.Avvisi_Linee(request, response)
			.then((res) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(
					expect.objectContaining({
						Choices: expect.any(Array),
					}),
				);
			});
	});

	test('Avvisi_Linee value is defined on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/avvisilineee'
		});
		const response = httpMocks.createResponse();
	 	urban.Avvisi_Linee(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toBeDefined();
			})
	});

	test('Avvisi_Linee value contain Object on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/avvisilineee'
		});
		const response = httpMocks.createResponse();
	 	urban.Avvisi_Linee(request, response)
			.catch((err) => {
				const property = JSON.parse(response._getData());
				expect(property).toEqual(expect.any(Object));
			});
	});

	test('Avvisi_Linee value contain ASK with String on error', () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: 'https://unitnhelpbot.herokuapp.com/avvisilineee'
		});
		const response = httpMocks.createResponse();
	 	urban.Avvisi_Linee(request, response)
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
