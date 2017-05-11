define(['test/tools', 'test/mocks'], function (t$, mocks) {
    let assertEquals = t$.assertEquals;
    let assertErrorThrown = t$.assertErrorThrown;

    let bash = {};

    function initBash(sys) {
        bash = mocks.initBash(sys);
    }

    let ts1 = {name: 'bash - execute', before: initBash};
    ts1.tests = {
        execute_binary: function () {
            let executable = { content: () => 'executed'};
            assertEquals('executed', bash.execute(executable)());
        },
        execute_notFound: function () {
            bash.interpret = x => 'interpreted ' + x;
            assertErrorThrown(bash.execute(null), null);
        },
    };

    let ts2 = {name: 'bash - getFromPath', before: initBash};
    ts2.tests = {
        getFromPath_first: function (sys) {
            let file = Symbol();
            mocks.mockFsGet(sys.fs, '1/file', file);
            sys.context.env.PATH = '1:2:3';
            assertEquals(file, bash.getFromPath('file'));
        },
        getFromPath_inTheMiddle: function (sys) {
            let file = Symbol();
            mocks.mockFsGet(sys.fs, '2/file', file);
            sys.context.env.PATH = '1:2:3';
            assertEquals(file, bash.getFromPath('file'));
        },
        getFromPath_last: function (sys) {
            let file = Symbol();
            mocks.mockFsGet(sys.fs, '3/file', file);
            sys.context.env.PATH = '1:2:3';
            assertEquals(file, bash.getFromPath('file'));
        },
        getFromPath_notFound: function (sys) {
            sys.fs.get = x => x === '4/file' ? true : false ;
            sys.context.env.PATH = '1:2:3';
            assertEquals(false, bash.getFromPath('file'));
        },
    };

    return [ ts1, ts2 ];

});
