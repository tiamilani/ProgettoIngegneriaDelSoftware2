'use strict';
module.exports = function(app) {
	var controller = require('../controllers/Controller');
	var place = require ('../controllers/places');
	var telegramController = require ('../controllers/telegramController');
	const TOKEN = process.env.TELEGRAM_TOKEN || '466491462:AAF8RxkhGR00Mylr0LGZfFWUMvPVWSHqUPE';
	var avvisi = require ('../controllers/avvisi');
	const urban = require ('../controllers/mezzi.js');

	// todoList Routes
	app.route('/example')
		.get(controller.function)
		.post(controller.function);

	app.route("/localizza")
		.get(place.luoghiUtili)
		.post(place.luoghiUtili);

	app.route('/howto')
		.get(howto.base)
		.post(howto.base);

	app.route('/avvisi')
		.get(avvisi.dwAvvisi)
		.post(avvisi.dwAvvisi);

	app.route('/fermata')
		.get(urban.Fermata)
		.post(urban.Fermata);

	app.route('/linea')
		.get(urban.Linea)
		.post(urban.Linea);

	app.route('/next')
		.get(urban.Next)
		.post(urban.Next);

	app.route('/avvisiLinee')
		.get(urban.Avvisi_Linee)
		.post(urban.Avvisi_Linee);

	// We are receiving updates at the route below!
	app.route(`/bot${TOKEN}`)
		.post(telegramController.update);
};
