(function (j$) {
    "use strict";
    
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
            if (newDir.isDirectory) {
                j$.context.directory = newDir;
            } else {
                throw new Error(args[1] + ": Not a directory");
            }
        }
    }
    
    function echo(args) {
        var i, message = '';
        for (i = 1; i < args.length; i++) {
            message += args[i] + ' ';
        }
        return message;
    }

    j$.init = j$.init || {};
    j$.init.builtins = function () {
        j$.bash = j$.bash || {};
        j$.bash.builtins = {
            cd: changeDirectory,
            echo: echo
        };
    };
    
}(window.j$ = window.j$ || {}));