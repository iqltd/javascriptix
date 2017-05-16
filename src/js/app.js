requirejs.config({
    baseUrl: 'js',
});

var j$ = {};

requirejs(['terminal', 'bash', 'bin'], function (Terminal, Bash, bins) {
    bins.init(); 
    j$.bash = new Bash();   
    j$.terminal = new Terminal(j$.bash);
});