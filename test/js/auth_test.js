(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let auth = {};

    t$.testSuites.push({
        name: 'auth - addUser',
        tests: {
            addUser_nonExisting_userAdded: function (sys) {
                let user = sys.auth.addUser('existing');
                t$.assertTrue(user);
            },

            addUser_existing_error: function (sys) {
                sys.auth.addUser('existing');
                t$.assertErrorThrown(auth.addUser, 'existing');
            }
        }
    });

}(window.t$ = window.t$ || {}));
