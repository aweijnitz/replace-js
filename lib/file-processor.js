var fs = require('fs');



var tmpFileSuffix = function() {
    return '_' + Math.floor(10000+10000.0*Math.random());
};


// TODO: "Flatten" using promises
var processFile = function(file, fromPattern, toString, enc, callback) {

    // READ FILE
    fs.readFile(file, { encoding : enc }, function(err, data) {
        if(err) {
            callback(err, null);
            return;
        }

        // REPLACE STRING AND WRITE TO TEMP FILE
        var tmpFileName = file + tmpFileSuffix();
        fs.writeFile(tmpFileName, data.replace(fromPattern, toString), { encoding : enc }, function(error0) {
            if(error0) {
                callback(error0, null);
                return;
            }

            // REMOVE ORIGINAL FILE
            fs.unlink(file, function(error1) {
                if(error1) {
                    callback(error1, null);
                    return;
                }

                // MOVE TEMP FILE TO ORIGINAL NAME
                fs.rename(tmpFileName, file, function(error2) {
                    if(error2)
                        callback(error2, null);
                    else
                        callback(null, true);
                });
            });
        });
    });
};


exports = module.exports = processFile;
