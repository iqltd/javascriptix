define(['terminal', 'bash', 'system', 'bin'], function (Terminal, Bash, system, bins) {
    bins.init(system); 
    let bash = new Bash(system);   
    let terminal = new Terminal(bash, system);

    return {
        terminal, bash, system
    };
});