const rimraf = require('rimraf');

// TASSE
const emptyTasseUrl = {section: 'tasse', subsection: ''};
const nullTasseUrl = {section: 'tasse', subsection: null};
const wrongTasseUrl = {section: 'tasse', subsection: 'ise'};

const emptyTasseUrlDetail = {section: 'tasse', subsection: 'isee', detail: ''};
const nullTasseUrlDetail = {section: 'tasse', subsection: 'isee', detail: null};
const wrongTasseUrlDetail = {section: 'tasse', subsection: 'isee', detail: 'nonresidenti'};

const tasse_rimborsi = {section: 'tasse', subsection: 'rimborsi'};
const tasse_pagamenti = {section: 'tasse', subsection: 'pagamenti'};
const tasse_tasse = {section: 'tasse', subsection: 'tasse'};
const tasse_isee_residenti = {section: 'tasse', subsection: 'isee', detail: 'residenti'};
const tasse_isee_nonResidenti = {section: 'tasse', subsection: 'isee', detail: 'non-residenti'};

// AMMISSIONI
const emptyAmmissioniUrl = {section: 'ammissioni', subsection: ''};
const nullAmmissioniUrl = {section: 'ammissioni', subsection: null};
const wrongAmmissioniUrl = {section: 'ammissioni', subsection: 'ammissioni_triennali'};

const ammissioni_triennali = {section: 'ammissioni', subsection: 'ammissioni-triennali'};
const ammissioni_magistrali = {section: 'ammissioni', subsection: 'ammissioni-magistrali'};

// IMMATRICOLAZIONI
const emptyImmatricolazioniUrl = {section: 'immatricolazioni', subsection: ''};
const nullImmatricolazioniUrl = {section: 'immatricolazioni', subsection: null};
const wrongImmatricolazioniUrl = {section: 'immatricolazioni', subsection: 'immatricolazioni_triennali'};

const immatricolazioni_triennali = {section: 'immatricolazioni', subsection: 'immatricolazioni-triennali'};
const immatricolazioni_magistrali = {section: 'immatricolazioni', subsection: 'immatricolazioni-magistrali'};

// RINNOVI
const emptyRinnovoUrl = {section: 'rinnovi', subsection: ''};
const nullRinnovoUrl = {section: 'rinnovi', subsection: null};
const wrongRinnovoUrl = {section: 'rinnovi', subsection: 'rinnovo-tasse'};

const rinnovo_tasse = {section: 'rinnovi', subsection: 'rinnovo-e-tasse'};
const rinnovo_borse = {section: 'rinnovi', subsection: 'rinnovo-e-borse'};
const rinnovo_bisogni = {section: 'rinnovi', subsection: 'rinnovo-bisogni-particolari'};

// BORSE
const emptyBorseUrl = {section: 'borse', subsection: ''};
const nullBorseUrl = {section: 'borse', subsection: null};
const wrongBorseUrl = {section: 'borse', subsection: 'attesa-laurea'};

const borse_bisogni = {section: 'borse', subsection: 'bisogni-speciali'};
const borse_attesa = {section: 'borse', subsection: 'attesa-di-laurea'};
const borse_circolazione = {section: 'borse', subsection: 'libera-circolazione'};
const borse_alloggio = {section: 'borse', subsection: 'borsa-e-alloggio'};

// TRASFERIMENTI
const emptyTrasferimentiUrl = {section: 'trasferimenti', subsection: ''};
const nullTrasferimentiUrl = {section: 'trasferimenti', subsection: null};
const wrongTrasferimentiUrl = {section: 'trasferimenti', subsection: 'trasferimenti-a'};

const emptyTrasferimentiUrlDetail = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: ''};
const nullTrasferimentiUrlDetail = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: null};
const wrongTrasferimentiUrlDetail = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'lettere'};

