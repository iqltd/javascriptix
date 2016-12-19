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
    
    function getArgument(args, index) {
        if (args.length < index + 1) {
            throw new Error('missing operand');
        }
        return args[index];
    }
    
    function prepareCreation(path, type) {
        var creation = {}, dirs;
        dirs = j$.fs.parsePath(path);
        creation.filename = dirs.pop();
        creation.parent = dirs ? j$.fs.get(dirs.join('/')) : j$.context.directory;
        if (!parent) {
            throw new Error("cannot create " + type + " '" + path + "': No such file or directory");
        }
        return creation;
    }

    function makeDirectory(args) {
        var creation, path = getArgument(args, 1);
        if (j$.fs.get(path, true)) {
            throw new Error("cannot create directory '" + path + "': File exists");
        }
        creation = prepareCreation(path, 'directory');
        j$.fs.mkdir(creation.filename, creation.parent, j$.context.user);
    }
    
    function touch(args) {
        var creation = prepareCreation(getArgument(args, 1), 'file');
        j$.fs.touch(creation.filename, creation.parent, j$.context.user);
    }

    function clear(args) {
        j$.terminal.init();
    }

    j$.initBins = function () {
        j$.fs.touch('pwd', j$.fs.get('/bin'), j$.users.root, printWorkingDirectory);
        j$.fs.touch('ls', j$.fs.get('/bin'), j$.users.root, listFiles);
        j$.fs.touch('mkdir', j$.fs.get('/bin'), j$.users.root, makeDirectory);
        j$.fs.touch('touch', j$.fs.get('/bin'), j$.users.root, touch);
        j$.fs.touch('whoami', j$.fs.get('/usr/bin'), j$.users.root, whoAmI);
        j$.fs.touch('clear', j$.fs.get('/usr/bin'), j$.users.root, clear);
    };
    
}(window.j$ = window.j$ || {}));