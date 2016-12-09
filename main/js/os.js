(function (j$) {
    "use strict";
    
    var promptSymbol = "$",
        FileType = Object.freeze({FILE: 'f', DIRECTORY: 'd', BLOCK: 'b', CHARACTER: 'c', LINK: 'l'});

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
    
    function getRights() {
        var mask = j$.context ? j$.context.umask : null;
        if (mask) {
            mask = "022";
        }
        return parseInt("777", 8) - parseInt(mask, 8);
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
        this.type = FileType.FILE;
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
        this.type = FileType.DIRECTORY;
        this.content = {};
        this.content['.'] = this;
        this.content['..'] = parent;
        this.isDirectory = true;
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

    j$.fs = {
        root: new Directory("/", null, j$.users.root),
        
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
        
        isAbsolute: function (path) {
            return path.charAt(0) === '/';
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
                throw new Error(path + ": No such file or directory");
            }
            return file;
        },
        
        initGlobal: function () {
            var i, addDir;
            addDir = function (parent, names, user) {
                for (i = 0; i < names.length; i++) {
                    j$.fs.mkdir(names[i], parent, user);
                }
            };
            addDir(this.root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'sbin', 'tmp', 'usr', 'var'], j$.users.root);
            addDir(this.get('/usr'), ['bin', 'sbin', 'local'], j$.fs.root);
            addDir(this.get('/usr/local'), ['bin'], j$.fs.root);
        },
        
        initLocal: function () {
            this.mkdir('guest', this.get('/home'), j$.context.user);
        }
    };
    
    j$.init = function () {
        j$.fs.initGlobal();
        j$.context = {
            user: j$.users.guest,
            
            env: {
                HOSTNAME: "javascriptix",
                PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            },
            
            umask: "022",
            
            promptString: function () {
                return this.user.name + "@" + this.env.HOSTNAME + " " + promptSymbol + " ";
            }
        };
        j$.initBins();
        j$.fs.initLocal();
        j$.context.directory = j$.fs.get("/home/guest");
    };
}(window.j$ = window.j$ || {}));