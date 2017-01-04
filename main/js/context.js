(function (j$) {

    var promptSymbol = '$';

    function Context(username, auth = j$.auth, fs = j$.fs) {
        let user = auth.addUser(username, '/bin/bash');
        let homeDir = fs.mkdir(username, fs.get('/home'), user);
        
        let message = 'Welcome to javascriptix, the linux-like terminal in your browser! \n\nIf you are reading this, then you already know how to do cat.\nWhy not try other commands as well?\n\nHave fun! :)';
        fs.touch('readme', homeDir, user, message);

        this.user = user;
        this.env = {
            HOSTNAME: 'javascriptix',
            PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
        };
        this.umask = 0o022;
        this.directory = fs.get(user.home);
        this.promptString = () => `${user.name}@${this.env.HOSTNAME} ${promptSymbol} `;
    }
    
    j$.__Context = Context;

}(window.j$ = window.j$ || {}));