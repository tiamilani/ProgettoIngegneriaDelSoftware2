'use strict';
module.exports = function(app) {
	var controller = require('../controllers/Controller');

	// todoList Routes
	app.route('/example')
		.get(controller.function)
		.post(controller.function);

	/*---2017-10-30---*/
	app.route('/avvisi')
		.get(controller.dwAvvisi)
		.post(controller.dwAvvisi);
};
