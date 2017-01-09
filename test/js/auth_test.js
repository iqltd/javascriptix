(function (t$) {
    t$.testSuites = t$.testSuites || [];
    
    let auth = {};
    
    t$.testSuites.push({
        name: "auth - addUser",
        before: function () {
            auth = new window.j$.__Auth();
        },
        tests: {
            addUser_nonExisting_userAdded: function () {
                let user = auth.addUser('existing');
                t$.assertTrue(user);
            },

            addUser_existing_error: function () {
                auth.addUser('existing');    
                t$.assertErrorThrown(auth.addUser, 'existing');
            }
        }
    });
    
}(window.t$ = window.t$ || {}));