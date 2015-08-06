'use strict';
var esprima = require('esprima'),
    escodegen = require('escodegen'),
    jsdiff = require('diff'),
    astraverse = require('./astraverse');

function getDiff(file1, file2) {
    var ast1,
        ast2,
        format1,
        format2,
        diff,
        patch;

    try {
        ast1 = esprima.parse(file1);
    } catch (e) {
        throw 'unable to parse ' + file1;
    }
    try {
        ast2 = esprima.parse(file2);
    } catch (e) {
        throw 'unable to parse ' + file2;
    }
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

    ast1 = esprima.parse(file1);
    format1 = escodegen.generate(ast1);
    patched = jsdiff.applyPatch(format1, diff);
    return patched + '\n';
}

function applyPatchPreserve(sourceCode, diff) {
    var astOfOriginalFile,
        regeneratedOriginalFile,
        patched,
        astOfPatchedFile;

    function createAst(source) {
        return esprima.parse(source, {
            loc: true,
            source: source.toString()
        });
    }

    astOfOriginalFile = createAst(sourceCode);
    regeneratedOriginalFile = escodegen.generate(astOfOriginalFile, {
        sourceMapWithCode: true,
        sourceContent: sourceCode.toString()
    });
    patched = jsdiff.applyPatch(regeneratedOriginalFile.code, diff);
    astOfPatchedFile = esprima.parse(patched, {
        loc: true,
        source: patched
    });

    return astraverse.equalizeTrees(astOfPatchedFile, sourceCode, createAst);
}

module.exports = {
    diff: getDiff,
    patch: applyPatch,
    patchPreserve: applyPatchPreserve
};
