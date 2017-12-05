/*--- LAST UPDATE: 2017-12-04 ---*/

const alert = require('../../TelegramBot/sectionAvvisi.js');

exports.dwAvvisi = function(request, response)
{
	var dipartimentoRichiesto = request.query.dipartimento;

	try
	{
		alert.richiestaAvvisi(dipartimentoRichiesto, null, null)
			.then(values => {
				var x = JSON.parse(values);

				if(x['urlDipartimento'] === "URL non valido")
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
