(function (j$) {

    function isQuote(character) {
        return '\'"'.includes(character);
    }

    function isPath(command) {
        return command.includes('/');
    }

    function stripQuotes(args) {
        args.forEach(function (crt, i, array) {
            if (crt && isQuote(crt[0])) {
                array[i] = crt.substr(1, crt.length - 2);
            }
        });
    }

    function execute(executable, command, args) {
        if (executable && executable.content instanceof Function) {
            return executable.content(args);
        } else if (executable) {
            return this.interpret(executable.content);
        } else {
            throw new Error(command + ': command not found');
        }
    }

    function getFromPATH(sys, filename) {
        let fs = sys.fs;
        let path = sys.context.env.PATH;
        let find = p => fs.get(p + '/' + filename);
        let file = path.split(':').find(e => find(e));
        return find(file);
    }

    function tokenizeAll(input, tokenize) {
        let tokens = [];
        let toTokenize = input;
        while (toTokenize) {
            let result = tokenize(toTokenize);
            tokens.push(result.word);
            toTokenize = result.rest;
        }
        return tokens;
    }

    function readInput(sys) {
        return sys.fs.getFile(0).readline();
    }

    function writeOutput(sys, text) {
        if (text) {
            sys.fs.getFile(1).append(text);
        }
    }

    function writeErr(sys, text) {
        if (text) {
            sys.fs.getFile(2).append(text);
        }
    }

    function interpret(sys) {
        let userInput = readInput(sys);
        if (!userInput) {
            return 0;
        }

        var tokens;
        try {
            tokens = tokenizeAll(userInput, this.tokenize);
        } catch (error) {
            return 1;
        }
        stripQuotes(tokens);

        let out = '';
        try {
            let command = tokens[0];
            if (isPath(command)) {
                out = this.execute(sys.fs.get(command), command, tokens);
            } else if (this.builtins.hasOwnProperty(command)) {
                out = this.builtins[command](tokens);
            } else {
                out = this.execute(this.getFromPath(command), command, tokens);
            }
            writeOutput(sys, out);
        } catch (err) {
            writeErr(sys, err);
        }
    }

    function Bash(system) {
        let [fs, context] = [system.fs, system.context];

        this.interpret = interpret.bind(this, system);
        this.execute = execute.bind(this);
        this.getFromPath = getFromPATH.bind(this, system);
        j$.__initBuiltins(this, fs, context);
        j$.__initTokenize(this);
    }

    j$.__Bash = Bash;

}(window.j$ = window.j$ || {}));
