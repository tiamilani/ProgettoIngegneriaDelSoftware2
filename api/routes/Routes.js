'use strict';
module.exports = function(app) {
	const controller = require('../controllers/Controller');
	const place = require ('../controllers/places');
	const avvisi = require ('../controllers/avvisi');
	const urban = require ('../controllers/mezzi.js');
	const dead = require ('../controllers/scadenze.js');
	const howto = require ('../controllers/howto.js');
	const db = require ('../controllers/develop.js');
	const telegramController = require ('../controllers/telegramController');
	const TOKEN = process.env.TELEGRAM_TOKEN || '466491462:AAF8RxkhGR00Mylr0LGZfFWUMvPVWSHqUPE';

	app.route('/updatedb')
		.put(db.UpdateDB);

	app.route('/example')
		.get(controller.function);

	app.route("/localizza");

	app.route('/howto')
		.get(howto.base);

	app.route('/avvisi')
		.get(avvisi.dwAvvisi);

	app.route('/fermata')
		.get(urban.Fermata);

	app.route('/linea')
		.get(urban.Linea);

	app.route('/next')
		.get(urban.Next);

	app.route('/avvisilinee')
		.get(urban.Avvisi_Linee);

	app.route('/scadenze')
		.get(dead.mostraScadenze);

	app.route(`/bot${TOKEN}`)
		.post(telegramController.update);
};
