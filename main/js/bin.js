(function (j$) {
    "use strict";
    
    function printWorkingDirectory(args) {
        return j$.context.directory.path();
    }
    
    function whoAmI(args) {
        return j$.context.user.name;
    }

    j$.initBins = function () {
        j$.fs.touch('pwd', j$.fs.get('/bin'), j$.users.root, printWorkingDirectory);
        j$.fs.touch('whoami', j$.fs.get('/usr/bin'), j$.users.root, whoAmI);
    };
    
}(window.j$ = window.j$ || {}));