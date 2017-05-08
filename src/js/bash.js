define(['system', 'builtins', 'bash_tokens'], function (defaultSystem, builtins, tokens) {

    let isQuote = character => '\'"'.includes(character);
    let stripQuotes = word => {
        return isQuote(word[0]) ? word.substr(1, word.length - 2)
                : word;
    };
    let strip = tokens => tokens.map(stripQuotes);
    let isEmpty = list => list.length == 0;
    let doNothing = () => {}; 

    function process() {
        let io = this.getIo();
        let tokens = this.tokenizeAll(io.readInput());
        if (tokens) {
            let execute = isEmpty(tokens) ? doNothing
                : this.interpret(strip(tokens));
            perform(execute, io);
            return true;
        } 
        return false;
    }

    let isPath = command => command.includes('/');        

    function interpret(tokens) {
        if (tokens.length > 0) {
            let command = tokens[0];
            if (isPath(command)) {
                return this.execute(this.getFs().get(command), tokens, this);
            } else if (this.builtins.hasOwnProperty(command)) {
                return () => this.builtins[command](tokens);
            } else {
                return this.execute(this.getFromPath(command), tokens, this);
            }
        }
    }

    function execute(executable, args) {
        return () => {
            if (executable && executable.content instanceof Function) {
                return executable.content(args);
            } else if (executable) {
                this.getIo().input.consume();
                this.getIo().input.append(args);
                return this.process();
            } else {
                throw new Error(args[0] + ': command not found');
            }
        };
    }

    function perform(execute, io) {
        try {
            let result = execute();
            io.writeOutput(result);
        } catch (err) {
            io.writeErr(err.message);
            /*eslint no-console: ["error", { allow: ["error"] }] */
            console.error(err);
        }
    }

    function getFromPATH(filename) {
        let path = this.getContext().env.PATH;
        let find = p => this.getFs().get(p + '/' + filename);
        let file = path.split(':').find(e => find(e));
        return find(file);
    }

    class Bash {
        constructor(sys) {
            let system = sys || defaultSystem;
            this.getIo = () => system.io;
            this.getSystem = () => system;
            this.getFs = () => system.fs;
            this.getContext = () => system.context;
            this.process = process.bind(this);
            this.interpret = interpret.bind(this);
            this.execute = execute.bind(this);
            this.getFromPath = getFromPATH.bind(this);
            builtins.init(this);
            tokens.init(this);
        }
    }

    return Bash;

});