const trasferimenti_verso = {section: 'trasferimenti', subsection: 'trasferimenti-verso'};
const trasferimenti_magistrale = {section: 'trasferimenti', subsection: 'trasferimenti-da-magistrale'};
const trasferimenti_centro = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'centro'};
const trasferimenti_povo = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'povo'};
const trasferimenti_rovereto = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'rovereto'};
const trasferimenti_cibio = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'cibio'};
const trasferimenti_dii = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'dii'};
const trasferimenti_enologia = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'enologia'};
const trasferimenti_dicam = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'dicam'};
const trasferimenti_edile = {section: 'trasferimenti', subsection: 'trasferimenti-da', detail: 'edile'};

// FUTURO STUDENTE
const emptyFuturoStudenteUrl = {section: 'futuroStudente', subsection: ''};
const nullFuturoStudenteUrl = {section: 'futuroStudente', subsection: null};
const wrongFuturoStudenteUrl = {section: 'futuroStudente', subsection: 'dridattica'};

const emptyFuturoStudenteUrlDetail = {section: 'futuroStudente', subsection: 'didattica', detail: ''};
const nullFuturoStudenteUrlDetail = {section: 'futuroStudente', subsection: 'didattica', detail: null};
const wrongFuturoStudenteUrlDetail = {section: 'futuroStudente', subsection: 'didattica', detail: 'crosi'};

const futuroStudente_didattica = {section: 'futuroStudente', subsection: 'didattica', detail: 'corsi'};
const futuroStudente_iscrizioni = {section: 'futuroStudente', subsection: 'iscrizioni', detail: 'tasse'};
const futuroStudente_orientamento = {section: 'futuroStudente', subsection: 'orientamento', detail: 'costo'};
const futuroStudente_agevolazioni = {section: 'futuroStudente', subsection: 'agevolazioni', detail: 'alloggi'};
const futuroStudente_servizi = {section: 'futuroStudente', subsection: 'servizi', detail: 'mense'};
const futuroStudente_ateneo = {section: 'futuroStudente', subsection: 'ateneo', detail: 'strutture'};
const futuroStudente_pis = {section: 'futuroStudente', subsection: 'pis', detail: 'studiare-lavorare'};
const futuroStudente_studio = {section: 'futuroStudente', subsection: 'non-solo-studio', detail: 'apple'};

var howBot;
var howWeb;
var original_timeout;

var options;

beforeAll(() => {

  original_timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  howBot = require ('../TelegramBot/sectionHowto.js');
  howWeb = require ('../api/controllers/howto.js');

  options = [
                    {urls: 'https://infostudenti.unitn.it/it/tasse-universitarie', directory: './Tasse_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/ammissioni', directory: './Ammissioni_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/immatricolazioni', directory: './Immatricolazioni_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/rinnovo-iscrizioni', directory: './Rinnovi_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', directory: './Borse_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', directory: './Trasferimenti_Home'},
                    {urls: 'http://events.unitn.it/porteaperte-2017', directory: './OpenDay_Home'},
                    {urls: 'http://www.unitn.it/futuro-studente', directory: './Futuro_Studente'},
                    {urls: 'https://infostudenti.unitn.it/it/supporto-studenti', directory: './Supporto_Home'}
                ];
});

// BOT API FILE NAME

