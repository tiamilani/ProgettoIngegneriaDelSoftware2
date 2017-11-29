var how;
var options;
var rimraf;

beforeAll(() => {
  how = require ('../TelegramBot/sectionHowto.js');
  rimraf = require('rimraf');

  options = [
                    {urls: 'https://infostudenti.unitn.it/it/tasse-universitare', directory: './Tasse_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/ammissioni', directory: './Ammissioni_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/immatricolazioni', directory: './Immatricolazioni_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/rinnovo-iscrizioni', directory: './Rinnovi_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/borse-di-studio-e-agevolazioni', directory: './Borse_Home'},
                    {urls: 'https://infostudenti.unitn.it/it/trasferirsi-e-cambiare-corso', directory: './Trasferimenti_Home'},
                    {urls: 'http://events.unitn.it/porteaperte-2017', directory: './OpenDay_Home'},
                    {urls: 'http://www.unitn.it/futuro-studente', directory: './Futuro_Studente'}
                ];
});

describe('Test of returned file for the first promise function used into howto section', () => {
  test('Return file for section TASSE is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section AMMISSIONI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section IMMARTICOLAZIONI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section RINNOVI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section BORSE is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section TRASFERIMENTI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section OPEN DAY is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.openDayFolder(options[6].directory, options[6]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section FUTURO STUDENTE is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

});


/*describe('Test of returned structures after a page have been parsed and useful elements have been saved', () => {
  test('TASSE struct should contain 5 links and five descriptions', () => {
    expect.assertions(2);

    return how.infoFolder(options[0].directory, options[0]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return how.readInfoFiles(options[0].directory, file, null, null, 'tasse', {}).then((result) => {
        console.log(Object.keys(result));
        expect(result).not.toBeUndefined();
        //expect(Object.keys(result).length).toBe(5);
      })
    });
  });

  test('Return file for section AMMISSIONI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[1].directory, options[1]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section IMMARTICOLAZIONI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[2].directory, options[2]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section RINNOVI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[3].directory, options[3]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section BORSE is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[4].directory, options[4]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('Return file for section TRASFERIMENTI is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.infoFolder(options[5].directory, options[5]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

  test('OPEN DAY dates returned by the second promise are supposed to be 4', () => {
    expect.assertions(2);

    return how.openDayFolder(options[6].directory, options[6]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
      return how.readOpenDayFile(options[6].directory, file).then(list => {
        expect(list.length).toBe(4);
      });
    });
  });

  test('Return file for section FUTURO STUDENTE is supposed to be named index.html', () => {
    expect.assertions(1);

    return how.studentFolder(options[7].directory, options[7]).then(file => {
      firstFile = file[0];
      expect(firstFile).toBe('index.html');
    });
  });

});*/

afterAll(() => {
    rimraf(options[0].directory, function () { console.log(options[0].directory + " deleted"); });
    rimraf(options[1].directory, function () { console.log(options[1].directory + " deleted"); });
    rimraf(options[2].directory, function () { console.log(options[2].directory + " deleted"); });
    rimraf(options[3].directory, function () { console.log(options[3].directory + " deleted"); });
    rimraf(options[4].directory, function () { console.log(options[4].directory + " deleted"); });
    rimraf(options[5].directory, function () { console.log(options[5].directory + " deleted"); });
    rimraf(options[6].directory, function () { console.log(options[6].directory + " deleted"); });
    rimraf(options[7].directory, function () { console.log(options[7].directory + " deleted"); });
    rimraf('./coverage', function () { console.log("./coverage deleted"); });
});
