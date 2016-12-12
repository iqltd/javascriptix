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

    function makeDirectory(args) {
        var path, dirs, dirname, parent;
        if (args.length < 2) {
            throw new Error('missing operand');
        }
        path = args[1];
        dirs = j$.fs.parsePath(path);
        dirname = dirs.pop();
        if (j$.fs.get(path, true)) {
            throw new Error("cannot create directory '" + dirname + "'. File exists");
        }
        parent = dirs ? j$.fs.get(dirs.join('/')) : j$.context.directory;
        if (!parent) {
            throw new Error("cannot create directory '" + path + "'. No such file or directory");
        }
        j$.fs.mkdir(dirname, parent, j$.context.user);
    }
    
    function touch(args) {
        var path, dirs, filename, parent;
        if (args.length < 2) {
            throw new Error('missing operand');
        }
        path = args[1];
        dirs = j$.fs.parsePath(path);
        filename = dirs.pop();
        if (j$.fs.get(path, true)) {
            throw new Error("cannot create file '" + filename + "'. File exists");
        }
        parent = dirs ? j$.fs.get(dirs.join('/')) : j$.context.directory;
        if (!parent) {
            throw new Error("cannot create file '" + path + "'. No such file or directory");
        }
        j$.fs.touch(filename, parent, j$.context.user);
    }

    j$.initBins = function () {
        j$.fs.touch('pwd', j$.fs.get('/bin'), j$.users.root, printWorkingDirectory);
        j$.fs.touch('ls', j$.fs.get('/bin'), j$.users.root, listFiles);
        j$.fs.touch('mkdir', j$.fs.get('/bin'), j$.users.root, makeDirectory);
        j$.fs.touch('touch', j$.fs.get('/bin'), j$.users.root, touch);
        j$.fs.touch('whoami', j$.fs.get('/usr/bin'), j$.users.root, whoAmI);
    };
    
}(window.j$ = window.j$ || {}));