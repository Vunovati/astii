var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect(),
    astdiff = require('../astdiff'),
    diff = astdiff.diff,
    patch = astdiff.patch,
    patchPreserve = astdiff.patchPreserve,
    fs = require('fs'),
    path = require('path');

exports.testDir = path.dirname(__filename);

describe('#diff', function () {
    it('returns a diff', function () {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/diff/example1.js')),
            jsFile2 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/diff/example2.js')),
            expectedDiff = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/diff/expected1-2.diff')).toString(),
            result = diff(jsFile1, jsFile2, 'example1.js');

        result.should.equal(expectedDiff);
    });

    it('throws an exception if the file is not parsable', function () {
        var jsFile1 = 'something that is not a javascript source',
            jsFile2 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/diff/example2.js'));

        (function () {
            diff(jsFile1, jsFile2);
        }).should.throw('unable to parse something that is not a javascript source');
    });
});

describe('#patch', function () {
    it('returns a patched file', function () {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patch/example1.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patch/example2-generated.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patch/expected1-2.diff')).toString(),
            result = patch(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });
});

describe('#patchPreserve', function () {
    it('returns a very simple patched file, preserving the untouched scopes', function () {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/example1-comments.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/example1-comments-patched-with2.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/expected1-2.diff')).toString(),
            result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });

    it('returns a patched file with multiple functions, preserving the untouched scopes', function () {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/functions1.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/functions-target.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/functions.diff')).toString(),
            result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });

    it('returns a patched file with multiple changes in multiple functions, preserving the untouched scopes', function () {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/functions1.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/functions-target-multiple-changes.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/functions-multiple-changes.diff')).toString(),
            result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });

    it('changes the entire scope when multiple assignment is encountered', function () {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/singleAssignment.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/multipleAssignment.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astdiff/patchPreserve/assignments.diff')).toString(),
            result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });
});
