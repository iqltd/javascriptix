(function (j$) {
    'use strict';
    
    function contains(text, char) {
        return text.indexOf(char) > -1 ? char : null;
    }
    
    function isWhitespace(character) {
        return contains(" \t", character);
    }
    function isMeta(character) {
        return contains("\n|&;<>()", character);
    }
    
    function isQuote(character) {
        return contains("\"'", character);
    }
    
    function isEscape(character) {
        return contains("\\", character);
    }
    
    function stripQuotes(args) {
        var i, arg;
        for (i = 0; i < args.length; i++) {
            arg = args[i];
            if (arg && isQuote(arg[0])) {
                arg = arg.substr(1, arg.length - 2);
            }
            args[i] = arg;
        }
    }
    
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
    
    function Filters() {
        this.filters = [];
        this.exclusive = null;
        this.addFilter = function (match, action) {
            this.filters.push({match: match, action: action});
        };
        this.doFilter = function (char) {
            var i = 0, match = false;
            while (i < this.filters.length) {
                match = this.filters[i].match(char);
                if (match) {
                    this.filters[i].action(char);
                }
                i++;
            }
        };
    }
        
    function tokenize() {
        var index = 0, start = 0, tokens = [], text = "";
        
        function init() {
            index = 0;
            start = 0;
            text = "";
            tokens = [];
        }
        
        function add(i) {
            if (i > start) {
                tokens.push(text.substring(start, i));
                start = i;
            }
        }
        
        function findPair(char) {
            var i = text.indexOf(char, start + 1);
            if (i > -1) {
                add(i + 1);
                index = i;
            } else {
                throw new Error();
            }
        }
        
        return function (input) {
            var filters = new Filters(), toreturn;
            filters.addFilter(isWhitespace, function () { add(index); start++; });
            filters.addFilter(isMeta, function () { add(index); add(index + 1); });
            filters.addFilter(isQuote, function (char) { add(index); findPair(char); });
            text += input;
            
            while (index < text.length) {
                filters.doFilter(text[index]);
                index++;
            }
            add(index);
            toreturn = tokens;
            init();
            return toreturn;
        };
    }
        
    j$.bash = j$.bash || {};
        
    j$.bash.tokenize = tokenize();

    j$.bash.interpret = function (userInput) {
        var tokens = j$.bash.tokenize(userInput);
        stripQuotes(tokens);
        
        if (userInput.length > 0) {
            return runCommand(tokens[0], tokens);
        }
    };
}(window.j$ = window.j$ || {}));