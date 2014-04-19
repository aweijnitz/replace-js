var assert = require('assert');
var os = require('os');
var fs = require('fs');
var path = require('path');
var rmDir = require('rimraf').sync;

var readReplaceWrite = require('../lib/file-processor.js');

var tmpDir = os.tmpdir();
var testDirBase = tmpDir + 'replace-js';
var testData = "This is some multi-line text.\nWritten By Anders Weijnitxz\n";


describe('Test replace in a single file - ', function () {


    beforeEach(function () {
        fs.mkdirSync(testDirBase);
        fs.writeFileSync(testDirBase + path.sep + 'testfile.txt', testData);
    });

    afterEach(function () {
        rmDir(testDirBase);
    });

    it('Should replace text in file', function (done) {
        readReplaceWrite(testDirBase  + path.sep + 'testfile.txt',
            new RegExp('Weijnitxz', 'g'),
            'Weijnitz', 'utf8', function(err, success) {
                var data = fs.readFileSync(testDirBase + path.sep + 'testfile.txt', { encoding : 'utf8'});
                assert(new RegExp('Weijnitz', 'g').test(data));
                done();
            });
    });
});
