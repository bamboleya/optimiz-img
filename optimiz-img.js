const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
var path = require('path');
var fs = require('fs');
var async = require('async');

function getFiles (dirPath, callback) {
    
    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);

        var filePaths = [];
        async.eachSeries(files, function (fileName, eachCallback) {
            var filePath = path.join(dirPath, fileName);

            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                    getFiles(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });
                } else {
                    if (stat.isFile() && /\.jpg$/.test(filePath) ||  /\.jpeg$/.test(filePath) || /\.JPG$/.test(filePath) || /\.JPEG$/.test(filePath) ) {
                        //filePaths.push(filePath);
                        var img_path = path.dirname(filePath);
                        imagemin(
                              [filePath],
                              'dir_'+img_path,
                              {plugins: [imageminMozjpeg({quality: 50})]}
                        );
						console.log('dir_'+img_path);
                    } else{
						if (stat.isFile() && /\.png$/.test(filePath) ||  /\.PNG$/.test(filePath)){
							var img_path_png = path.dirname(filePath);
							imagemin(
									[filePath], 
									'dir_'+img_path_png, {
							plugins: [
								imageminPngquant()
							]
						});
						console.log(filePath);
						}
					}
                    
                    eachCallback(null);
                }
            });
        }, function (err) {
            callback(err, filePaths);
        });
    });
}

try {
	getFiles('./', function (err, files) {
	});
}
	catch(err){
	console.error(err);
}