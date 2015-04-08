#!/usr/bin/env node

'use strict';

require('colors');
require('shelljs/global');
var fs = require('fs'),
    astdiff = require('./astdiff');

var command = process.argv[2];
var arg2 = process.argv[3];
var arg3 = process.argv[4];
var arg4 = process.argv[5];


var checkGit = function() {
    if (!which('git')) {
        echo('Sorry, this script requires git');
        exit(1);
    }
};

var getFileForSha = function(filename, sha) {
    return exec('git show  ' + sha + ':' + filename, {
        silent: true
    }).output;
};

if (command === 'patch') {
    var source1 = fs.readFileSync(arg2);
    var patch = fs.readFileSync(arg3).toString();
    console.log(astdiff.patch(source1, patch));
} else if (command === 'diff') {
    var source1 = fs.readFileSync(arg2);
    var source2 = fs.readFileSync(arg3);
    console.log(astdiff.diff(source1, source2));
} else if (command === 'git-diff') {
    checkGit();

    var source1 = fs.readFileSync(arg2);
    var sha = arg3;

    var source2 = getFileForSha(arg2, sha);
    console.log(astdiff.diff(source1, source2, arg2));
} else if (command === 'git-diff-version') {
    checkGit();

    var sha1 = arg3;
    var sha2 = arg4;
    var source1 = getFileForSha(arg2, sha1);
    var source2 = getFileForSha(arg2, sha2);
    console.log(astdiff.diff(source1, source2, arg2));
}
