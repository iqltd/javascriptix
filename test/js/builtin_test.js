(function (t$) {
    "use strict";
    
    var j$, assertEquals, arrayEquals;
    
    t$.testSuites = t$.testSuites || [];
    
    j$ = window.j$;
    assertEquals = t$.assertEquals;
    arrayEquals = t$.simpleArrayEquals;
    j$.init();
    
    t$.testSuites.push({
        name: "j$.bash.builtins echo",
        pwd_root: function () {
            j$.context.directory = j$.fs.root;
            assertEquals('hello, world! ', j$.bash.builtins.echo(['echo', 'hello, world!']));
        }
    });
    
    t$.testSuites.push({
        name: "j$.bash.builtins cd",
        cd_root: function () {
            j$.bash.builtins.cd(['cd', '/']);
            assertEquals(j$.fs.root, j$.context.directory);
        },
        cd_home: function () {
            j$.bash.builtins.cd(['cd']);
            assertEquals(j$.context.user.home + "/", j$.context.directory.path());
        }
    });
    
}(window.t$ = window.t$ || {}));