'use strict';

var getLinesToAdd = function(target) {
    var patchLines = target.source.split('\n');

    var firstLine = target.start.line;
    var firstLineIndex = target.start.column;
    var lastLine = target.end.line;
    var lastLineIndex = target.end.column;

    var linesToInclude = patchLines.slice(firstLine - 1, lastLine);

    linesToInclude[0] = linesToInclude[0].substr(firstLineIndex - 2);
    linesToInclude[linesToInclude.length - 1] = linesToInclude[linesToInclude.length - 1].substr(0, lastLineIndex + 2);

    return linesToInclude;
};

var replaceSourceWithTarget = function(target, source, originalSource) {
    var targetSource = target.source;

    var originalLines = originalSource.split('\n');

    var firstLine = source.start.line;
    var firstLineIndex = source.start.column;
    var lastLine = source.end.line;
    var lastLineIndex = source.end.column;

    debugger
    var linesToAdd = getLinesToAdd(target);
    // we are changing only one line, we need to support the whole range of changes for this to work
    originalLines[firstLine - 1] = originalLines[firstLine - 1].substr(0, firstLineIndex - 2) + linesToAdd[0];

    originalLines[lastLine - 1] = linesToAdd[linesToAdd.length - 1] + originalLines[lastLine - 1].substr(lastLineIndex);

    return originalLines.join('\n');
};

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
    debugger
    var loc1 = transformToStringIndex(originalSource, source.start.line, source.start.column);
    var loc2 = transformToStringIndex(originalSource, source.end.line, source.end.column);
    var loc3 = transformToStringIndex(target.source, target.start.line, target.start.column);
    var loc4 = transformToStringIndex(target.source, target.end.line, target.end.column);
    return originalSource.substring(0, loc1) + target.source.substring(loc3, loc4) + originalSource.substring(loc2);
};

module.exports = {
    patchSource: replaceOnLocations
};
