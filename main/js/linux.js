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
    home: "/home/user"
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

fs = {
    root: new Directory("/", null, users.root),
    mkdir: function (parent, name, user) {
        parent.content[name] = new Directory(name, parent, user);
    }
};

(function () {
    var addDir = function (parent, names, user) {
        for (var i = 0; i < names.length; i++) {
            fs.mkdir(parent, names[i], user);
        }
    };
    addDir(fs.root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'tmp', 'usr', 'var'], users.root);
    addDir(fs.root.getChild('home'), ['guest'], users.guest);
}());
