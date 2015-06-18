'use strict';

var patchSource = require('./source_replacer').patchSource;

var isLiteral = function(element) {
    return Object(element) !== element;
};

var performOnParallellTraverse = function(action) {
    var parallellTraverse = function parallellTraverse(actual, expected, actualParent, expectedParent) {
        var attr;

        // Literal values
        if (isLiteral(actual)) {
            if (actual !== expected) {
                action(actualParent, expectedParent);
            }
            return;
        }

        // Arrays
        if (Array.isArray(actual)) {
            if (actual.length !== expected.length) {
                action(actualParent, expectedParent);
            } else {
                actual.forEach(function(_, i) {
                    parallellTraverse(actual[i], expected[i], actual, expected);
                });
                return;
            }
        }

        for (attr in actual) {
            if (attr !== 'type' && attr !== 'loc' && attr !== 'raw' && actual.hasOwnProperty(attr) && expected.hasOwnProperty(attr)) {
                if (expected && attr in expected) {
                    parallellTraverse(actual[attr], expected[attr], actual, expected);
                } else {
                    action(actual, expected);
                }
            }
        }
    };

    return parallellTraverse;
};

var equalizeTrees = function(patchedTree, originalTree) {
    var sourceCode = originalTree.loc.source;

    var replaceOriginalSourceWithPatch = function(a, b) {
        console.log('should replace content ' + JSON.stringify(b.loc) + ' from original file with ' + JSON.stringify(a.loc) + ' from changed file');
        sourceCode = patchSource(a.loc, b.loc, sourceCode);
    };

    performOnParallellTraverse(replaceOriginalSourceWithPatch)(patchedTree, originalTree);

    return sourceCode;
};

module.exports = {
    equalizeTrees: equalizeTrees
};
