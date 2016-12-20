(function (j$) {
    'use strict';

    var users = {}, auth;

    function Group(name, gid) {
        this.name = name;
        this.gid = gid ? gid : Group.nextGid++;
    }
    Group.nextGid = 100;

    function User(name, shell, home, uid, group) {
        this.name = name;
        this.shell = shell;
        this.home = home ? home : '/home/' + name;
        this.uid = uid ? uid : User.nextUid++;
        this.group = group ? group : new Group(this.name);
    }
    User.nextUid = 100;

    auth = {
        root: new User('root', '/bin/bash', '/root', '0', new Group('0', 'root')),

        addUser: function (name, shell, home, uid) {
            var user;
            if (users[name]) {
                throw new Error('existing user');
            }
            user = new User(name, shell, home, uid);
            users[name] = user;
            return user;
        }
    };

    j$.init = j$.init || {};
    j$.init.auth = function () {
        j$.auth = auth;
    };

}(window.j$ = window.j$ || {}));