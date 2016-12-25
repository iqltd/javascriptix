(function (j$) {
    'use strict';

    var promptSymbol = '$';

    function createContext() {
        var user = j$.auth.addUser('guest', '/bin/bash');
        j$.fs.mkdir('guest', j$.fs.get('/home'), user);

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