describe('Test of returned file for the first promise function used into howto section', () => {
  test('Return file for section TASSE is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section AMMISSIONI is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section IMMARTICOLAZIONI is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section RINNOVI is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section BORSE is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section TRASFERIMENTI is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section OPEN DAY is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.openDayFolder(options[6].directory, options[6]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section FUTURO STUDENTE is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section SUPPORTO is supposed to be named index.html', () => {
    expect.assertions(1);

    return howBot.studentFolder(options[8].directory, options[8]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

});

//  BOT API LINK AND DESCRIPTION

describe('Test of returned structures after a page have been parsed and useful elements have been saved', () => {
  test('TASSE struct should contain 5 links and 5 descriptions', () => {
    expect.assertions(2);

    return howBot.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readInfoFiles(options[0].directory, firstFile, null, null, 'tasse', {}).then(() => {
        //console.log(Object.keys(howBot.getLinkTasse()));
        expect(Object.keys(howBot.getLinkTasse()).length).toBe(10);
      });
    });
  });

  test('AMMISSIONI struct should contain 2 links and 2 descriptions', () => {
    expect.assertions(2);

    return howBot.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readInfoFiles(options[1].directory, firstFile, null, null, 'ammissioni', {}).then(() => {
        //console.log(Object.keys(howBot.getLinkAmmissioni()));
        expect(Object.keys(howBot.getLinkAmmissioni()).length).toBe(4);
      });
    });
  });

  test('IMMARTICOLAZIONI struct should contain 2 links and 2 descriptions', () => {
    expect.assertions(2);

    return howBot.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readInfoFiles(options[2].directory, firstFile, null, null, 'immatricolazioni', {}).then(() => {
        //console.log(Object.keys(howBot.getLinkImmatricolazioni()));
        expect(Object.keys(howBot.getLinkImmatricolazioni()).length).toBe(4);
      });
    });
  });

  test('RINNOVI struct should contain 3 links and 3 descriptions', () => {
    expect.assertions(2);

    return howBot.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readInfoFiles(options[3].directory, firstFile, null, null, 'rinnovi', {}).then(() => {
        //console.log(Object.keys(howBot.getLinkRinnovi()));
        expect(Object.keys(howBot.getLinkRinnovi()).length).toBe(6);
      });
    });
  });

  test('BORSE struct should contain 4 links and 4 descriptions', () => {
    expect.assertions(2);

    return howBot.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readInfoFiles(options[4].directory, firstFile, null, null, 'borse', {}).then(() => {
        //console.log(Object.keys(howBot.getLinkBorse()));
        expect(Object.keys(howBot.getLinkBorse()).length).toBe(8);
      });
    });
  });

  test('TRASFERIMENTI struct should contain 10 links and 10 descriptions', () => {
    expect.assertions(2);

    return howBot.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readInfoFiles(options[5].directory, firstFile, null, null, 'trasferimenti', {}).then(() => {
        //console.log(Object.keys(howBot.getLinkBorse()));
        expect(Object.keys(howBot.getLinkTrasferimenti()).length).toBe(20);
      });
    });
  });

  test('OPEN DAY dates returned by the second promise are supposed to be 4', () => {
    expect.assertions(2);

    return howBot.openDayFolder(options[6].directory, options[6]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readOpenDayFile(options[6].directory, file).then(list => {
        expect(list.length).toBe(4);
      });
    });
  });

  test('FUTURO STUDENTE section should get at least one link for every subsection', () => {
    expect.assertions(2);

    return howBot.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readStudentFile(options[7].directory, firstFile, null, null).then(() => {
        expect(howBot.getDidattica().link.length).not.toBe(0);
      });
    });
  });

  test('SUPPORTO struct should contain 1 links and 1 descriptions', () => {
    expect.assertions(2);

    return howBot.infoFolder(options[8].directory, options[8]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howBot.readInfoFiles(options[8].directory, firstFile, null, null, 'supporto', {}).then(() => {
        //console.log(Object.keys(howBot.getLinkSupporto()));
        expect(Object.keys(howBot.getLinkSupporto()).length).toBe(2);
      });
    });
  });

});

// TASSE API WEB WITH WRONG REQUEST PARAMETERS

