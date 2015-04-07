var should = require('chai').should(),
    astdiff = require('../astdiff'),
    diff = astdiff.diff,
    patch = astdiff.patch,
    fs = require('fs'),
    path = require('path');

exports.testDir = path.dirname(__filename);

describe('#diff', function() {
    it('returns a diff', function() {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/example1.js')),
            jsFile2 = fs.readFileSync(path.join(exports.testDir, 'test_files/example2.js')),
            expectedDiff = fs.readFileSync(path.join(exports.testDir, 'test_files/expected1-2.diff')).toString();

        var result = diff(jsFile1, jsFile2, 'example1.js');

        result.should.equal(expectedDiff);
    });
});

describe('#patch', function() {
    it('returns a patched file', function() {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/example1.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/example2-generated.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/expected1-2.diff')).toString();

        var result = patch(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });
});
