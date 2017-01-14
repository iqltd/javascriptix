(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let j$ = window.j$;
    let assertEquals = t$.assertEquals;
    let assertErrorThrown = t$.assertErrorThrown;

    let bash = {};
    let sys = {};

    function initBash() {
        sys = t$.initSystem();
        bash = new j$.__Bash(sys);
    }

    let ts = {name: 'bash builtins - echo', beforeAll: initBash};
    ts.tests = {
        echo_whatever: function () {
            assertEquals('hello, world! ', bash.builtins.echo(['echo', 'hello, world!']));
        }
    };
    t$.testSuites.push(ts);

    ts = {name: 'bash builtins - cd', beforeAll: initBash};
    ts.tests = {
        cd_root: function () {
            bash.builtins.cd(['cd', '/']);
            assertEquals(sys.fs.root, sys.context.directory);
        },
        cd_home: function () {
            bash.builtins.cd(['cd']);
            assertEquals(sys.context.user.home + '/', sys.context.directory.path());
        },
        cd_relative: function () {
            sys.fs.mkdir('a', sys.fs.get(sys.context.user.home), sys.context.user);
            bash.builtins.cd(['cd']);
            bash.builtins.cd(['cd', 'a']);
            assertEquals(sys.context.user.home + '/a/', sys.context.directory.path());
        },
        cd_startWithFullStop: function () {
            sys.fs.mkdir('a', sys.fs.get(sys.context.user.home), sys.context.user);
            bash.builtins.cd(['cd']);
            bash.builtins.cd(['cd', './a']);
            assertEquals(sys.context.user.home + '/a/', sys.context.directory.path());
        },
        cd_file: function () {
            sys.fs.touch('file', sys.fs.get(sys.context.user.home), sys.context.user);
            bash.builtins.cd(['cd']);
            assertErrorThrown(bash.builtins.cd, ['cd', 'file']);
        }
    };
    t$.testSuites.push(ts);

}(window.t$ = window.t$ || {}));
