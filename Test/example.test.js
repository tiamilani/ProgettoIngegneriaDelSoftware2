const httpMocks = require('node-mocks-http');
const controller = require('./../api/controllers/Controller');

describe('example', () => {
    test('controllo il json', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: 'https://unitnhelpbot.herokuapp.com/example'
        });

        const response = httpMocks.createResponse();

        controller.function(request, response);

        const property = JSON.parse(response._getData());

        expect(property).toEqual({
                                anObject:{
                                    item1: "ciao come stai qui tutt",
                                    item2: "item2val"
                                },
                                anArray: ["item1","item2"],
                                another:"item"
                            });
    });
});
