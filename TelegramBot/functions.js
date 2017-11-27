// ---------- REQUIRE ----------
const dw = require('website-scraper');
const fs = require('fs');
const ext = require('path');
const rmrf = require('rimraf');
const ch = require('cheerio');

// ---------- FUNCTIONS ----------
function deleteAll (path) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file) {
                var curPath = path + "/" + file;
    			if (!fs.lstatSync(curPath).isDirectory())
    				fs.unlinkSync(curPath);
    			else {
    				deleteAll(curPath);
    				try { fs.rmdirSync(curPath); console.log(true); return resolve(true); } catch(e) { console.log(false); return reject(false); }
    			}
            });
        } else { console.log(true); return resolve(true); }
    });
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

function toDate(dStr, format) {
	var now = new Date();
	if (format == "h:m:s") {
        var arrSplit = dStr.split(":");
 		now.setHours(arrSplit[0]);
 		now.setMinutes(arrSplit[1]);
 		now.setSeconds(arrSplit[2]);
 		return now;
	}else
		return "Invalid Format";
}

// ---------- EXPORTS ----------
exports.rimuoviDir = deleteAll;
exports.deleteFolderRecursive = deleteFolderRecursive;
exports.distanceBetween = getDistance;
exports.convertDate = toDate;
