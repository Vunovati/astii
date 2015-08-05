'use strict';

function transformToStringIndex(originalSource, line, column) {
    var startLine = line - 1,
        lineStart = 0,
        lineStartIndexes = originalSource.split('\n').map(function (line) {
            return line.length;
        });

    if (startLine > 0) {
        lineStart = lineStartIndexes.slice(0, startLine).reduce(function (a, b) {
            return a + b;
        }) + startLine;
    }

    return lineStart + column;
}

function replaceOnLocations(target, source, originalSource) {
    var loc1 = transformToStringIndex(originalSource, source.start.line, source.start.column),
        loc2 = transformToStringIndex(originalSource, source.end.line, source.end.column),
        loc3 = transformToStringIndex(target.source, target.start.line, target.start.column),
        loc4 = transformToStringIndex(target.source, target.end.line, target.end.column);

    return originalSource.substring(0, loc1) + target.source.substring(loc3, loc4) + originalSource.substring(loc2);
}

module.exports = {
    patchSource: replaceOnLocations
};
