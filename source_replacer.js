'use strict';

var transformToStringIndex = function(originalSource, line, column) {
    var lineStartIndexes = originalSource.split('\n').map(function(line) {
        return line.length;
    });

    var startLine = line - 1;
    var lineStart = 0;

    if (startLine > 0) {
        lineStart = lineStartIndexes.slice(0, startLine).reduce(function(a, b) {
            return a + b;
        }) + startLine;
    }

    return lineStart + column;
};

var replaceOnLocations = function(target, source, originalSource) {
    var loc1 = transformToStringIndex(originalSource, source.start.line, source.start.column);
    var loc2 = transformToStringIndex(originalSource, source.end.line, source.end.column);
    var loc3 = transformToStringIndex(target.source, target.start.line, target.start.column);
    var loc4 = transformToStringIndex(target.source, target.end.line, target.end.column);
    return originalSource.substring(0, loc1) + target.source.substring(loc3, loc4) + originalSource.substring(loc2);
};

module.exports = {
    patchSource: replaceOnLocations
};
