var a = 1, b = 2; // a and b are in the global scope
function f(){
  var c;  // c is in the scope of f, 
          // which is a child of the global scope
  (function g(){
    var d = 'yo'; // d is in the scope
                  // of g, 
                  // which is a child of the scope of f
  }());
}
