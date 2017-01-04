(function (t$) {
    t$.testSuites = t$.testSuites || [];
    
    let j$ = window.j$;
    let assertEquals = t$.assertEquals;
    
    let fs = {}, auth = {}, context = {};
    
    function init() {
        auth = new j$.__Auth(new Map());
        fs = new j$.__Fs();
        context = new j$.__Context('test', auth, fs);
        window.j$.__initBins(auth, fs, context);
    }

    t$.testSuites.push({
        name: "j$ /bin/pwd",
        beforeAll: init,
        tests: {
            pwd_root: function () {
                context.directory = fs.root;
                assertEquals('/', fs.get('/bin/pwd').execute());
            }
        }
    });
    
    t$.testSuites.push({
        name: "j$ /usr/bin/whoami",
        beforeAll: init,
        tests: {
            whoami_username: function () {
                context.user.name = "username";
                assertEquals('username', fs.get('/usr/bin/whoami').execute());
            }
        }
    });
    
}(window.t$ = window.t$ || {}));