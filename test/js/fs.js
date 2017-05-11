define(['test/tools'], function (t$) {
    let assertEquals = t$.assertEquals;
    let arrayEquals = t$.arrayEquals;

    let testSuites = [];
    testSuites.push({
        name: 'fs - path method',
        tests: {
            fileAppend: function (sys) {
                let fs = sys.fs;
                var file = fs.touch('test', fs.root, {});
                file.content = 'prefix';
                file.append('appended');
                assertEquals('prefixappended', file.content);
            },
            fileWrite: function (sys) {
                let fs = sys.fs;
                var file = fs.touch('test', fs.root, {});
                file.content = 'oldtext';
                file.write('newtext');
                assertEquals('newtext', file.content);
            },
            filePath_level1: function (sys) {
                let fs = sys.fs;
                var file = fs.touch('name', fs.root, {});
                assertEquals('/name', file.path);
            },
            filePath_level2: function (sys) {
                let fs = sys.fs;
                var file = fs.touch('name', fs.mkdir('parent', fs.root, {}), {});
                assertEquals('/parent/name', file.path);
            },
            dirPath_root: function (sys) {
                let fs = sys.fs;
                var file = fs.mkdir('', null, {});
                assertEquals('/', file.path);
            },
            dirPath_level1: function (sys) {
                let fs = sys.fs;
                var file = fs.mkdir('name', fs.root, {});
                assertEquals('/name/', file.path);
            },
            dirPath_level2: function (sys) {
                let fs = sys.fs;
                var file = fs.mkdir('name', fs.mkdir('parent', fs.root, {}), {});
                assertEquals('/parent/name/', file.path);
            }
        }
    });

    testSuites.push({
        name: 'fs - get',
        tests: {
            fsGet_level1dir: function (sys) {
                let fs = sys.fs;
                var found = fs.mkdir('level1', fs.root, {});
                assertEquals(found, fs.get('/level1'));
            },
            fsGet_root: function (sys) {
                let fs = sys.fs;
                assertEquals(fs.root, fs.get('/'));
            },
            fsGet_level2file: function (sys) {
                let fs = sys.fs;
                var level1 = fs.mkdir('level1', fs.root, {}),
                    found = fs.touch('file', level1, {});
                assertEquals(found, fs.get('/level1/file'));
            }
        }
    });

    testSuites.push({
        name: 'fs - parsePath',
        before: sys => sys.fs.mkdir('level1', sys.fs.root, {}), 
        tests: {
            fsGet_level1_normal: function (sys) {
                let fs = sys.fs;
                var found = ['/', 'level1'];
                assertEquals(found, fs.parsePath('/level1'), arrayEquals);
            },
            fsGet_level1_slashesAtTheEnd: function (sys) {
                let fs = sys.fs;
                var found = ['/', 'level1'];
                assertEquals(found, fs.parsePath('/level1////'), arrayEquals);
            },
            fsGet_level1_moreSlashes: function (sys) {
                let fs = sys.fs;
                var found = ['/', 'level1'];
                assertEquals(found, fs.parsePath('///level1'), arrayEquals);
            },
            fsGet_root_normal: function (sys) {
                let fs = sys.fs;
                var found = ['/'];
                assertEquals(found, fs.parsePath('/'), arrayEquals);
            },
            fsGet_root_moreSlashes: function (sys) {
                let fs = sys.fs;
                var found = ['/'];
                assertEquals(found, fs.parsePath('//////'), arrayEquals);
            },
            fsGet_fileNameWithStrangeCharacters_moreSlashes: function (sys) {
                let fs = sys.fs;
                fs.touch('fileNameWithStrangeCharacters []', fs.root, {});
                
                var fileName = 'fileNameWithStrangeCharacters !@#$%^&*()_-+={}[];:\\|\'',
                    found = ['/', 'level1', fileName];
                assertEquals(found, fs.parsePath('////level1//////////////////' + fileName + '//////////////'), arrayEquals);
            }
        }
    });

    return testSuites;

});
