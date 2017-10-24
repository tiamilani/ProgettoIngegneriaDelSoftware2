'use strict';
module.exports = function(app) {
	var todoList = require('../controllers/Controller');
	var telegram = require('../controllers/telegram')
	var controller = require('../controllers/Controller');
	var place = require ('../controllers/places');

	// todoList Routes
	app.route('/example')
		.get(controller.function)
		.post(controller.function);

	app.route("/localizza")
		.get(place.luoghiUtili)
		.post(place.luoghiUtili);
};
