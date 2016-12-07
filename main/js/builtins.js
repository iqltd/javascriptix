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

    j$.bash.builtins = {
        cd: changeDirectory
    };
    
}(window.j$ = window.j$ || {}));