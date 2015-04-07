#!/usr/bin/env node

'use strict';

require('colors');
var fs = require('fs'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    jsdiff = require('diff');

var filename1 = process.argv[2];
var filename2 = process.argv[3];
var outputFormat = process.argv[4];

var ast1 = esprima.parse(fs.readFileSync(filename1));
var ast2 = esprima.parse(fs.readFileSync(filename2));

var format1,
    format2,
    diff;

var printColoredDiffs = function(diff) {
    diff.forEach(function(part) {
        var color = part.added ? 'green' :
            part.removed ? 'red' : undefined;
        if (color) {
            console.log(part.value[color]);
        } else {
            console.log(part.value);
        }
    });
};

var printRegion = function(region, prefix) {
    region.split("\n").forEach(function(line) {
        console.log(prefix + line);
    });
};

format1 = escodegen.generate(ast1);
format2 = escodegen.generate(ast2);
diff = jsdiff.diffLines(format2, format1);
if (outputFormat === '--human') {
    printColoredDiffs(diff);
} else if (outputFormat === '--color') {
    console.log('--- a/' + filename1);
    console.log('+++ b/' + filename2);
    diff.forEach(function(part) {
        if (part.added) {
            printRegion(part.value, '-');
        } else if (part.removed) {
            printRegion(part.value, '+');
        }
    });
} else {
    console.log(jsdiff.createPatch(filename1, format1, format2));
}
