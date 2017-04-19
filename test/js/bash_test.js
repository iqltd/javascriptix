(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let j$ = window.j$;
    let assertEquals = t$.assertEquals;
    let assertErrorThrown = t$.assertErrorThrown;

    let bash = {};

    function initBash(sys) {
        bash = new j$.__Bash(sys);
    }

    let ts = {name: 'bash - execute', before: initBash};
    ts.tests = {
        execute_binary: function () {
            let executable = { content: () => 'executed'};
            assertEquals('executed', bash.execute(executable));
        },
        execute_script: function () {
            let executable = { content: 'command'};
            bash.interpret = x => 'interpreted ' + x;
            assertEquals('interpreted command', bash.execute(executable, 'command'));
        },
        execute_notFound: function () {
            bash.interpret = x => 'interpreted ' + x;
            assertErrorThrown(bash.execute, null);
        },
    };
    t$.testSuites.push(ts);

    ts = {name: 'bash - interpret'};
    ts.before = function (sys) {
        initBash(sys);
        sys.fs.get = x => 'got ' + x;
        bash.execute = x => 'executed ' + x;
        bash.builtins = {builtin: x => 'builtin executed ' + x};
        bash.getFromPath = x => 'PATH/' + x;
    };
    ts.tests = {
        interpret_empty: function () {
            assertEquals(undefined, bash.interpret(''));
        },
        interpret_isPath: function () {
            assertEquals('executed got ./path', bash.interpret('./path'));
        },
        interpret_builtin: function () {
            assertEquals('builtin executed builtin', bash.interpret('builtin'));
        },
        interpret_fromPath: function () {
            assertEquals('executed PATH/command', bash.interpret('command'));
        },
    };
    t$.testSuites.push(ts);

    ts = {name: 'bash - getFromPath', before: initBash};
    ts.tests = {
        getFromPath_first: function (sys) {
            let file = Symbol();
            t$.mockFsGet(sys.fs, '1/file', file);
            sys.context.env.PATH = '1:2:3';
            assertEquals(file, bash.getFromPath('file'));
        },
        getFromPath_inTheMiddle: function (sys) {
            let file = Symbol();
            t$.mockFsGet(sys.fs, '2/file', file);
            sys.context.env.PATH = '1:2:3';
            assertEquals(file, bash.getFromPath('file'));
        },
        getFromPath_last: function (sys) {
            let file = Symbol();
            t$.mockFsGet(sys.fs, '3/file', file);
            sys.context.env.PATH = '1:2:3';
            assertEquals(file, bash.getFromPath('file'));
        },
        getFromPath_notFound: function (sys) {
            sys.fs.get = x => x === '4/file' ? true : false ;
            sys.context.env.PATH = '1:2:3';
            assertEquals(false, bash.getFromPath('file'));
        },
    };
    t$.testSuites.push(ts);

}(window.t$ = window.t$ || {}));
