'use strict';

var patchSource = require('./source_replacer').patchSource;

function isLiteral(element) {
    return Object(element) !== element;
}

function performOnParallellTraverse(action) {
    var parallelTraverse = function parallellTraverse(actual, expected, actualLastFunctionScope, expectedLastFunctionScope) {
        var attr;

        function shouldBeChecked(attr) {
            return attr !== 'type' && attr !== 'loc' && attr !== 'raw' && actual.hasOwnProperty(attr) && expected.hasOwnProperty(attr);
        }

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
                actual.forEach(function (_, i) {
                    parallellTraverse(actual[i], expected[i], actualLastFunctionScope, expectedLastFunctionScope);
                });
                return;
            }
        }

        for (attr in actual) {
            if (shouldBeChecked(attr)) {
                if (expected && attr in expected) {
                    parallellTraverse(actual[attr], expected[attr], actualLastFunctionScope, expectedLastFunctionScope);
                }
            }
        }
    };

    return parallelTraverse;
}

function equalizeTrees(patchedTree, sourceCode, createAst) {
    var treesAreDifferent = true,
        originalTree = createAst(sourceCode);

    function replaceOriginalSourceWithPatch(a, b) {
        var sourceToBePatched = b.loc.source,
            sourceCode = patchSource(a.loc, b.loc, sourceToBePatched),
            patchedAST = createAst(sourceCode);

        throw patchedAST;
    }

    while (treesAreDifferent) {
        try {
            performOnParallellTraverse(replaceOriginalSourceWithPatch)(patchedTree, originalTree, patchedTree, originalTree);
            treesAreDifferent = false;
        } catch (replacedTree) {
            originalTree = replacedTree;
        }
    }

    return originalTree.loc.source;
}

module.exports = {
    equalizeTrees: equalizeTrees
};
