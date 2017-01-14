(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let [assertEquals, assertDefined] = [t$.assertEquals, t$.assertDefined];
    let pwd, whoami, ls, mkdir, touch, rm, cat;

    t$.testSuites.push({
        name: '/bin/pwd',
        before: sys => pwd = sys.fs.get('/bin/pwd').content,
        tests: {
            pwd_root: function (sys) {
                sys.context.directory = sys.fs.root;
                assertEquals('/', pwd());
            }
        }
    });

    t$.testSuites.push({
        name: '/usr/bin/whoami',
        before: sys => whoami = sys.fs.get('/usr/bin/whoami').content,
        tests: {
            whoami_username: function (sys) {
                sys.context.user.name = 'username';
                assertEquals('username', whoami());
            }
        }
    });

    t$.testSuites.push({
        name: '/bin/ls',
        before: sys => ls = sys.fs.get('/bin/ls').content,
        tests: {
            ls_oneFile: function (sys) {
                t$.mockFsGet(sys.fs, 'path', {list: () => ['1']});
                assertEquals('1\t', ls(['ls', 'path']));
            },
            ls_empty: function (sys) {
                t$.mockFsGet(sys.fs, 'path', {list: () => []});
                assertEquals('', ls(['ls', 'path']));
            }
        }
    });

    t$.testSuites.push({
        name: '/bin/mkdir',
        before: sys => mkdir = sys.fs.get('/bin/mkdir').content,
        tests: {
            mkdir_absoluteOk: function (sys) {
                mkdir(['mkdir', '/test/dir1/newDir']);
                assertDefined(sys.fs.get('/test/dir1/newDir'));
            },
            mkdir_relativeOk: function (sys) {
                mkdir(['mkdir', 'newDir']);
                assertDefined(sys.fs.get('/test/newDir'));
            },
            mkdir_directoryExists: function () {
                mkdir(['mkdir', '/test/dir1/newDir']);
                window.t$.assertErrorThrown(mkdir, ['mkdir', '/test/dir1/newDir']);
            }
        }
    });

    t$.testSuites.push({
        name: '/bin/touch',
        before: sys => touch = sys.fs.get('/bin/touch').content,
        tests: {
            touch_absoluteOk: function (sys) {
                touch(['touch', '/test/newFile']);
                assertDefined(sys.fs.get('/test/newFile'));
            },
            touch_relativeOk: function (sys) {
                touch(['touch', 'newFile']);
                assertDefined(sys.fs.get('/test/newFile'));
            },
            touch_fileExists: function (sys) {
                touch(['touch', '/test/newFile']);
                touch(['touch', '/test/newFile']);
                assertDefined(sys.fs.get('/test/newFile'));
            }
        }
    });

    t$.testSuites.push({
        name: '/bin/rm',
        before: sys => rm = sys.fs.get('/bin/rm').content,
        tests: {
            rm_absoluteOk: function (sys) {
                assertDefined(sys.fs.get('/test/dir1'));
                rm(['rm', '/test/dir1']);
                assertEquals(undefined, sys.fs.get('/test/dir1'));
            },
            rm_relativeOk: function (sys) {
                assertDefined(sys.fs.get('/test/dir1'));
                rm(['touch', 'dir1']);
                assertEquals(undefined, sys.fs.get('/test/dir1'));
            },
            rm_fileExists: function () {
                rm(['rm', '/test/dir1']);
                window.t$.assertErrorThrown(rm, ['rm', '/test/dir1']);
            }
        }
    });

    t$.testSuites.push({
        name: '/bin/cat',
        before: sys => cat = sys.fs.get('/bin/cat').content,
        tests: {
            cat_absoluteOk: function (sys) {
                let content = Symbol();
                assertDefined(sys.fs.get('/test/dir1/file1'));
                sys.fs.get('/test/dir1/file1').content = content;
                assertEquals(content, cat(['cat', '/test/dir1/file1']));
            },
            rm_relativeOk: function (sys) {
                let content = Symbol();
                assertDefined(sys.fs.get('/test/dir1/file1'));
                sys.fs.get('/test/dir1/file1').content = content;
                assertEquals(content, cat(['cat', 'dir1/file1']));
            },
            cat_fileDoesntExist: function () {
                window.t$.assertErrorThrown(cat, ['cat', '/test/nonexistent']);
            }
        }
    });

}(window.t$ = window.t$ || {}));
