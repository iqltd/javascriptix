(function (j$) {
    
    function bins(customFs, customAuth, customContext) {
        [fs, auth, context] = [customFs, customAuth, customContext];
        
        function getArgument(args, index) {
            if (args.length < index + 1) {
                throw new Error('missing operand');
            }
            return args[index];
        }
        
        function prepareCreation(path, type) {
            var creation = {}, dirs;
            dirs = fs.parsePath(path);
            creation.filename = dirs.pop();
            creation.parent = dirs ? fs.get(dirs.join('/')) : context.directory;
            if (!parent) {
                throw new Error("cannot create " + type + " '" + path + "': No such file or directory");
            }
            return creation;
        }
        
        return {
            printWorkingDirectory: function (args) {
                return context.directory.path();
            },
            whoAmI: function (args) {
                return context.user.name;
            },
            clear: function (args) {
                j$.terminal.init();
            },
            listFiles: function (args) {
                var i, files = '', dir;
                if (args.length < 2) {
                    dir = context.directory;
                } else {
                    dir = fs.get(args[1], context.directory);
                }
                dir.list().forEach(function (crt) {
                    if (!crt.startsWith('.')) {
                        files += crt + '\t';
                    }
                });
                return files;
            },
            makeDirectory: function (args) {
                var creation, path = getArgument(args, 1);
                if (fs.get(path, true)) {
                    throw new Error("cannot create directory '" + path + "': File exists");
                }
                creation = prepareCreation(path, 'directory');
                fs.mkdir(creation.filename, creation.parent, context.user);
            },
            touch: function (args) {
                var creation = prepareCreation(getArgument(args, 1), 'file');
                fs.touch(creation.filename, creation.parent, context.user);
            },
            rm: function (args) {
                var path = getArgument(args, 1),
                    file = fs.get(path, context.directory);
                if (!file) {
                    throw new Error("cannot remove '" + path + "': No such file or directory");
                }
                fs.rm(file.name, file.parent, context.user);
            },
            cat: function (args) {
                var path = getArgument(args, 1),
                    file = fs.get(path, context.directory);
                if (!file) {
                    throw new Error(path + ': No such file or directory');
                }
                if (file.isDirectory) {
                    throw new Error(path + ': Is a directory');
                }
                if (file.content instanceof Function) {
                    throw new Error(path + ': Is a binary file');
                }
                return file.content;
            }
        };
    }
    
    function initBins(customAuth = j$.auth, customFs = j$.fs, customContext = j$.context) { 
        let x = bins(customFs, customAuth, customContext);
        let rootUser = customAuth.root;
        let bin = customFs.get('/bin');
        let usrBin = customFs.get('/usr/bin');
        
        fs.touch('pwd', bin, rootUser, x.printWorkingDirectory);
        fs.touch('ls', bin, rootUser, x.listFiles);
        fs.touch('mkdir', bin, rootUser, x.makeDirectory);
        fs.touch('touch', bin, rootUser, x.touch);
        fs.touch('rm', bin, rootUser, x.rm);
        fs.touch('whoami', usrBin, rootUser, x.whoAmI);
        fs.touch('clear', usrBin, rootUser, x.clear);
        fs.touch('cat', bin, rootUser, x.cat);
    }

    j$.__initBins = initBins;
    
}(window.j$ = window.j$ || {}));