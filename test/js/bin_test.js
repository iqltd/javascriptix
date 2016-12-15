(function (t$) {
    "use strict";
    
    var j$, assertEquals, arrayEquals;
    
    t$.testSuites = t$.testSuites || [];
    
    j$ = window.j$;
    assertEquals = t$.assertEquals;
    arrayEquals = t$.simpleArrayEquals;
    j$.init();
    
    t$.testSuites.push({
        name: "j$ /bin/pwd",
        pwd_root: function () {
            j$.context.directory = j$.fs.root;
            assertEquals('/', j$.fs.get('/bin/pwd').execute());
        }
    });
    
    t$.testSuites.push({
        name: "j$ /usr/bin/whoami",
        whoami_username: function () {
            j$.context.user.name = "username";
            assertEquals('username', j$.fs.get('/usr/bin/whoami').execute());
        }
    });
    
}(window.t$ = window.t$ || {}));