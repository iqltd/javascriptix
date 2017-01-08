window.onload = function () {
    
    let j$ = window.j$;
        
    try {
        let system = {};
        console.log('Loading components.');

        system.auth = new j$.__Auth();
        console.log('Pseudo-authorization module loaded.');

        system.fs = new j$.__Fs(system);
        console.log('Pseudo-filesystem loaded.');

        system.context = new j$.__Context('guest', system);
        console.log('Execution context created.');

        j$.__initBins(system);
        console.log('Pseudo-coreutils loaded.');

        system.bash = new j$.__Bash(system);
        console.log('Bash loaded.');
        
        system.terminal = new j$.__Terminal(system);
        console.log('Terminal loaded.');

        console.log('Finished loading components.');
    } catch (err) {
        console.error('An error occured at the loading of the modules.');
        throw err;
    }
    
};