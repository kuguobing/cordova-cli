var cordova = require('../cordova'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    rmrf = require('rimraf'),
    fs = require('fs'),
    tempDir = path.join(__dirname, '..', 'temp');

describe('create command', function () {
    beforeEach(function() {
        // Make a temp directory
        mkdirp(tempDir);
    });

    afterEach(function() {
        // Delete the temp directory
            rmrf(tempDir, function(){});
    });    

    it('should create a cordova project in the current directory if no parameter is provided', function() {
        var cwd = process.cwd();
        this.after(function() {
            process.chdir(cwd);
        });
        process.chdir(tempDir);
        cordova.create();
        expect(fs.lstatSync(path.join(tempDir, '.cordova')).isDirectory()).toBe(true);
    });
    it('should create a cordova project in the specified directory if parameter is provided', function() {
        cordova.create(tempDir);
        expect(fs.lstatSync(path.join(tempDir, '.cordova')).isDirectory()).toBe(true);
    });
    it('should warn if the directory is already a cordova project', function() {
        spyOn(console, 'error');

        var cb = jasmine.createSpy();

        runs(function () {
            console.log('here?');
            mkdirp(path.join(tempDir, '.cordova'), cb);
            console.log('what about here?');
        });

        waitsFor(function() { return cb.wasCalled; });

        runs(function() {
            cordova.create(tempDir);
            expect(console.error).toHaveBeenCalled();
        });
    });
});
