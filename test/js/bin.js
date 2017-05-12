define(['test/tools', 'test/mocks'], function (t$, mocks) {
    let testSuites = [];

    let [assertEquals, assertDefined] = [t$.assertEquals, t$.assertDefined];

    let bin = (path, sys) => sys.fs.get(path).content;
    let initBin = sys => mocks.initBin(sys);

    testSuites.push({
        name: '/bin/pwd',
        before: initBin,
        tests: {
            pwd_root: function (sys) {
                sys.context.directory = sys.fs.root;
                assertEquals('/', bin('/bin/pwd', sys)());
            }
        }
    });

    testSuites.push({
        name: '/usr/bin/whoami',
        before: initBin,
        tests: {
            whoami_username: function (sys) {
                sys.context.user.name = 'username';
                assertEquals('username', bin('/usr/bin/whoami', sys)());
            }
        }
    });

    testSuites.push({
        name: '/bin/ls',
        before: initBin,
        tests: {
            ls_oneFile: function (sys) {
                mocks.mockFsGet(sys.fs, 'path', {list: () => ['1']});
                assertEquals('1\t', bin('/bin/ls', sys)(['ls', 'path']));
            },
            ls_empty: function (sys) {
                mocks.mockFsGet(sys.fs, 'path', {list: () => []});
                assertEquals('', bin('/bin/ls', sys)(['ls', 'path']));
            }
        }
    });

    testSuites.push({
        name: '/bin/mkdir',
        before: initBin,
        tests: {
            mkdir_absoluteOk: function (sys) {
                bin('/bin/mkdir', sys)(['mkdir', '/test/dir1/newDir']);
                assertDefined(sys.fs.get('/test/dir1/newDir'));
            },
            mkdir_relativeOk: function (sys) {
                bin('/bin/mkdir', sys)(['mkdir', 'newDir']);
                assertDefined(sys.fs.get('/test/newDir'));
            },
            mkdir_directoryExists: function (sys) {
                let mkdir = bin('/bin/mkdir', sys);
                mkdir(['mkdir', '/test/dir1/newDir']);
                t$.assertErrorThrown(mkdir, ['mkdir', '/test/dir1/newDir']);
            }
        }
    });

    testSuites.push({
        name: '/bin/touch',
        before: initBin,
        tests: {
            touch_absoluteOk: function (sys) {
                bin('/bin/touch', sys)(['touch', '/test/newFile']);
                assertDefined(sys.fs.get('/test/newFile'));
            },
            touch_relativeOk: function (sys) {
                bin('/bin/touch', sys)(['touch', 'newFile']);
                assertDefined(sys.fs.get('/test/newFile'));
            },
            touch_fileExists: function (sys) {
                bin('/bin/touch', sys)(['touch', '/test/newFile']);
                bin('/bin/touch', sys)(['touch', '/test/newFile']);
                assertDefined(sys.fs.get('/test/newFile'));
            }
        }
    });

    testSuites.push({
        name: '/bin/rm',
        before: initBin,
        tests: {
            rm_absoluteOk: function (sys) {
                assertDefined(sys.fs.get('/test/dir1'));
                bin('/bin/rm', sys)(['rm', '/test/dir1']);
                assertEquals(undefined, sys.fs.get('/test/dir1'));
            },
            rm_relativeOk: function (sys) {
                assertDefined(sys.fs.get('/test/dir1'));
                bin('/bin/rm', sys)(['touch', 'dir1']);
                assertEquals(undefined, sys.fs.get('/test/dir1'));
            },
            rm_fileExists: function (sys) {
                let rm = bin('/bin/rm', sys);
                rm(['rm', '/test/dir1']);
                t$.assertErrorThrown(rm, ['rm', '/test/dir1']);
            }
        }
    });

    testSuites.push({
        name: '/bin/cat',
        before: initBin,
        tests: {
            cat_absoluteOk: function (sys) {
                let content = Symbol();
                assertDefined(sys.fs.get('/test/dir1/file1'));
                sys.fs.get('/test/dir1/file1').content = content;
                assertEquals(content, bin('/bin/cat', sys)(['cat', '/test/dir1/file1']));
            },
            cat_relativeOk: function (sys) {
                let content = Symbol();
                assertDefined(sys.fs.get('/test/dir1/file1'));
                sys.fs.get('/test/dir1/file1').content = content;
                assertEquals(content, bin('/bin/cat', sys)(['cat', 'dir1/file1']));
            },
            cat_fileDoesntExist: function (sys) {
                t$.assertErrorThrown(bin('/bin/cat', sys), ['cat', '/test/nonexistent']);
            }
        }
    });

    return testSuites;

});
