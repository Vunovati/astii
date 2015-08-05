var should = require('chai').should(),
    astdiff = require('../astdiff'),
    diff = astdiff.diff,
    patch = astdiff.patch,
    patchPreserve = astdiff.patchPreserve,
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

describe('#patchPreserve', function() {
    it('returns a very simple patched file, preserving the untouched scopes', function() {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/example1-comments.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/example1-comments-patched-with2.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/expected1-2.diff')).toString();

        var result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });

    it('returns a patched file with multiple functions, preserving the untouched scopes', function() {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/functions1.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/functions-target.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/functions.diff')).toString();

        var result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });

    it('returns a patched file with multiple changes in multiple functions, preserving the untouched scopes', function() {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/functions1.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/functions-target-multiple-changes.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/astraverse/functions-multiple-changes.diff')).toString();

        var result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });

    it('changes the entire scope when multiple assignment is encountered', function() {
        var jsFile1 = fs.readFileSync(path.join(exports.testDir, 'test_files/singleAssignment.js')),
            generatedFile = fs.readFileSync(path.join(exports.testDir, 'test_files/multipleAssignment.js')),
            diff = fs.readFileSync(path.join(exports.testDir, 'test_files/assignments.diff')).toString();

        var result = patchPreserve(jsFile1, diff);

        result.should.equal(generatedFile.toString());
    });
});
