(function (j$) {
    'use strict';
    
    function getRights() {
        var mask = j$.context ? j$.context.umask : '022';
        return parseInt('777', 8) - parseInt(mask, 8);
    }
    
    function FileSystemObject(name, parent, user) {
        this.name = name;
        this.parent = parent;
        this.inode = 0;
        this.user = user;
        this.group = user.group;
        this.rights = getRights();
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

    function getFs() {
        return {
            root: j$.fs.root || new Directory('/', null, j$.auth.root),

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

            rm: function (name, parent, user) {
                delete parent.content[name];
            },

            parsePath: function (path) {
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
            },

            get: function (path, forgiving) {
                var file, index,
                    dirs = this.parsePath(path);

                if (dirs && dirs[0] === '/') {
                    file = this.root;
                    index = 1;
                } else {
                    file = j$.context.directory;
                    index = 0;
                }

                while (index < dirs.length && file) {
                    file = file.getChild(dirs[index]);
                    index++;
                }
                if (!forgiving && !file) {
                    throw new Error(path + ': No such file or directory');
                }
                return file;
            }
        };
    }

    function addDir(parent, names, user) {
        var i;
        for (i = 0; i < names.length; i++) {
            j$.fs.mkdir(names[i], parent, user);
        }
    }

    function createFiles() {
        var rootUser = j$.auth.root;
        if (j$.fs.root.isEmpty()) {
            addDir(j$.fs.root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'sbin', 'tmp', 'usr', 'var'], rootUser);
            addDir(j$.fs.get('/usr'), ['bin', 'sbin', 'local'], rootUser);
            addDir(j$.fs.get('/usr/local'), ['bin'], rootUser);
        }
    }

    j$.init = j$.init || {};
    j$.init.fs = function () {
        j$.init.auth();
        j$.fs = j$.fs || {};
        j$.fs = getFs();
        createFiles();
    }


}(window.j$ = window.j$ || {}));