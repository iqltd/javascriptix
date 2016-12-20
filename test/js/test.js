window.onload = function () {
    "use strict";
    
    var testSuites = window.t$.testSuites || [];

    window.t$.init();
    window.t$.runTestStuites(testSuites);
};


