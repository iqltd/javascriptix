(function (t$) {
    "use strict";
    
    var j$, user, assertEquals, arrayEquals;
    
    t$.testSuites = t$.testSuites || [];
    
    j$ = window.j$;

    function getUser() {
        return j$.context.user;
    }

    user = getUser();
    assertEquals = t$.assertEquals;
    arrayEquals = t$.simpleArrayEquals;
    
    t$.testSuites.push({
        name: "j$.fs - path method",
        fileAppend: function () {
            var file = j$.fs.touch('test', j$.fs.root, user);
            file.content = 'prefix';
            file.append('appended');
            assertEquals('prefixappended', file.content);
        },
        fileOverwrite: function () {
            var file = j$.fs.touch('test', j$.fs.root, user);
            file.content = 'oldtext';
            file.overwrite('newtext');
            assertEquals('newtext', file.content);
        },
        filePath_level1: function () {
            var file = j$.fs.touch('name', j$.fs.root, user);
            assertEquals('/name', file.path());
        },
        filePath_level2: function () {
            var file = j$.fs.touch('name', j$.fs.mkdir('parent', j$.fs.root, user), user);
            assertEquals('/parent/name', file.path());
        },
        dirPath_root: function () {
            var file = j$.fs.mkdir('', null, user);
            assertEquals('/', file.path());
        },
        dirPath_level1: function () {
            var file = j$.fs.mkdir('name', j$.fs.root, user);
            assertEquals('/name/', file.path());
        },
        dirPath_level2: function () {
            var file = j$.fs.mkdir('name', j$.fs.mkdir('parent', j$.fs.root, user), user);
            assertEquals('/parent/name/', file.path());
        }
    });
    

    j$.fs.mkdir('level1', j$.fs.root, user);
    j$.fs.touch('fileNameWithStrangeCharacters []', j$.fs.root, user);

    t$.testSuites.push({
        name: "j$.fs.get",
        fsGet_level1dir: function () {
            var found = j$.fs.mkdir('level1', j$.fs.root, user);
            assertEquals(found, j$.fs.get("/level1"));
        },
        fsGet_root: function () {
            assertEquals(j$.fs.root, j$.fs.get("/"));
        },
        fsGet_level2file: function () {
            var level1 = j$.fs.mkdir('level1', j$.fs.root, user),
                found = j$.fs.touch('file', level1, user);
            assertEquals(found, j$.fs.get("/level1/file"));
        }
    });
    
    t$.testSuites.push({
        name: "j$.fs.parsePath",
        fsGet_level1_normal: function () {
            var found = ['/', 'level1'];
            assertEquals(found, j$.fs.parsePath("/level1"), arrayEquals);
        },
        fsGet_level1_slashesAtTheEnd: function () {
            var found = ['/', 'level1'];
            assertEquals(found, j$.fs.parsePath("/level1////"), arrayEquals);
        },
        fsGet_level1_moreSlashes: function () {
            var found = ['/', 'level1'];
            assertEquals(found, j$.fs.parsePath("///level1"), arrayEquals);
        },
        fsGet_root_normal: function () {
            var found = ['/'];
            assertEquals(found, j$.fs.parsePath("/"), arrayEquals);
        },
        fsGet_root_moreSlashes: function () {
            var found = ['/'];
            assertEquals(found, j$.fs.parsePath("//////"), arrayEquals);
        },
        fsGet_fileNameWithStrangeCharacters_moreSlashes: function () {
            var fileName = "fileNameWithStrangeCharacters !@#$%^&*()_-+={}[];:\\|'",
                found = ['/', 'level1', fileName];
            assertEquals(found, j$.fs.parsePath("////level1//////////////////" + fileName + "//////////////"), arrayEquals);
        }
    });
    
}(window.t$ = window.t$ || {}));