#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    astdiff = require('./astdiff'),
    shell = require('shelljs'),
    astii = require('commander');

astii
    .version('0.0.1');

astii
    .command('patch <file1> <patchfile>')
    .description('apply an astii-generated diff file to an original in an AST-aware way')
    .action(function(file1, patchfile) {
        console.log(file1 + ' ' + patchfile);
        var source1 = fs.readFileSync(file1);
        var patch = fs.readFileSync(patchfile).toString();
        console.log(astdiff.patch(source1, patch));
    });

astii
    .command('diff <file1> <file2>')
    .description('compare AST-neutral representations of two JavaScript files line by line')
    .action(function(file1, file2) {
        console.log(file1 + ' ' + file2);
        var source1 = fs.readFileSync(file1);
        var source2 = fs.readFileSync(file2);
        console.log(astdiff.diff(source1, source2));
    });

astii
    .command('git-diff <file1> <SHA>')
    .description('compare AST-neutral representations of a JavaScript files against its specified git revision')
    .action(function(file1, SHA) {
        var source1 = fs.readFileSync(file1);
        var source2 = getFileForSha(file1, SHA);
        console.log(astdiff.diff(source1, source2, file1));
    });

astii
    .command('git-diff-version <file1> <SHA1> <SHA2>')
    .description('compare AST-neutral representations of a JavaScript file between two git revisions')
    .action(function(file1, SHA1, SHA2) {
        var source1 = getFileForSha(file1, SHA1);
        var source2 = getFileForSha(file1, SHA2);
        console.log(astdiff.diff(source1, source2, file1));
    });

var getFileForSha = function(filename, sha) {
    checkGit();
    return shell.exec('git show  ' + sha + ':' + filename, {
        silent: true
    }).output;
};

var checkGit = function() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this command requires git');
        shell.exit(1);
    }
};

astii.parse(process.argv);
