window.onload = function () {

    /*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */


    class Io {
        constructor(input, output, err) {
            this.input = input;
            this.output = output;
            this.err = err;
        }

        readInput() {
            return this.input.readline();
        }

        writeOutput(text) {
            if (text) {
                this.output.append(text);
            }
        }

        writeErr(text) {
            if (text) {
                this.err.append(text);
            }
        }
    }

    let j$ = window.j$;

    try {
        let system = {};
        console.log('Loading components.');

        system.auth = new j$.__Auth();
        console.log('Pseudo-authorization module loaded.');

        let fs = new j$.__Fs(system);
        system.fs = fs;
        console.log('Pseudo-filesystem loaded.');

        system.context = new j$.__Context('guest', system);
        system.getEnv = function(variable) {
            return system.context.env[variable];
        };
        console.log('Execution context created.');

        j$.__initBins(system);
        console.log('Pseudo-coreutils loaded.');

        let io = new Io(fs.getFile(0), fs.getFile(1), fs.getFile(2));
        j$.bash = new j$.__Bash(system, io);
        console.log('Bash loaded.');

        system.terminal = new j$.__Terminal(system);
        console.log('Terminal loaded.');

        console.log('Finished loading components.');
    } catch (err) {
        console.error('An error occured at the loading of the modules.');
        throw err;
    }

};
