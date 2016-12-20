(function (t$) {
    "use strict";
    
    var j$, assertEquals, arrayEquals;
    
    t$.testSuites = t$.testSuites || [];
    
    j$ = window.j$;
    assertEquals = t$.assertEquals;

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
        },
        cd_relative: function () {
            j$.fs.mkdir("a", j$.fs.get(j$.context.user.home), j$.context.user);
            j$.bash.builtins.cd(['cd']);
            j$.bash.builtins.cd(['cd', 'a']);
            assertEquals(j$.context.user.home + "/a/", j$.context.directory.path());
        },
        cd_startWithFullStop: function () {
            j$.fs.mkdir("a", j$.fs.get(j$.context.user.home), j$.context.user);
            j$.bash.builtins.cd(['cd']);
            j$.bash.builtins.cd(['cd', './a']);
            assertEquals(j$.context.user.home + "/a/", j$.context.directory.path());
        },
        cd_file: function () {
            j$.fs.touch("file", j$.fs.get(j$.context.user.home), j$.context.user);
            j$.bash.builtins.cd(['cd']);
            try {
                j$.bash.builtins.cd(['cd', 'file']);
                throw new Error("assertion failed");
            } catch (e) {
                
            }
        }
        
    });
    
}(window.t$ = window.t$ || {}));