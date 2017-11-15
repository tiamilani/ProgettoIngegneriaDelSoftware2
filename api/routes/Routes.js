'use strict';
module.exports = function(app) {
	var controller = require('../controllers/Controller');
	var place = require ('../controllers/places');
	var howto = require('../controllers/howto');

	// todoList Routes
	app.route('/example')
		.get(controller.function)
		.post(controller.function);

	app.route("/localizza")
		.get(place.luoghiUtili)
		.post(place.luoghiUtili);

	app.route('/avvisi')
		.get(controller.dwAvvisi)
		.post(controller.dwAvvisi);

	app.route('/howto')
		.get(howto.base)
		.post(howto.base);
};
