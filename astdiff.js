#!/usr/bin/env node

'use strict';
require('colors');
var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');
var jsdiff = require('diff');

var filename1 = process.argv[2];
var filename2 = process.argv[3];
var outputFormat = process.argv[4];

var ast1 = esprima.parse(fs.readFileSync(filename1));
var ast2 = esprima.parse(fs.readFileSync(filename2));

var format1,
format2,
diff;

if (outputFormat === '--ast') {
  diff = jsdiff.diffJson(ast1, ast2);
} else {
  format1 = escodegen.generate(ast1);
  format2 = escodegen.generate(ast2);
  diff = jsdiff.diffLines(format1, format2);
}

var printColouredDiffs = function(diff) {
  diff.forEach(function(part){
    var color = part.added ? 'green' :
      part.removed ? 'red' : undefined;
    if (color) {
      console.log(part.value[color]);
    } else {
      console.log(part.value);
    }
  });
};

printColouredDiffs(diff);
