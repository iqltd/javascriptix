define(function () {
    
    function changeDirectory(fs, context, args) {
        var newDir;
        if (args) {
            if (args[1]) {
                newDir = fs.get(args[1], context.directory);
            } else {
                newDir = fs.get(context.user.home);
            }
        }
        if (newDir) {
            if (newDir.isDirectory) {
                context.directory = newDir;
            } else {
                throw new Error(args[1] + ': Not a directory');
            }
        } else {
            throw new Error(args[1] + ': No such file or directory');
        }
    }
    
    function echo(args) {
        var i, message = '';
        for (i = 1; i < args.length; i++) {
            message += args[i] + ' ';
        }
        return message;
    }

    function init(bash) {
        let fs = bash.getFs();
        let context = bash.getContext();
        bash.builtins = {
            cd: changeDirectory.bind(null, fs, context),
            echo: echo
        };
    }

    return { init };
    
});