"use strict";

var users = {}, groups = {}, fs = {};

groups = {
    root: {
        gid: 0,
        name: 'root'
    },
    guest: {
        gid: 100,
        name: 'guest'
    }
};

users = {
    root: {
        uid: 0,
        name: 'root',
        group: groups.root,
        shell: "/bin/bash",
        home: "/root"
    },
    guest: {
        uid: 100,
        name: 'guest',
        group: groups.guest,
        shell: "/bin/bash",
        home: "/home/guest"
    }
};

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
    return parsePath(path.substring(1), fs.root, extractChild);
}

function parseRelativePath(path, extractChild) {
    return parsePath(path, workingDirectory, extractChild);
}

function isAbsolute(path) {
    return path.charAt(0) === '/';
}

fs = {
    root: new Directory("", null, users.root),
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
        var extractChild = function (dir, name) { return dir.content[name]; };
        return isAbsolute(path) ? parseAbsolutePath(path, extractChild) : parseRelativePath(path, extractChild);
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
