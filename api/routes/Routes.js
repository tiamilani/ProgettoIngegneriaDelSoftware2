'use strict';
module.exports = function(app) {
	var controller = require('../controllers/Controller');
	var place = require ('../controllers/places');
	var avvisi = require ('../controllers/avvisi');

	// todoList Routes
	app.route('/example')
		.get(controller.function)
		.post(controller.function);

	app.route("/localizza")
		.get(place.luoghiUtili)
		.post(place.luoghiUtili);

	app.route('/avvisi')
		.get(avvisi.dwAvvisi)
		.post(avvisi.dwAvvisi);
};
