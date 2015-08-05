var a = 1, b = 5; // a and b are in the global scope
function f(){
    var d;
    (function g() {
        var d = 'yo yo man';
    }());
}
