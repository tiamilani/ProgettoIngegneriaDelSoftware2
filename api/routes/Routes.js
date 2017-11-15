'use strict';
module.exports = function(app) {
	var controller = require('../controllers/Controller');
	var place = require ('../controllers/places');

	// todoList Routes
	app.route('/example')
		.get(controller.function)
		.post(controller.function);

	app.route("/localizza")
		.get(place.luoghiUtili)
		.post(place.luoghiUtili);
<<<<<<< HEAD
=======

	app.route('/avvisi')
		.get(controller.dwAvvisi)
		.post(controller.dwAvvisi);
>>>>>>> develop
};
