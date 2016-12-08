(function (j$) {
    "use strict";
    
    function printWorkingDirectory(args) {
        return j$.context.directory.path();
    }
    
    function whoAmI(args) {
        return j$.context.user.name;
    }
    
    function listFiles(args) {
        var i, files = '', dir, dirFiles;
        if (args.length < 2) {
            dir = j$.context.directory;
        } else {
            dir = j$.fs.get(args[1]);
        }
        dirFiles = dir.list();
        for (i = 0; i < dirFiles.length; i++) {
            if (dirFiles[i][0] !== '.') {
                files += dirFiles[i] + '\t';
            }
        }
        return files;
    }

    j$.initBins = function () {
        j$.fs.touch('pwd', j$.fs.get('/bin'), j$.users.root, printWorkingDirectory);
        j$.fs.touch('ls', j$.fs.get('/bin'), j$.users.root, listFiles);
        j$.fs.touch('whoami', j$.fs.get('/usr/bin'), j$.users.root, whoAmI);
    };
    
}(window.j$ = window.j$ || {}));