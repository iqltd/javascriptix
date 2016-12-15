(function (j$) {
    'use strict';
    
    var ongoing;
    
    j$.bash = j$.bash || {};
    
    j$.bash.tokenize = function (input) {
        var i = 0,
            start = 0,
            closing = null,
            tokens = [],
            err;
        
        if (ongoing) {
            input = ongoing + '\n' + input;
        }
        
        function addToken(index) {
            if (index >= 0 && index >= start) {
                var token = input.substring(start, index + 1);
                tokens.push(token);
                start = index + 1;
            }
        }
        
        function checkIfComplete(index) {
            if (input[index] === closing) {
                addToken(index);
                closing = null;
            }
        }
        
        function checkIfMeta(index) {
            switch (input[index]) {
            case ' ':
            case '\t':
                addToken(index - 1);
                start++;
                break;
            case '\n':
            case '|':
            case '&':
            case ';':
            case '<':
            case '>':
            case '(':
            case ')':
                addToken(index - 1);
                addToken(index);
                break;
            case '"':
            case "'":
                addToken(index - 1);
                closing = input[index];
                break;
            }
        }
        
        for (i = 0; i < input.length; i++) {
            if (closing) {
                checkIfComplete(i);
            } else {
                checkIfMeta(i);
            }
        }
        if (closing) {
            err = new Error();
            ongoing = input;
            err.statementIncomplete = true;
            throw err;
        }
        addToken(i - 1);
        ongoing = null;
        return tokens;
    };

    j$.bash.interpret = function (userInput) {
        var tokens = j$.bash.tokenize(userInput);
        
        function stripQuotes(args) {
            var i, arg;
            for (i = 0; i < args.length; i++) {
                arg = args[i];
                if (arg && (arg[0] === "'" || arg[0] === '"')) {
                    arg = arg.substr(1, arg.length - 2);
                }
                args[i] = arg;
            }
        }
        stripQuotes(tokens);
        
        function isPath(command) {
            return command.indexOf('/') > -1;
        }
        
        function isBuiltin(command) {
            return j$.bash.builtins.hasOwnProperty(command);
        }
        
        function execute(executable, command, args) {
            if (executable) {
                return executable.execute(args);
            } else {
                throw new Error(command + ': command not found');
            }
        }
        
        function getFromPATH(filename) {
            var i = 0, file, dirs = j$.context.env.PATH.split(':');
            while (i < dirs.length && !file) {
                file = j$.fs.get(dirs[i] + '/' + filename, true);
                i++;
            }
            return file;
        }
        
        function runCommand(command, args) {
            if (isPath(command)) {
                return execute(j$.fs.get(command), command, args);
            } else if (isBuiltin(command)) {
                return j$.bash.builtins[command](args);
            } else {
                return execute(getFromPATH(command), command, args);
            }
        }
        
        if (userInput.length > 0) {
            try {
                return runCommand(tokens[0], tokens);
            } catch (e) {
                throw new Error(tokens[0] + ": " + e.message);
            }
            
        }
    };
}(window.j$ = window.j$ || {}));