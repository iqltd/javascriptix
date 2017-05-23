var j$ = {};

define(['terminal', 'bash', 'bin', 'system'],
    function (Terminal, Bash, bins, system) {
        let init = () => {
            bins.init();
            j$.bash = new Bash();
            j$.terminal = new Terminal(j$.bash);

            j$.terminal.init();

            return system;
        };
        return { init };
    }
);