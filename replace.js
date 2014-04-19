var path = require('path');
var filewalker = require('filewalker');
var minimatch = require("minimatch");
var readReplaceWrite = require('./lib/file-processor.js');

var runningAsScript = require.main === module;

var verbose = false;

// Helpers
//
var log = function(msg) {
    if(verbose) console.log(msg);
};

var exit = function(msg) {
    console.log(msg);
    process.exit(1);
};

var errorHandler = function(err) {
    log(err);
};


var parseCommandLineArgs = function(argv) {

    var argv = require('minimist')(process.argv.slice(2), { boolean: 'v', default: { 'e' : 'utf8' }});
    var dir = path.resolve(argv._[0]);
    var from = new RegExp(argv._[1], 'g');
    var to = argv._[2];
    var filter = argv.i;
    var verbose = argv.v;
    var enc = argv.e;
    //console.dir(argv);

    return {
        dir : dir,
        from: from,
        to: to,
        enc: enc,
        verbose: verbose,
        filter: filter
    };
};



// Walk the tree and look for files to process
//


var replace = function(dir, fileFilter, searchPattern, replaceStr, fileEncoding, callback) {
    if(typeof fileEncoding === 'undefined') fileEncoding = 'utf8';

    filewalker(dir)
        .on('file', function(p, s) {
            if(typeof this.matches === 'undefined') this.matches = 0;
            if(minimatch(path.basename(p), fileFilter)) {
                log('MATCH file: '+ p +' ['+ (s.size/1024).toFixed(2)+' Kb]');
                this.matches++;
                readReplaceWrite(p, searchPattern, replaceStr, fileEncoding, errorHandler);
            }
        })
        .on('error', function(err) {
            exit("ERROR! Exiting due to: "+err);
        })
        .on('done', function() {
            log('Processed total of '+this.dirs + ' dirs, '+ this.files +' files. Matched '+this.matches+' files');
            if(typeof callback === 'function') callback(this.matches);
        })
        .walk();

};

if(runningAsScript) {

    // Check for mandatory input or exit
    //
    process.argv.length < 3 ? exit("Use: node replace.js [-v -e <charEncoding> ] -i <fileMatchPattern> startDir searchPattern replaceString") : log("Processing dir tree" );


    var args = parseCommandLineArgs(process.argv);
    verbose = args.verbose;

    replace(args.dir, args.filter, args.from, args.to, args.enc);

}


module.exports = replace;