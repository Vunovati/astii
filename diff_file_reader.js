'use strict';

var parseDiff = require('diff-parse');

var getChangedLines = function(diff) {
    var diffFile = parseDiff(diff)[0];

    // incorrect, need to find another way to extract affected lines
    var chunk = diffFile.lines.filter(function(line) {
        return line.type === 'chunk';
    }).map(function(diffLine) {
        return diffLine.content;
    });

    return linesAffectedByDiff;
};

module.exports = {
    //get the smallest node which contains all the lines
    getChangedLines: getChangedLines
};
