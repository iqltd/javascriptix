define(['test/tools'], function (t) {

    return [{
        name: 'auth - addUser',
        tests: {
            addUser_nonExisting_userAdded: function (sys) {
                let user = sys.auth.addUser('existing');
                t.assertTrue(user);
            },

            addUser_existing_error: function (sys) {
                sys.auth.addUser('existing');
                t.assertErrorThrown(sys.auth.addUser, 'existing');
            }
        }
    }];

});
