define(['test/tools', 'test/mocks'], function (t$, mocks) {
    let assertEquals = t$.assertEquals;
    let assertErrorThrown = t$.assertErrorThrown;

    let bash = {};

    function initBash(sys) {
        bash = mocks.initBash(sys);
    }

    let ts1 = {name: 'bash builtins - echo', before: initBash};
    ts1.tests = {
        echo_whatever: function () {
            assertEquals('hello, world! ', bash.builtins.echo(['echo', 'hello, world!']));
        }
    };

    let ts2 = {name: 'bash builtins - cd', before: initBash};
    ts2.tests = {
        cd_root: function (sys) {
            bash.builtins.cd(['cd', '/']);
            assertEquals(sys.fs.root, sys.context.directory);
        },
        cd_home: function (sys) {
            bash.builtins.cd(['cd']);
            assertEquals(sys.context.user.home + '/', sys.context.directory.path);
        },
        cd_relative: function (sys) {
            sys.fs.mkdir('a', sys.fs.get(sys.context.user.home), sys.context.user);
            bash.builtins.cd(['cd']);
            bash.builtins.cd(['cd', 'a']);
            assertEquals(sys.context.user.home + '/a/', sys.context.directory.path);
        },
        cd_startWithFullStop: function (sys) {
            sys.fs.mkdir('a', sys.fs.get(sys.context.user.home), sys.context.user);
            bash.builtins.cd(['cd']);
            bash.builtins.cd(['cd', './a']);
            assertEquals(sys.context.user.home + '/a/', sys.context.directory.path);
        },
        cd_file: function (sys) {
            sys.fs.touch('file', sys.fs.get(sys.context.user.home), sys.context.user);
            bash.builtins.cd(['cd']);
            assertErrorThrown(bash.builtins.cd, ['cd', 'file']);
        }
    };
    
    return [ ts1, ts2 ];

});
