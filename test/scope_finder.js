var should = require('chai').should(),
    esprima = require('esprima'),
    scopeFinder = require('../scope_finder'),
    getChangedNode = scopeFinder.getChangedNode,
    fs = require('fs'),
    path = require('path');

var escodegen = require('escodegen');

exports.testDir = path.dirname(__filename);

describe('#getChangedScopeLocation', function() {
    it('an array of steps requred to reach the root node of the changed scope', function() {
        var testFile = fs.readFileSync(path.join(exports.testDir, 'test_files/testScope1.js'));

        var ast = esprima.parse(testFile, {
            loc: true,
            source: 'test_files/testScope1.js'
        });

        var result = getChangedNode(ast, {
            start: {
                line: 5,
                column: 3
            },
            end: {
                line: 6,
                column: 3
            }
        });

        var scope = result;
        var range = scope.loc;


        var output = escodegen.generate(scope, {
            sourceMap: true, // Settings source in esprima's options gives us
            // filenames already.
            sourceMapWithCode: true, // Get both code and source map
            sourceContent: testFile
        });

        console.log(output.code.toString());

        JSON.stringify(range).should.equal(JSON.stringify({
            start: {
                line: 5,
                column: 3
            },
            end: {
                line: 9,
                column: 3
            },
            source: "test_files/testScope1.js"
        }));
    });
});
