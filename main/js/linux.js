"use strict";

var users = {}, groups = {}, fs = {};

groups.root = {
    gid: 0,
    name: 'root'
};

users.root = {
    uid: 0,
    name: 'root',
    group: groups.root,
    shell: "/bin/bash",
    home: "/root"
};

groups.guest = {
    gid: 100,
    name: 'guest'
};

users.guest = {
    uid: 100,
    name: 'guest',
    group: groups.guest,
    shell: "/bin/bash",
    home: "/home/guest"
};

var FileType = Object.freeze({FILE: 'f', DIRECTORY: 'd', BLOCK: 'b', CHARACTER: 'c', LINK: 'l'});

function FileSystemObject(name, parent, user) {
    this.name = name;
    this.parent = parent;
    this.inode = 0;
    this.user = user;
    this.group = user.group;
    this.path = function () {
        if (!this.parent) {
            return '/';
        } else if (!this.parent.parent) {
            return '/' + this.name;
        }
        return this.parent.path() + '/' + this.name;
    };
}

function File(name, parent, user) {
    this.base = FileSystemObject;
    this.base(name, parent, user);
    this.type = FileType.FILE;
    this.content = '';
    this.write = function (text, append) {
        if (append) {
            this.content += text;
        } else {
            this.content = text;
        }
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

function parsePath(path) {
    var index, startingIndex, parentDir, dir, crtName;
    
    if (path.charAt(0) === '/') {
        startingIndex = 1;
        parentDir = fs.root;
    } else {
        startingIndex = 0;
        parentDir = workingDirectory;
    }
    
    index = 0;
    while (index < path.length && parentDir) {
        index = path.indexOf('/', startingIndex);
        index = index === -1 ? path.length : index;
        if (index - startingIndex > 0) {
            crtName = path.substring(startingIndex, index);
            dir = parentDir.content[crtName];
            parentDir = dir;
        }
        startingIndex = index + 1;
    }
    if (!dir) {
        throw crtName + ": No such file or directory";
    }
    return dir;
}

fs = {
    root: new Directory("/", null, users.root),
    mkdir: function (parent, name, user) {
        parent.content[name] = new Directory(name, parent, user);
    },
    touch: function (parent, name, user, content) {
        var newFile = new File(parent, name, user);
        newFile.content = content;
        parent.content[name] = newFile;
        return newFile;
    },
    get: function (path) {
        return parsePath(path);
    }
};

function initFs() {
    var i, addDir;
    addDir = function (parent, names, user) {
        for (i = 0; i < names.length; i++) {
            fs.mkdir(parent, names[i], user);
        }
    };
    addDir(fs.root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'tmp', 'usr', 'var'], users.root);
    addDir(fs.get('/home'), ['guest'], users.guest);
}
