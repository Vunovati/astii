'use strict';
var esprima = require('esprima'),
    escodegen = require('escodegen'),
    jsdiff = require('diff');
var getDiff = function(file1, file2, fileName) {
    var ast1 = esprima.parse(file1);
    var ast2 = esprima.parse(file2);
    var format1, format2, diff;
    format1 = escodegen.generate(ast1);
    format2 = escodegen.generate(ast2);
    diff = jsdiff.diffLines(format2, format1);
    var patch = jsdiff.createPatch(fileName, format1, format2);
    return patch;
};
var applyPatch = function(file1, diff) {
    var format1;
    var ast1 = esprima.parse(file1);
    format1 = escodegen.generate(ast1);
    var patched = jsdiff.applyPatch(format1, diff);
    return patched + '\n';
};
module.exports = {
    diff: getDiff,
    patch: applyPatch
};
