(function (j$) {
    
    let users = new Map(),
        nextUid = 100,
        nextGid = 100;

    function Group(name, gid) {
        this.name = name;
        this.gid = gid || nextGid++;
    }

    function User(name, shell, home, uid, group) {
        this.name = name;
        this.shell = shell;
        this.home = home || '/home/' + name;
        this.uid = uid || nextUid++;
        this.group = group || new Group(this.name);
    }
    
    function addUser(users, name, shell, home, uid) {
        if (users.has(name)) {
            throw new Error(`User ${name} exists already`);
        }
        let user = new User(name, shell, home, uid);
        users.set(name, user);
        return user;
    }
    
    function Auth(customUsers = users) {
        this.root = new User('root', '/bin/bash', '/root', '0', new Group('0', 'root')); 
        this.addUser = addUser.bind(null, customUsers);
    }
    
    j$.__Auth = Auth;
    
}(window.j$ = window.j$ || {}));