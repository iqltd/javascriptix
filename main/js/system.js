(function (j$) {
    
    let loaded;
    
    function run(func) {
        if (func instanceof Function) {
            func(sys);
        }
    }
    
    j$.init = function() {
        if (loaded) return;
        
        try {
            console.log('Loading crucial modules.');
            
            j$.auth = new j$.__Auth();
            console.log('Pseudo-authorization module loaded.');
            
            j$.fs = new j$.__Fs();
            console.log('Pseudo-filesystem loaded.');
            
            j$.context = new j$.__Context('guest');
            console.log('Execution context created.');
            
            j$.__initBins();
            console.log('Pseudo-coreutils loaded.');
            
            j$.bash = new j$.__Bash();
            console.log('Bash loaded.');

            console.log('Finished loading crucial modules.');
            loaded = true;
        } catch (err) {
            console.error('An error occured at the loading of the modules.');
            throw err;
        }
    };
}(window.j$ = window.j$ || {}));