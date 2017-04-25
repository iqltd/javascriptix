(function (j$) {

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

    let isQuote = character => '\'"'.includes(character);
    let stripQuotes = word => {
        return isQuote(word[0]) ? word.substr(1, word.length - 2)
                : word;
    };

    function process() {
        let io = this.getIo();
        let userInput = io.readInput();
        if (!userInput) {
            return 0;
        }

        try {
            var tokens = tokenizeAll(userInput, this.tokenize);
        } catch (error) {
            return 1;
        }

        try {
            let out = this.interpret(tokens.map(stripQuotes));
            io.writeOutput(out);
        } catch (err) {
            io.writeErr(err);
        }
    }

    let isPath = command => command.includes('/');    

    function interpret(tokens) {
        let command = tokens[0];
        if (isPath(command)) {
            return this.execute(this.getFs().get(command), command, tokens);
        } else if (this.builtins.hasOwnProperty(command)) {
            return this.builtins[command](tokens);
        } else {
            return this.execute(this.getFromPath(command), command, tokens);
        }
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

    function getFromPATH(filename) {
        let path = this.getContext().env.PATH;
        let find = p => this.getFs().get(p + '/' + filename);
        let file = path.split(':').find(e => find(e));
        return find(file);
    }

    class Bash {
        constructor(system, io) {
            this.getIo = () => io;
            this.getSystem = () => system;
            this.getFs = () => system.fs;
            this.getContext = () => system.context;
            this.process = process.bind(this);
            this.interpret = interpret.bind(this);
            this.execute = execute.bind(this);
            this.getFromPath = getFromPATH.bind(this);
            j$.__initBuiltins(this);
            j$.__initTokenize(this);
        }
    }

    j$.__Bash = Bash;

}(window.j$ = window.j$ || {}));
