#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    astdiff = require('./astdiff'),
    shell = require('shelljs'),
    astii = require('commander');

astii
    .version('0.1.0');

astii
    .command('patchSafe <file1> <patchfile>')
    .description('apply an astii-generated diff file to an original in an AST-aware way, losing original formatting, safer')
    .action(function (file1, patchfile) {
        var source1 = fs.readFileSync(file1),
            patch = fs.readFileSync(patchfile).toString();
        console.log(astdiff.patch(source1, patch));
    });
astii
    .command('patch <file1> <patchfile>')
    .description('apply an astii-generated diff file to an original in an AST-aware way, preserving original formatting')
    .action(function (file1, patchfile) {
        var source1 = fs.readFileSync(file1),
            patch = fs.readFileSync(patchfile).toString();
        console.log(astdiff.patchPreserve(source1, patch));
    });
astii
    .command('diff <file1> <file2>')
    .description('compare AST-neutral representations of two JavaScript files line by line')
    .action(function (file1, file2) {
        var source1 = fs.readFileSync(file1),
            source2 = fs.readFileSync(file2);
        try {
            console.log(astdiff.diff(source1, source2));
        } catch (e) {
            shell.echo(e);
            shell.exit(1);
        }

    });

astii
    .command('git-diff <file1> <SHA>')
    .description('compare AST-neutral representations of a JavaScript files against its specified git revision')
    .action(function (file1, SHA) {
        var source1 = fs.readFileSync(file1),
            source2 = getFileForSha(file1, SHA);
        try {
            console.log(astdiff.diff(source1, source2, file1));
        } catch (e) {
            shell.echo(e);
            shell.exit(1);
        }
    });

astii
    .command('git-diff-version <file1> <SHA1> <SHA2>')
    .description('compare AST-neutral representations of a JavaScript file between two git revisions')
    .action(function (file1, SHA1, SHA2) {
        var source1 = getFileForSha(file1, SHA1),
            source2 = getFileForSha(file1, SHA2);
        try {
            console.log(astdiff.diff(source1, source2, file1));
        } catch (e) {
            shell.echo(e);
            shell.exit(1);
        }
    });

function getFileForSha(filename, sha) {
    var command;
    checkGit();

    command = shell.exec('git show  ' + sha + ':' + filename, {
        silent: true
    });

    if (command.code !== 0) {
        shell.echo('Could not find file for this revision: ' + command.output);
        shell.exit(1);
    }

    return command.output;
}

function checkGit() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this command requires git');
        shell.exit(1);
    }
}

astii.parse(process.argv);
