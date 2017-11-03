// ---------- REQUIRE ----------
const dw = require('website-scraper');
const fs = require('fs');
const ext = require('path');
const rmrf = require('rimraf');
const rc = require('read-chunk');
const ft = require('file-type');

// ---------- FUNCTIONS ----------
var deleteAll = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory())
				fs.unlinkSync(curPath);
			else {
				deleteAll(curPath);
				try { fs.rmdirSync(curPath); } catch(e) { }
			}
        });
    }
}

var deleteFolderRecursive = function (path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index){
			var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory()) {
				if(ext.extname(curPath) != '' || fs.statSync(curPath).size < 50000)
					fs.unlinkSync(curPath);
			}
			else {
				deleteFolderRecursive(curPath);
				try { fs.rmdirSync(curPath); } catch(e) { }
			}
		});
	}
}

var downloadFiles = function (link, dir, bot, msg) {
    let options = {
        urls: [link],
        directory: dir,
        recursive: true,
        maxDepth: 1
    };

	/*try {
		var stats = fs.statSync(dir);
		var now = new Date().getTime();
		var endTime = new Date(stats.birthtime).getTime() + 5; // 1 Month = 2592000

		if (now > endTime) { deleteAll(dir); }
	}
	catch(err) { }*/

    if (!fs.existsSync(dir)) {
        dw(options).then((result) => {

			deleteFolderRecursive(dir);
			Promise.all([deleteFolderRecursive]).then(values => {
				var tmpFiles = fs.readdirSync(dir);

		        let i;
				let buffer;
				let type;
		        for(i = 0; i < tmpFiles.length; i++)
				{
					buffer = rc.sync(dir + '/' + tmpFiles[i], 0, 4100);
					type = ft(buffer).ext;
					if(type == 'msi')
						fs.renameSync(dir + '/' + tmpFiles[i], dir + '/File' + (i+1) + '.xls');
					else
						fs.renameSync(dir + '/' + tmpFiles[i], dir + '/File' + (i+1) + '.' + type);
				}

				tmpFiles = fs.readdirSync(dir);

				if(tmpFiles.length > 0)
				{
					for(i = 0; i < tmpFiles.length; i++)
						bot.sendDocument(msg.chat.id, dir + '/' + tmpFiles[i]);
				}
				else
					bot.sendMessage(msg.chat.id, "Purtroppo non ci sono file da visualizzare...");
			});
		}).catch((err) => { console.log("Errore nel download dei file richiesti"); });
	}
	else {
		var tmpFiles = fs.readdirSync(dir);

		if(tmpFiles.length > 0)
		{
			for(i = 0; i < tmpFiles.length; i++)
				bot.sendDocument(msg.chat.id, dir + '/' + tmpFiles[i]);
		}
		else
			bot.sendMessage(msg.chat.id, "Purtroppo non ci sono file da visualizzare...");
	}
}

var rad = function(x) {
    return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2[0] - p1[0]);
    var dLong = rad(p2[1] - p1[1]);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

var deleteFilesWebcam = function (path, filesNotRemove) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index){
			var curPath = path + "/" + file;
			if (!fs.lstatSync(curPath).isDirectory()) {
                let i;
                let b;
                for(i = 0, b = 0; i < filesNotRemove.length; i++)
                {
                    if(file == filesNotRemove[i])
                        b = 1;
                }

                if(b == 0)
                    fs.unlinkSync(curPath);
			}
			else {
				deleteFilesWebcam(curPath, filesNotRemove);
				try { fs.rmdirSync(curPath); } catch(e) { }
			}
		});
	}
}

var downloadPhoto = function (link, dir, filesNotRemove) {
    let options = {
        urls: [link],
        directory: dir
    };

    dw(options).then((result) => {
		deleteFilesWebcam(dir, filesNotRemove);

		Promise.all([deleteFilesWebcam]).then(values => {
            var tmpFiles = fs.readdirSync(dir + '/images');

	        let i;
			let buffer;
			let type;
	        for(i = 0; i < tmpFiles.length; i++)
				fs.renameSync(dir + '/images/' + tmpFiles[i], dir + '/' + tmpFiles[i]);

            rmrf(dir + '/images', function () {});
		});
	}).catch((err) => { console.log("Errore nel download dei file richiesti"); });
}

// ---------- EXPORTS ----------
exports.richiestaFile = downloadFiles;
exports.richiestaFotoMensa = downloadPhoto;
exports.distanceBetween = getDistance;
