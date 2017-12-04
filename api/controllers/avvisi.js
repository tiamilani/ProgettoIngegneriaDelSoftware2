/*--- LAST UPDATE: 2017-11-16 ---*/

const alert = require('../../TelegramBot/sectionAvvisi.js');

exports.dwAvvisi = function(request, response)
{
	var dipartimentoRichiesto = request.query.dipartimento;

	try
	{
		alert.richiestaAvvisi(dipartimentoRichiesto, null, null)
			.then(values => {
				if(values['urlDipartimento'] === "URL non valido")
				{
					response.writeHead(404, {"Content-Type": "application/json; charset=utf-8"});
					response.end(values);
				}
				else
				{
					response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
					response.end(values);
				}
			})
			.catch((err) => { console.log(err.message); });
	}
	catch (err) { console.log(err.message); }
};
