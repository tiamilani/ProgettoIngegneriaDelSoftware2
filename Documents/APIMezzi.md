# API Mezzi

Settare i riferimenti al file contentente le API di Mezzi
`const urban = require ('../controllers/mezzi.js');`

---

### FERMATA
Basta aggiungere nel file Routes il seguente spezzone di codice:

`app.route(/fermata).get(urban.Fermata).post(urban.Fermata);`

In pratica è sufficiente indirizzare le richieste get e post alla funzione `Fermata` presente in `urban`.

Le richieste consentite sono:

1. `/fermata?fase=1`
	> Questa è la prima fase. Verranno restituiti i valori:
	+ `Ask`		-> Frase da stampare all'utente
	+ `Choices` -> Scelte consentite
2. `/fermata?fase=2&name=<fermata>`
	> Questa è la seconda fase. Verranno restituiti i valori:
	+ `nameT` 	-> Nome da passare in request alla fase successiva
	+ `Ask`		-> Frase da stampare all'utente
	+ `Choices` -> Scelte consentite
3. `/fermata?fase=3&nameT=<nameT>&name=<linea>`
	> Questa è la terza fase. Verranno restituiti i valori:
	+ `Choices` -> Risultati

---

### LINEA
Basta aggiungere nel file Routes il seguente spezzone di codice:

`app.route(/<rotta>).get(urban.Linea).post(urban.Linea);`

In pratica è sufficiente indirizzare le richieste get e post alla funzione `Linea` presente in `urban`.

Le richieste consentite sono:

1. `/<rotta>?fase=1`
	> Questa è la prima fase. Verranno restituiti i valori:
	+ `Ask`		-> Frase da stampare all'utente
	+ `Choices` -> Scelte consentite
2. `/<rotta>?fase=2&name=<linea>`
	> Questa è la seconda fase. Verranno restituiti i valori:
	+ `nameT` 	-> Nome da passare in request alla fase successiva
	+ `Ask`		-> Frase da stampare all'utente
	+ `Choices` -> Scelte consentite
3. `/<rotta>?fase=3&nameT=<nameT>&name=<direzione>`
	> Questa è la terza fase. Verranno restituiti i valori:
	+ `nameT` 	-> Nome da passare in request alla fase successiva
	+ `Ask`		-> Frase da stampare all'utente
	+ `Choices` -> Scelte consentite
4. `/<rotta>?fase=4&nameT=<nameT>&name=<fermata>`
	> Questa è la quarta fase. Verranno restituiti i valori:
	+ `Choices` -> Risultati

---

### NEXT
Basta aggiungere nel file Routes il seguente spezzone di codice:

`app.route(/<rotta>).get(urban.Next).post(urban.Next);`

In pratica è sufficiente indirizzare le richieste get e post alla funzione `Next` presente in `urban`.

Le richieste consentite sono:

1. `/<rotta>?fase=1`
	> Questa è la prima fase. Verranno restituiti i valori:
	+ `Ask`		-> Frase da stampare all'utente
	+ `Choices` -> Scelte consentite
2. `/<rotta>?fase=2&name=<fermata>`
	> Questa è la seconda fase. Verranno restituiti i valori:
	+ `Choices` -> Risultati

---

### AVVISI_LINEE
Basta aggiungere nel file Routes il seguente spezzone di codice:

`app.route(/<rotta>).get(urban.Avvisi_Linee).post(urban.Avvisi_Linee);`

In pratica è sufficiente indirizzare le richieste get e post alla funzione `Avvisi_Linee` presente in `urban`.

Così facendo, alla richiesta `/<rotta>` verrà ritornato:
> `Choices` -> Risultati
