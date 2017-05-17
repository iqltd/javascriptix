requirejs.config({
    baseUrl: 'js',
});

requirejs(['javascriptix'], function (j$) {
    j$.init();
});