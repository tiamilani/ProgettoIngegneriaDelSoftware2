'use strict';
module.exports = function(app) {
	var controller = require('../controllers/Controller');
	var place = require ('../controllers/places');
	var telegramController = require ('../controllers/telegramController');
	const TOKEN = process.env.TELEGRAM_TOKEN || '466491462:AAF8RxkhGR00Mylr0LGZfFWUMvPVWSHqUPE';
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

	// We are receiving updates at the route below!
	app.route(`/bot${TOKEN}`)
		.post(telegramController.update);
};
