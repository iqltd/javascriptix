(function (j$) {
    "use strict";

    j$.groups = {
        root: {
            gid: 0,
            name: 'root'
        },
        guest: {
            gid: 100,
            name: 'guest'
        }
    };

    j$.users = {
        root: {
            uid: 0,
            name: 'root',
            group: j$.groups.root,
            shell: "/bin/bash",
            home: "/root"
        },
        guest: {
            uid: 100,
            name: 'guest',
            group: j$.groups.guest,
            shell: "/bin/bash",
            home: "/home/guest"
        }
    };

    function parsePath(path, parentDir, extractChild) {
        var index, startingIndex, dir = parentDir, crtName;

        startingIndex = 0;
        index = 0;
        while (index < path.length && parentDir) {
            index = path.indexOf('/', startingIndex);
            index = index === -1 ? path.length : index;
            if (index - startingIndex > 0) {
                crtName = path.substring(startingIndex, index);
                dir = extractChild(parentDir, crtName);
                parentDir = dir;
            }
            startingIndex = index + 1;
        }

        if (!dir) {
            throw crtName + ": No such file or directory";
        }
        return dir;
    }

    function parseAbsolutePath(path, extractChild) {
        return parsePath(path.substring(1), j$.fs.root, extractChild);
    }

    function parseRelativePath(path, extractChild) {
        return parsePath(path, j$.workingDirectory, extractChild);
    }

    function isAbsolute(path) {
        return path.charAt(0) === '/';
    }
    
    var FileType = Object.freeze({FILE: 'f', DIRECTORY: 'd', BLOCK: 'b', CHARACTER: 'c', LINK: 'l'});
    
    function FileSystemObject(name, parent, user) {
        this.name = name;
        this.parent = parent;
        this.inode = 0;
        this.user = user;
        this.group = user.group;
        this.path = function () {
            var base, ending;
            base = (this.parent) ? this.parent.path() : '';
            ending = (this.type === FileType.DIRECTORY) ? '/' : '';

            return base + this.name + ending;
        };
    }

    function File(name, parent, user) {
        this.base = FileSystemObject;
        this.base(name, parent, user);
        this.type = FileType.FILE;
        this.content = '';
        this.append = function (text) {
            this.content += text;
        };
        this.overwrite = function (text) {
            this.content = text;
        };
    }

    function Directory(name, parent, user) {
        this.base = FileSystemObject;
        this.base(name, parent, user);
        this.type = FileType.DIRECTORY;
        this.content = {};
        this.getChild = function (name) {
            return this.content[name];
        };
    }

    j$.fs = {
        root: new Directory("", null, j$.users.root),
        
        mkdir: function (name, parent, user) {
            var newDir = new Directory(name, parent, user);
            if (parent) {
                parent.content[name] = newDir;
            }
            return newDir;
        },
        
        touch: function (name, parent, user, content) {
            var newFile = new File(name, parent, user);
            newFile.content = content;
            parent.content[name] = newFile;
            return newFile;
        },
        
        get: function (path) {
            var extractChild = function (dir, name) { return dir.content[name]; };
            return isAbsolute(path) ? parseAbsolutePath(path, extractChild) : parseRelativePath(path, extractChild);
        },
        
        init: function () {
            var i, addDir;
            addDir = function (parent, names, user) {
                for (i = 0; i < names.length; i++) {
                    j$.fs.mkdir(names[i], parent, user);
                }
            };
            addDir(this.root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'tmp', 'usr', 'var'], j$.users.root);
            addDir(this.get('/home'), ['guest'], j$.users.guest);
        }
    };
}(window.j$ = window.j$ || {}));