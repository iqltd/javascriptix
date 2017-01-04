(function (j$) {
    
    function FileSystemObject(name, parent, user) {
        this.name = name;
        this.parent = parent;
        this.inode = 0;
        this.user = user;
        this.group = user.group;
        this.isRoot = this.parent === null;
        this.path = function () {
            if (this.isRoot) {
                return '/';
            }
            var ending = (this.isDirectory) ? '/' : '';

            return this.parent.path() + this.name + ending;
        };
    }

    function File(name, parent, user) {
        this.base = FileSystemObject;
        this.base(name, parent, user);
        this.content = '';
        this.append = function (text) {
            this.content += text;
        };
        this.overwrite = function (text) {
            this.content = text;
        };
        this.execute = function (args) {
            if (this.content instanceof Function) {
                return this.content(args);
            } else {
                j$.bash(this.content);
            }
        };
    }

    function Directory(name, parent, user) {
        this.base = FileSystemObject;
        this.base(name, parent, user);
        this.content = {};
        this.content['.'] = this;
        this.content['..'] = parent;
        this.isDirectory = true;
        this.isEmpty = function () {
            return Object.keys(this.content).length === 2;
        };
        this.getChild = function (name) {
            return this.content[name];
        };
        this.list = function () {
            var file, files = [];
            for (file in this.content) {
                if (this.content.hasOwnProperty(file)) {
                    files.push(file);
                }
            }
            return files;
        };
    }
    
    function mkdir(name, parent, user) {
        let newDir = new Directory(name, parent, user);
        if (parent) {
            parent.content[name] = newDir;
        }
        return newDir;
    }
    
    function touch(name, parent, user, content) {
        var newFile = new File(name, parent, user);
        newFile.content = content;
        parent.content[name] = newFile;
        return newFile;
    }
    
    function rm(name, parent, user) {
        delete parent.content[name];
    }
    
    function parsePath(path) {
        var index = 0,
            startingIndex = 0,
            files = [];
        path = path.trim();
        if (path.charAt(0) === '/') {
            files.push('/');
        }

        while (index < path.length) {
            index = path.indexOf('/', startingIndex);
            index = index === -1 ? path.length : index;
            if (index - startingIndex > 0) {
                files.push(path.substring(startingIndex, index));
            }
            startingIndex = index + 1;
        }
        return files;
    }
    
    function get(path, workingDir, root) {
        var file, index,
            dirs = parsePath(path);

        if (dirs && dirs[0] === '/') {
            file = root;
            index = 1;
        } else {
            file = workingDir;
            index = 0;
        }

        while (index < dirs.length && file) {
            file = file.getChild(dirs[index]);
            index++;
        }
        return file;
    }

    function addDirs(parent, names) {
        names.forEach(el => mkdir(el, parent, 0));
    }
    
    function Fs() {
        let root = new Directory('/', null, 0);
        this.root = root;
        this.mkdir = mkdir;
        this.touch = touch;
        this.rm = rm;
        this.get = (path, workingDir) => get(path, workingDir, root);
        this.parsePath = parsePath;
        
        addDirs(root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'sbin', 'tmp', 'usr', 'var']);
        addDirs(this.get('/usr'), ['bin', 'sbin', 'local']);
        addDirs(this.get('/usr/local'), ['bin']);
    }
    
    j$.__Fs = Fs;

}(window.j$ = window.j$ || {}));