define(function () {
    
    let nextUid = 100,
        nextGid = 100;

    function Group(name, gid) {
        this.name = name;
        this.gid = gid || nextGid++;
    }

    function User(name, details = {}) {
        this.name = name;
        this.shell = details.shell;
        this.home = details.home || '/home/' + name;
        this.uid = details.uid || nextUid++;
        this.group = details.group || new Group(this.name);
    }
    
    function addUser(users, name, details) {
        if (users.has(name)) {
            throw new Error(`User ${name} exists already`);
        }
        let user = new User(name, details);
        users.set(name, user);
        return user;
    }
    
    function removeUser(users, name) {
        if (!users.delete(name)) {
            throw new Error(`User ${name} doesn't exist`);
        }
    }
    
    return function () {
        var users = new Map();
        this.root = new User('root', { shell: '/bin/bash', home: '/root', uid: '0', group: new Group('0', 'root')}); 
        this.addUser = addUser.bind(null, users);
        this.removeUser = removeUser.bind(null, users);
    };
    
});