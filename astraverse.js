'use strict';

var patchSource = require('./source_replacer').patchSource;

var isLiteral = function(element) {
    return Object(element) !== element;
};

var performOnParallellTraverse = function(action) {
    var parallelTraverse = function parallellTraverse(actual, expected, actualLastFunctionScope, expectedLastFunctionScope) {
        var attr;

        if (isLiteral(actual)) {
            if (actual !== expected) {
                action(actualLastFunctionScope, expectedLastFunctionScope);
            }
            return;
        }

        if (actual.type === "BlockStatement") {
            actualLastFunctionScope = actual;
            expectedLastFunctionScope = expected;
        }

        if (Array.isArray(actual)) {
            if (actual.length !== expected.length) {
                action(actualLastFunctionScope, expectedLastFunctionScope);
            } else {
                actual.forEach(function(_, i) {
                    parallellTraverse(actual[i], expected[i], actualLastFunctionScope, expectedLastFunctionScope);
                });
                return;
            }
        }

        for (attr in actual) {
            if (attr !== 'type' && attr !== 'loc' && attr !== 'raw' && actual.hasOwnProperty(attr) && expected.hasOwnProperty(attr)) {
                if (expected && attr in expected) {
                    parallellTraverse(actual[attr], expected[attr], actualLastFunctionScope, expectedLastFunctionScope);
                } else {
                    action(actualLastFunctionScope, expectedLastFunctionScope);
                }
            }
        }
    };

    return parallelTraverse;
};

var equalizeTrees = function(patchedTree, sourceCode, createAst) {
    var treesAreDifferent = true;
    var originalTree = createAst(sourceCode);

    var replaceOriginalSourceWithPatch = function(a, b) {
        var sourceToBePatched = b.loc.source;
        var sourceCode = patchSource(a.loc, b.loc, sourceToBePatched);
        var patchedAST = createAst(sourceCode);

        throw patchedAST;
    };

    while (treesAreDifferent) {
        try {
            performOnParallellTraverse(replaceOriginalSourceWithPatch)(patchedTree, originalTree, patchedTree, originalTree);
            treesAreDifferent = false;
        } catch (replacedTree) {
            originalTree = replacedTree;
        }
    }

    return originalTree.loc.source;
};

module.exports = {
    equalizeTrees: equalizeTrees
};
