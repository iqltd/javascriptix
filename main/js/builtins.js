(function (j$) {
    "use strict";
    
    j$.bash = j$.bash || {};
    
    function changeDirectory(args) {
        var newDir;
        if (args) {
            if (args[1]) {
                newDir = j$.fs.get(args[1]);
            } else {
                newDir = j$.fs.get(j$.context.user.home);
            }
        }
        if (newDir) {
            j$.context.directory = newDir;
        }
    }
    
    function echo(args) {
        var i, message = '';
        for (i = 1; i < args.length; i++) {
            message += args[i] + ' ';
        }
        return message;
    }

    j$.bash.builtins = {
        cd: changeDirectory,
        echo: echo
    };
    
}(window.j$ = window.j$ || {}));