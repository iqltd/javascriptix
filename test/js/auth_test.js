(function (t$) {
    t$.testSuites = t$.testSuites || [];
    
    let j$ = window.j$;
    
    function getUsers() {
        return j$.init.auth('test').users;
    }
    
    t$.testSuites.push({
        area: "auth",
        name: "j$.auth.addUser",
        addUser_nonExisting_userAdded: function () {
            let users = getUsers();
            users.clear();
            
            let user = j$.auth.addUser('existing');
            t$.assertTrue(user);
            t$.assertTrue(users.has(user.name));
        },
        
        addUser_existing_error: function () {
            let users = getUsers();
            users.clear();
            
            j$.auth.addUser('existing');    
            t$.assertErrorThrown(j$.auth.addUser, 'existing');
        }
    });
    
}(window.t$ = window.t$ || {}));