describe('Test of TASSE web API behaviour, handling null, undefined, empty or incorrect request parameters', () => {
  test('TASSE function should return 400 Bad Request if detail is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tasse', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(emptyTasseUrlDetail.section, emptyTasseUrlDetail.subsection, emptyTasseUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TASSE function should return 400 Bad Request if detail is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tasse', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(nullTasseUrlDetail.section, nullTasseUrlDetail.subsection, nullTasseUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TASSE function should return 400 Bad Request if detail is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tasse', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(wrongTasseUrlDetail.section, wrongTasseUrlDetail.subsection, wrongTasseUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TASSE function should return 400 Bad Request if subsection is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tasse', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(emptyTasseUrl.section, emptyTasseUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TASSE function should return 400 Bad Request if subsection is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tasse', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(nullTasseUrl.section, nullTasseUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TASSE function should return 400 Bad Request if subsection is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tasse', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(wrongTasseUrl.section, wrongTasseUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

});

// AMMISSIONI API WEB WITH WRONG REQUEST PARAMETERS

describe('Test of AMMISSIONI web API behaviour, handling null, undefined, empty or incorrect request parameters', () => {
  test('AMMISSIONI function should return 400 Bad Request if subsection is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[1].directory, firstFile, 'ammissioni', {}).then(() => {
        return howWeb.ammissioniSaving(emptyAmmissioniUrl.section, emptyAmmissioniUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('AMMISSIONI function should return 400 Bad Request if subsection is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[1].directory, firstFile, 'ammissioni', {}).then(() => {
        return howWeb.ammissioniSaving(nullAmmissioniUrl.section, nullAmmissioniUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('AMMISSIONI function should return 400 Bad Request if subsection is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[1].directory, firstFile, 'ammissioni', {}).then(() => {
        return howWeb.ammissioniSaving(wrongAmmissioniUrl.section, wrongAmmissioniUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

});

// IMMATRICOLAZIONI API WEB WITH WRONG REQUEST PARAMETERS

describe('Test of IMMATRICOLAZIONI web API behaviour, handling null, undefined, empty or incorrect request parameters', () => {
  test('IMMATRICOLAZIONI function should return 400 Bad Request if subsection is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[2].directory, firstFile, 'immatricolazioni', {}).then(() => {
        return howWeb.ammissioniSaving(emptyImmatricolazioniUrl.section, emptyImmatricolazioniUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('IMMATRICOLAZIONI function should return 400 Bad Request if subsection is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[2].directory, firstFile, 'immatricolazioni', {}).then(() => {
        return howWeb.ammissioniSaving(nullImmatricolazioniUrl.section, nullImmatricolazioniUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('IMMATRICOLAZIONI function should return 400 Bad Request if subsection is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[2].directory, firstFile, 'immatricolazioni', {}).then(() => {
        return howWeb.ammissioniSaving(wrongImmatricolazioniUrl.section, wrongImmatricolazioniUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

});


// RINNOVI API WEB WITH WRONG REQUEST PARAMETERS

describe('Test of RINNOVI web API behaviour, handling null, undefined, empty or incorrect request parameters', () => {
  test('RINNOVI function should return 400 Bad Request if subsection is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[3].directory, firstFile, 'rinnovi', {}).then(() => {
        return howWeb.rinnovoIscrizioniSaving(emptyRinnovoUrl.section, emptyRinnovoUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('RINNOVI function should return 400 Bad Request if subsection is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[3].directory, firstFile, 'rinnovi', {}).then(() => {
        return howWeb.rinnovoIscrizioniSaving(nullRinnovoUrl.section, nullRinnovoUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('RINNOVI function should return 400 Bad Request if subsection is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[3].directory, firstFile, 'rinnovi', {}).then(() => {
        return howWeb.rinnovoIscrizioniSaving(wrongRinnovoUrl.section, wrongRinnovoUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

});


// BORSE API WEB WITH WRONG REQUEST PARAMETERS

describe('Test of BORSE web API behaviour, handling null, undefined, empty or incorrect request parameters', () => {
  test('BORSE function should return 400 Bad Request if subsection is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[4].directory, firstFile, 'borse', {}).then(() => {
        return howWeb.borseDiStudioSaving(emptyBorseUrl.section, emptyBorseUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('BORSE function should return 400 Bad Request if subsection is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[4].directory, firstFile, 'borse', {}).then(() => {
        return howWeb.borseDiStudioSaving(nullBorseUrl.section, nullBorseUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('BORSE function should return 400 Bad Request if subsection is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[4].directory, firstFile, 'borse', {}).then(() => {
        return howWeb.borseDiStudioSaving(wrongBorseUrl.section, wrongBorseUrl.subsection).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

});

// TRASFERIMENTI API WEB WITH WRONG REQUEST PARAMETERS

describe('Test of TRASFERIMENTI web API behaviour, handling null, undefined, empty or incorrect request parameters', () => {
  test('TRASFERIMENTI function should return 400 Bad Request if detail is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(emptyTrasferimentiUrlDetail.section, emptyTrasferimentiUrlDetail.subsection, emptyTrasferimentiUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TRASFERIMENTI function should return 400 Bad Request if detail is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(nullTrasferimentiUrlDetail.section, nullTrasferimentiUrlDetail.subsection, nullTrasferimentiUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TRASFERIMENTI function should return 400 Bad Request if detail is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(wrongTrasferimentiUrlDetail.section, wrongTrasferimentiUrlDetail.subsection, wrongTrasferimentiUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TRASFERIMENTI function should return 400 Bad Request if subsection is empty', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(emptyTrasferimentiUrl.section, emptyTrasferimentiUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TRASFERIMENTI function should return 400 Bad Request if subsection is null', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(nullTrasferimentiUrl.section, nullTrasferimentiUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('TRASFERIMENTI function should return 400 Bad Request if subsection is wrong', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(wrongTrasferimentiUrl.section, wrongTrasferimentiUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

});

// TRASFERIMENTI API WEB WITH WRONG REQUEST PARAMETERS

describe('Test of FUTURO STUDENTE web API behaviour, handling null, undefined, empty or incorrect request parameters', () => {
  test('FUTURO STUDENTE function should return 400 Bad Request if detail is empty', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(emptyFuturoStudenteUrlDetail.section, emptyFuturoStudenteUrlDetail.subsection, emptyFuturoStudenteUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('FUTURO STUDENTE function should return 400 Bad Request if detail is null', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(nullFuturoStudenteUrlDetail.section, nullFuturoStudenteUrlDetail.subsection, nullFuturoStudenteUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('FUTURO STUDENTE function should return 400 Bad Request if detail is wrong', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(wrongFuturoStudenteUrlDetail.section, wrongFuturoStudenteUrlDetail.subsection, wrongFuturoStudenteUrlDetail.detail).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('FUTURO STUDENTE function should return 400 Bad Request if subsection is empty', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(emptyFuturoStudenteUrl.section, emptyFuturoStudenteUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('FUTURO STUDENTE function should return 400 Bad Request if subsection is null', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(nullFuturoStudenteUrl.section, nullFuturoStudenteUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

  test('FUTURO STUDENTE function should return 400 Bad Request if subsection is wrong', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(wrongFuturoStudenteUrl.section, wrongFuturoStudenteUrl.subsection, null).catch(error => expect(error).toMatch("400 BAD REQUEST"));
      });
    });
  });

});





// TASSE API WITH CORRECT PARAMETERS

describe('Test of TASSE web API behaviour with correct request parameters', () => {

  test('TASSE function should return a json with 4 keys if rimborsi is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tasse', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(tasse_rimborsi.section, tasse_rimborsi.subsection, null).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('TASSE function should return a json with 4 keys if pagamenti is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tase', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(tasse_pagamenti.section, tasse_pagamenti.subsection, null).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('TASSE function should return a json with 4 keys if tasse is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tase', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(tasse_tasse.section, tasse_tasse.subsection, null).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('TASSE function should return a json with 5 keys if residenti isee is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tase', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(tasse_isee_residenti.section, tasse_isee_residenti.subsection, tasse_isee_residenti.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TASSE function should return a json with 5 keys if non residenti isee is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[0].directory, firstFile, 'tase', {}).then(() => {
        return howWeb.tasseUniversitarieSaving(tasse_isee_nonResidenti.section, tasse_isee_nonResidenti.subsection, tasse_isee_nonResidenti.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

});

// AMMISSIONI API WITH CORRECT PARAMETERS

describe('Test of AMMISSIONI web API behaviour with correct request parameters', () => {

  test('AMMISSIONI function should return a json with 4 keys if ammissioni-triennali is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[1].directory, firstFile, 'ammissioni', {}).then(() => {
        return howWeb.ammissioniSaving(ammissioni_triennali.section, ammissioni_triennali.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('AMMISSIONI function should return a json with 4 keys if ammissioni-magistrali is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[1].directory, firstFile, 'ammissioni', {}).then(() => {
        return howWeb.ammissioniSaving(ammissioni_magistrali.section, ammissioni_magistrali.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

});

// IMMATRICOLAZIONI API WITH CORRECT PARAMETERS

describe('Test of IMMATRICOLAZIONI web API behaviour with correct request parameters', () => {

  test('IMMATRICOLAZIONI function should return a json with 4 keys if immatricolazioni-triennali is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[2].directory, firstFile, 'immatricolazioni', {}).then(() => {
        return howWeb.immatricolazioniSaving(immatricolazioni_triennali.section, immatricolazioni_triennali.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('IMMATRICOLAZIONI function should return a json with 4 keys if immatricolazioni-magistrali is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[2].directory, firstFile, 'immatricolazioni', {}).then(() => {
        return howWeb.immatricolazioniSaving(immatricolazioni_magistrali.section, immatricolazioni_magistrali.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

});

// RINOVI API WITH CORRECT PARAMETERS

describe('Test of RINNOVI web API behaviour with correct request parameters', () => {

  test('RINNOVI function should return a json with 4 keys if rinnovo e borse is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[3].directory, firstFile, 'rinnovi', {}).then(() => {
        return howWeb.rinnovoIscrizioniSaving(rinnovo_borse.section, rinnovo_borse.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('RINNOVI function should return a json with 4 keys if rinnovo e tasse is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[3].directory, firstFile, 'rinnovi', {}).then(() => {
        return howWeb.rinnovoIscrizioniSaving(rinnovo_tasse.section, rinnovo_tasse.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('RINNOVI function should return a json with 4 keys if rinnovo e bisogni particolari is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[3].directory, firstFile, 'rinnovi', {}).then(() => {
        return howWeb.rinnovoIscrizioniSaving(rinnovo_bisogni.section, rinnovo_bisogni.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

});

// BORSE API WITH CORRECT PARAMETERS

describe('Test of BORSE web API behaviour with correct request parameters', () => {

  test('BORSE function should return a json with 4 keys if bisogni speciali is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[4].directory, firstFile, 'borse', {}).then(() => {
        return howWeb.borseDiStudioSaving(borse_bisogni.section, borse_bisogni.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('BORSE function should return a json with 4 keys if attesa di laurea is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[4].directory, firstFile, 'borse', {}).then(() => {
        return howWeb.borseDiStudioSaving(borse_attesa.section, borse_attesa.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('BORSE function should return a json with 4 keys if alloggio is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[4].directory, firstFile, 'borse', {}).then(() => {
        return howWeb.borseDiStudioSaving(borse_alloggio.section, borse_alloggio.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('BORSE function should return a json with 4 keys if rinnovo e libera circolazione is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[4].directory, firstFile, 'borse', {}).then(() => {
        return howWeb.borseDiStudioSaving(borse_circolazione.section, borse_circolazione.subsection).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

});

// TRASFERIMENTI API WITH CORRECT PARAMETERS

describe('Test of TRASFERIMENTI web API behaviour with correct request parameters', () => {

  test('TRASFERIMENTI function should return a json with 4 keys if trasferimenti verso altri atenei is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_verso.section, trasferimenti_verso.subsection, null).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 4 keys if trasferimenti da altri atenei per magistrale is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_magistrale.section, trasferimenti_magistrale.subsection, null).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(4);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per centro is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_centro.section, trasferimenti_centro.subsection, trasferimenti_centro.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per povo is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_povo.section, trasferimenti_povo.subsection, trasferimenti_povo.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per rovereto is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_rovereto.section, trasferimenti_rovereto.subsection, trasferimenti_rovereto.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per cibio is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_cibio.section, trasferimenti_cibio.subsection, trasferimenti_cibio.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per dii is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_dii.section, trasferimenti_dii.subsection, trasferimenti_dii.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per enologia is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_enologia.section, trasferimenti_enologia.subsection, trasferimenti_enologia.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per dicam is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_dicam.section, trasferimenti_dicam.subsection, trasferimenti_dicam.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('TRASFERIMENTI function should return a json with 5 keys if trasferimenti da altri atenei per edile is requested', () => {
    expect.assertions(2);

    return howWeb.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readInfoFiles(options[5].directory, firstFile, 'trasferimenti', {}).then(() => {
        return howWeb.trasferimentiSaving(trasferimenti_edile.section, trasferimenti_edile.subsection, trasferimenti_edile.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

});

// FUTURO STUDENTE API WITH CORRECT PARAMETERS

describe('Test of TRASFERIMENTI web API behaviour with correct request parameters', () => {

  test('FUTURO STUDENTE function should return a json with 5 keys if didattica per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_didattica.section, futuroStudente_didattica.subsection, futuroStudente_didattica.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('FUTURO STUDENTE function should return a json with 5 keys if iscrizioni per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_iscrizioni.section, futuroStudente_iscrizioni.subsection, futuroStudente_iscrizioni.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('FUTURO STUDENTE function should return a json with 5 keys if orientamento per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_orientamento.section, futuroStudente_orientamento.subsection, futuroStudente_orientamento.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('FUTURO STUDENTE function should return a json with 5 keys if agevolazioni per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_agevolazioni.section, futuroStudente_agevolazioni.subsection, futuroStudente_agevolazioni.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('FUTURO STUDENTE function should return a json with 5 keys if servizi per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_servizi.section, futuroStudente_servizi.subsection, futuroStudente_servizi.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('FUTURO STUDENTE function should return a json with 5 keys if ateneo per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_ateneo.section, futuroStudente_ateneo.subsection, futuroStudente_ateneo.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('FUTURO STUDENTE function should return a json with 5 keys if prospective international student per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_pis.section, futuroStudente_pis.subsection, futuroStudente_pis.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

  test('FUTURO STUDENTE function should return a json with 5 keys if non solo studio per centro is requested', () => {
    expect.assertions(2);

    return howWeb.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return howWeb.readStudentFile(options[7].directory, firstFile).then(() => {
        return howWeb.futuroStudenteSaving(futuroStudente_studio.section, futuroStudente_studio.subsection, futuroStudente_studio.detail).then(json => {
          var final = JSON.parse(json);

          expect(Object.keys(final).length).toBe(5);
        });
      });
    });
  });

});


afterAll(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = original_timeout;

  rimraf(options[0].directory, function () { console.log(options[0].directory + " deleted"); });
  rimraf(options[1].directory, function () { console.log(options[1].directory + " deleted"); });
  rimraf(options[2].directory, function () { console.log(options[2].directory + " deleted"); });
  rimraf(options[3].directory, function () { console.log(options[3].directory + " deleted"); });
  rimraf(options[4].directory, function () { console.log(options[4].directory + " deleted"); });
  rimraf(options[5].directory, function () { console.log(options[5].directory + " deleted"); });
  rimraf(options[6].directory, function () { console.log(options[6].directory + " deleted"); });
  rimraf(options[7].directory, function () { console.log(options[7].directory + " deleted"); });
  rimraf(options[8].directory, function () { console.log(options[8].directory + " deleted"); });
  rimraf('./coverage', function () { console.log("./coverage deleted"); });
});
