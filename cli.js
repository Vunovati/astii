#!/usr/bin/env node

'use strict';

require('colors');
var fs = require('fs'),
    astdiff = require('./astdiff');

var command = process.argv[2];
var filename1 = process.argv[3];
var filename2 = process.argv[4];

if (command === 'patch') {
    var source1 = fs.readFileSync(filename1);
    var patch = fs.readFileSync(filename2).toString();
    console.log(astdiff.patch(source1, patch));
} else if (command === 'diff') {
    var source1 = fs.readFileSync(filename1);
    var source2 = fs.readFileSync(filename2);
    console.log(astdiff.diff(source1, source2));
}
