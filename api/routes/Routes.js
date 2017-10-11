'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/Controller');

	// todoList Routes
	app.route('/example')
		.get(controller.function)
		.post(controller.function);

	app.route("/localizza")
		.get(controller.luoghiUtili)
		.post(controller.luoghiUtili);
};
