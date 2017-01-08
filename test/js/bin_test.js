(function (t$) {
    t$.testSuites = t$.testSuites || [];
    
    let j$ = window.j$;
    let assertEquals = t$.assertEquals;
    
    let sys = {};
    
    function init() {
        sys.auth = new j$.__Auth();
        sys.fs = new j$.__Fs();
        sys.context = new j$.__Context('test', sys);
        window.j$.__initBins(sys);
    }

    t$.testSuites.push({
        name: "j$ /bin/pwd",
        beforeAll: init,
        tests: {
            pwd_root: function () {
                sys.context.directory = sys.fs.root;
                assertEquals('/', sys.fs.get('/bin/pwd').content());
            }
        }
    });
    
    t$.testSuites.push({
        name: "j$ /usr/bin/whoami",
        beforeAll: init,
        tests: {
            whoami_username: function () {
                sys.context.user.name = "username";
                assertEquals('username', sys.fs.get('/usr/bin/whoami').content());
            }
        }
    });
    
}(window.t$ = window.t$ || {}));