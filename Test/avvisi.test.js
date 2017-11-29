const httpMocks = require('node-mocks-http');
const controllerAvvisi = require('./../api/controllers/avvisi');
const section = require('./../TelegramBot/sectionAvvisi');


const fs = require('fs');

/* - = ToDo , + = Done
 Funzioni da testare:
 + parseHTMLFile(fileToParse, stringaDaConfrontare)
 + readHTMLFile(path, bot, msg)
 + setURL(dipartimento)
 + function downloadAvvisi(dipartimentoRichiesto, bot, msg)
*/


/*--- UTILITY ---*/
function getCompareString()
{
    var currentDate = new Date();
    var currentDate_string = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
    if(currentDate.getDate() < 10)
        currentDate_string = "0" + currentDate_string;

    return ("inserito il " + currentDate_string + " da");
};

function getFileText(filePath)
{
    return fs.readFileSync(filePath, 'latin1');
};

/*--- PARSE HTML FILE ---*/
describe('Test della funzione "parseHTMLFile"', () => {

    const stringaDaConfrontare = getCompareString();
    const textFileDICAM = getFileText("./Avvisi/DICAM/index.html");
    const textFileDII = getFileText("./Avvisi/DII/index.html");
    const textFileCISCA = getFileText("./Avvisi/CISCA/index.html");

    test('Parsing del testo del file nella cartella "DICAM"', () => {
        return section.parseHTMLFile(textFileDICAM, stringaDaConfrontare).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Parsing del testo del file nella cartella "DII"', () => {
        return section.parseHTMLFile(textFileDII, stringaDaConfrontare).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Parsing del testo del file nella cartella "CISCA"', () => {
        return section.parseHTMLFile(textFileCISCA, stringaDaConfrontare).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Parsing di un testo errato', () => {
        return section.parseHTMLFile("fileText", "stringaDaConfrontare").then(values => {
            expect(values).toEqual(expect.arrayContaining([]));
        });
    });

    test('Parsing di un testo nullo', () => {
        return section.parseHTMLFile(null, null).catch(values => {
            expect(values).toBeNull();
        });
    });

    test('Nessun argomento passato', () => {
        return section.parseHTMLFile().catch(values => {
            expect(values).toBeNull();
        });
    });
});

/*--- READ HTML FILE ---*/
describe('Test della funzione "readHTMLFile"', () => {
    test('Lettura del file nella cartella DICAM', () => {
        return section.readHTMLFile("./Avvisi/DICAM/index.html", null, null).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Lettura del file nella cartella DII', () => {
        return section.readHTMLFile("./Avvisi/DII/index.html", null, null).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Lettura del file nella cartella CISCA', () => {
        return section.readHTMLFile("./Avvisi/CISCA/index.html", null, null).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Lettura di un file con un percorso errato', () => {
        return section.readHTMLFile("./Avvisi/Error/index.html", null, null).catch(values => {
            expect(values).toBeNull();
        });
    });

    test('Lettura di un file nullo', () => {
        return section.readHTMLFile(null, null, null).catch(values => {
            expect(values).toBeNull();
        });
    });

    test('Nessun argomento passato', () => {
        return section.readHTMLFile().catch(values => {
            expect(values).toBeNull();
        });
    });
});

/*--- SET URL ---*/
describe('Test della funzione "setURL"', () => {
    test('Case: DICAM', () => {
        let options = section.setURL("DICAM");
        expect(options).toEqual({
            urls: 'http://www.science.unitn.it/avvisiesami/dicam/avvisi.php',
            directory: './Avvisi/DICAM'
        });
    });

    test('Case: DII', () => {
        let options = section.setURL("DII");
        expect(options).toEqual({
            urls: 'http://www.science.unitn.it/avvisiesami/dii-cibio/visualizzare_avvisi.php',
            directory: './Avvisi/DII'
        });
    });

    test('Case: CISCA', () => {
        let options = section.setURL("CISCA");
        expect(options).toEqual({
            urls: 'http://www.science.unitn.it/cisca/avvisi/avvisi.php',
            directory: './Avvisi/CISCA'
        });
    });

    test('Case: valore errato', () => {
        let options = section.setURL("error");
        expect(options).toEqual("ERROR");
    });

    test('Case: valore nullo', () => {
        let options = section.setURL(null);
        expect(options).toEqual("ERROR");
    });

    test('Nessun argomento passato', () => {
        let options = section.setURL();
        expect(options).toEqual("ERROR");
    });
});

/*--- RICHIESTA AVVISI ---*/
describe('Test della funzione "richiestaAvvisi"', () => {
    test('Richiesta dipartimento DICAM', () => {
        return section.richiestaAvvisi("DICAM", null, null).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Richiesta dipartimento DII', () => {
        return section.richiestaAvvisi("DII", null, null).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Richiesta dipartimento CISCA', () => {
        return section.richiestaAvvisi("CISCA", null, null).then(values => {
            expect(values).toBeDefined();
        });
    });

    test('Richiesta dipartimento errato', () => {
        return section.richiestaAvvisi("Error", null, null).catch(values => {
            expect(values).toBeNull();
        });
    });

    test('Richiesta con parametro nullo', () => {
        return section.richiestaAvvisi(null, null, null).catch(values => {
            expect(values).toBeNull();
        });
    });

    test('Nessun argomento passato', () => {
        return section.richiestaAvvisi().catch(values => {
            expect(values).toBeNull();
        });
    });
});
