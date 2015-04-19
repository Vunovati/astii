'use strict';

var estraverse = require('estraverse');

var smallestScope;
var path = [];

var enterScope = function(changeLoc) {
    return function enter(node, parent) {
        if (createsNewScope(node) && containsEntireChange(changeLoc)(node)) {
            smallestScope = node;
        }
    };
};

var leaveScope = function(changeLoc) {
    return function leave(node, parent) {
    };
};

function createsNewScope(node) {
    return node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'Program';
}

function containsEntireChange(changeLoc) {
    return function(node) {
        return (node.loc.start.line <= changeLoc.start.line) &&
            (node.loc.end.line >= changeLoc.end.line);
    };
}

var getChangedScopeNode = function(ast, changeLoc) {
    estraverse.traverse(ast, {
        enter: enterScope(changeLoc),
        leave: leaveScope(changeLoc)
    });

    return smallestScope;
};

module.exports = {
    getChangedNode: getChangedScopeNode
};
