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

    function interpret(sys, userInput) {
        if (!userInput) {
            return;
        }
        var tokens = tokenizeAll(userInput, this.tokenize);
        stripQuotes(tokens);

        let command = tokens[0];
        if (isPath(command)) {
            return this.execute(sys.fs.get(command), command, tokens);
        } else if (this.builtins.hasOwnProperty(command)) {
            return this.builtins[command](tokens);
        } else {
            return this.execute(this.getFromPath(command), command, tokens);
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
