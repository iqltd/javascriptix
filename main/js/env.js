(function (j$) {
    'use strict';

    var promptSymbol = '$';

    function createContext() {
        let user = j$.auth.addUser('guest', '/bin/bash');
        let homeDir = j$.fs.mkdir('guest', j$.fs.get('/home'), user);
        
        let message = 'Welcome to javascriptix, the linux-like terminal in your browser! \n\nWhat\'s funny is that, if you are reading this, then you already know what to do.\n\nHave fun! :)';
        j$.fs.touch('readme', homeDir, user, message);

        return {
            user: user,
            env: {
                HOSTNAME: 'javascriptix',
                PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
            },
            umask: '022',
            directory: j$.fs.get(user.home),

            promptString: function () {
                return user.name + '@' + this.env.HOSTNAME + ' ' + promptSymbol + ' ';
            }
        };
    }

    j$.init = j$.init || {};
    j$.init.env = function () {
        j$.init.auth();
        j$.init.fs();

        j$.context = createContext();
    };

}(window.j$ = window.j$ || {}));