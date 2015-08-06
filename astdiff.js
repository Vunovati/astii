'use strict';
var esprima = require('esprima'),
    escodegen = require('escodegen'),
    jsdiff = require('diff'),
    astraverse = require('./astraverse');

function getTree(sourceCode) {
    var tree;

    try {
        tree = esprima.parse(sourceCode);
    } catch (e) {
        throw 'unable to parse ' + sourceCode;
    }

    return tree;
}

function getDiff(file1, file2) {
    var ast1,
        ast2,
        format1,
        format2,
        diff,
        patch;

    ast1 = getTree(file1);
    ast2 = getTree(file2);
    format1 = escodegen.generate(ast1);
    format2 = escodegen.generate(ast2);
    diff = jsdiff.diffLines(format2, format1);
    patch = jsdiff.createPatch(undefined, format1, format2);
    return patch;
}

function applyPatch(file1, diff) {
    var format1,
        ast1,
        patched;

    ast1 = getTree(file1);
    format1 = escodegen.generate(ast1);
    patched = jsdiff.applyPatch(format1, diff);
    return patched + '\n';
}

function applyPatchPreserve(sourceCode, diff) {
    var astOfOriginalFile,
        regeneratedOriginalFile,
        patched,
        astOfPatchedFile;

    function createAstWithSourceMap(source) {
        return esprima.parse(source, {
            loc: true,
            source: source.toString()
        });
    }

    astOfOriginalFile = createAstWithSourceMap(sourceCode);
    regeneratedOriginalFile = escodegen.generate(astOfOriginalFile, {
        sourceMapWithCode: true,
        sourceContent: sourceCode.toString()
    });
    patched = jsdiff.applyPatch(regeneratedOriginalFile.code, diff);
    astOfPatchedFile = esprima.parse(patched, {
        loc: true,
        source: patched
    });

    return astraverse.equalizeTrees(astOfPatchedFile, sourceCode, createAstWithSourceMap);
}

module.exports = {
    diff: getDiff,
    patch: applyPatch,
    patchPreserve: applyPatchPreserve
};
