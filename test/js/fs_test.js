(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let assertEquals = t$.assertEquals;
    let arrayEquals = t$.arrayEquals;
    
    let fs = {};
    let user = {};
    
    function init() {
        fs = new window.j$.__Fs();
    }
    
    t$.testSuites.push({
        name: "fs - path method",
        beforeAll: init,
        tests: {
            fileAppend: function () {
                var file = fs.touch('test', fs.root, user);
                file.content = 'prefix';
                file.append('appended');
                assertEquals('prefixappended', file.content);
            },
            fileOverwrite: function () {
                var file = fs.touch('test', fs.root, user);
                file.content = 'oldtext';
                file.overwrite('newtext');
                assertEquals('newtext', file.content);
            },
            filePath_level1: function () {
                var file = fs.touch('name', fs.root, user);
                assertEquals('/name', file.path());
            },
            filePath_level2: function () {
                var file = fs.touch('name', fs.mkdir('parent', fs.root, user), user);
                assertEquals('/parent/name', file.path());
            },
            dirPath_root: function () {
                var file = fs.mkdir('', null, user);
                assertEquals('/', file.path());
            },
            dirPath_level1: function () {
                var file = fs.mkdir('name', fs.root, user);
                assertEquals('/name/', file.path());
            },
            dirPath_level2: function () {
                var file = fs.mkdir('name', fs.mkdir('parent', fs.root, user), user);
                assertEquals('/parent/name/', file.path());
            }
        }

    });

    t$.testSuites.push({
        name: "fs.get",
        beforeAll: function () {
            init();
            fs.mkdir('level1', fs.root, user);
        },
        tests: {
            fsGet_level1dir: function () {
                var found = fs.mkdir('level1', fs.root, user);
                assertEquals(found, fs.get("/level1"));
            },
            fsGet_root: function () {
                assertEquals(fs.root, fs.get("/"));
            },
            fsGet_level2file: function () {
                var level1 = fs.mkdir('level1', fs.root, user),
                    found = fs.touch('file', level1, user);
                assertEquals(found, fs.get("/level1/file"));
            }
        }
    });
    
    t$.testSuites.push({
        name: "fs.parsePath",
        beforeAll: function () {
            init();
            fs.touch('fileNameWithStrangeCharacters []', fs.root, user);
        },
        tests: {
            fsGet_level1_normal: function () {
                var found = ['/', 'level1'];
                assertEquals(found, fs.parsePath("/level1"), arrayEquals);
            },
            fsGet_level1_slashesAtTheEnd: function () {
                var found = ['/', 'level1'];
                assertEquals(found, fs.parsePath("/level1////"), arrayEquals);
            },
            fsGet_level1_moreSlashes: function () {
                var found = ['/', 'level1'];
                assertEquals(found, fs.parsePath("///level1"), arrayEquals);
            },
            fsGet_root_normal: function () {
                var found = ['/'];
                assertEquals(found, fs.parsePath("/"), arrayEquals);
            },
            fsGet_root_moreSlashes: function () {
                var found = ['/'];
                assertEquals(found, fs.parsePath("//////"), arrayEquals);
            },
            fsGet_fileNameWithStrangeCharacters_moreSlashes: function () {
                var fileName = "fileNameWithStrangeCharacters !@#$%^&*()_-+={}[];:\\|'",
                    found = ['/', 'level1', fileName];
                assertEquals(found, fs.parsePath("////level1//////////////////" + fileName + "//////////////"), arrayEquals);
            }
        }
    });
    
}(window.t$ = window.t$ || {}));