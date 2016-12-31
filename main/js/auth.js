(function (j$) {

    function Group(name, gid) {
        this.name = name;
        this.gid = gid || Group.nextGid++;
    }
    Group.nextGid = 100;

    function User(name, shell, home, uid, group) {
        this.name = name;
        this.shell = shell;
        this.home = home || '/home/' + name;
        this.uid = uid || User.nextUid++;
        this.group = group || new Group(this.name);
    }
    User.nextUid = 100;

    let root = new User('root', '/bin/bash', '/root', '0', new Group('0', 'root')); 
    
    function addUser(name, shell, home, uid) {
        if (users.has(name)) {
            throw new Error('existing user');
        }
        let user = new User(name, shell, home, uid);
        users.set(name, user);
        return user;
    }
        
    let users = new Map();
    
    j$.init = j$.init || {};
    j$.init.auth = function () {
        j$.auth = {};
        j$.auth.root = root;
        j$.auth.addUser = addUser;
        
        if (arguments[0] === 'test') {
            console.warn('j$.auth test initialization was requested.');
            return { users: users };
        }
    };

}(window.j$ = window.j$ || {}));