var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');

var source = fs.readFileSync('astdiff.js').toString()

var ast = esprima.parse(source, {
  loc: true,
  source: 'astdiff.js'
});

var output = escodegen.generate(ast, {
  sourceMap: true, // Settings source in esprima's options gives us
                   // filenames already.
  sourceMapWithCode: true,  // Get both code and source map
  sourceContent: source
});

console.log(JSON.stringify(output.map._mappings))
