var assert = require('assert');
var os = require('os');
var fs = require('fs');
var path = require('path');
var rmDir = require('rimraf').sync;

// Our lib under test
var replace = require('../replace.js');

var tmpDir = os.tmpdir();
var testDirsNames = ['replace-js', 'a', 'b', 'c'];
var testDirBase = tmpDir + testDirsNames[0];
var testDirs = [];
var testData = "This is some multi-line text.\nWritten By Anders Weijnitxz\n";

describe('End-to-end functionality - ', function () {

    beforeEach(function () {
        //console.log("SETUP. Creating test data in dir: "+ (tmpDir + testDirsNames[0]));
        var lastPath = tmpDir;
        testDirsNames.forEach(function (subDirName) {

            var fullPath = lastPath + subDirName + path.sep;
            fs.mkdirSync(fullPath);
            testDirs.push(fullPath);
            lastPath = fullPath;

            fs.writeFileSync(fullPath + 'testfile.txt', testData);
            fs.writeFileSync(fullPath + 'testfile.tst', testData);

            //console.log("\tCreated dir: "+fullPath);
        });
    });

    afterEach(function () {
        rmDir(testDirBase);
    });


    it('Should replace text in matched files.', function (done) {

        // Traverse and expect four files to be matched

        replace(testDirBase, '*txt', new RegExp('Weijnitxz', 'g'), 'Weijnitz', 'utf8', function (matches) {
            assert(matches === testDirsNames.length); // One file per dir, so same amount files as dirs expected
            done();
        });

    });


    it('Should preserve text in un-matched files.', function () {

        // Traverse and then make sure an un-matched file is intact

        replace(testDirBase, '*txt', new RegExp('Weijnitxz', 'g'), 'Weijnitz', 'utf8', function (matches) {
            var data = fs.readFileSync(testDirBase + 'testfile.tst', { encoding: 'utf8'});
            var r = new RegExp('Weijnitxz', 'g');
            assert(r.test(data));
            done();
        });

    });

});