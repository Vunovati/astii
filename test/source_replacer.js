var should = require('chai').should(),
    sourceReplacer = require('../source_replacer'),
    fs = require('fs'),
    path = require('path');

exports.testDir = path.dirname(__filename);

describe('#patchSource', function() {
    it('returns a patched source', function() {
        var inputSource = 'bla bla \n to_be_replaced \n last line \n';
        var targetSource = 'bla bla \n this_is_replaced \n last line \n';

        var result = sourceReplacer.patchSource({
            source: targetSource,
            start: {
                line: 2,
                column: 1
            },
            end: {
                line: 2,
                column: 16
            }
        }, {
            source: inputSource,
            start: {
                line: 2,
                column: 1
            },
            end: {
                line: 2,
                column: 14
            }
        }, inputSource);

        result.should.equal('bla bla \n this_is_replaced \n last line \n');
    });

    it('returns changed in the middle of the file ', function() {
        var inputSource = '123 \n456 //comments \n789 line \n';
        var targetSource = '123 \n4x6 \n789 line \n';

        var result = sourceReplacer.patchSource({
            source: targetSource,
            start: {
                line: 2,
                column: 1
            },
            end: {
                line: 2,
                column: 2
            }
        }, {
            source: inputSource,
            start: {
                line: 2,
                column: 1
            },
            end: {
                line: 2,
                column: 2
            }
        }, inputSource);

        result.should.equal('123 \n4x6 //comments \n789 line \n');
    });
});
