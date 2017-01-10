(function (t$) {
    t$.testSuites = t$.testSuites || [];
    
    let j$ = window.j$;
    let assertEquals = t$.assertEquals;
    let arrayEquals = t$.arrayEquals;
    let assertErrorThrown = t$.assertErrorThrown;
    
    let bash = {};
    let sys = {};
    
    function initBash() {
        sys = t$.initSystem();
        bash = new j$.__Bash(sys);
    }
    
    let ts = {name: 'bash - tokenize', beforeAll: initBash};
    ts.tests = {
        tokenize_delimitedBySpace: function () {
            var found = ['a', 'bb', 'ccc'];
            assertEquals(found, bash.tokenize('a bb ccc'), arrayEquals);
        },
        tokenize_delimitedBySpaces: function () {
            var found = ['a', 'bb'];
            assertEquals(found, bash.tokenize(' a  bb '), arrayEquals);
        },
        tokenize_delimitedByAnyMetacharacter: function () {
            var found = ['1', '2', '3', '\n', '4', '|', '5', '&', '6', ';', '7', '(', '8', ')', '9', '<', '10', '>', '11' ];
            assertEquals(found, bash.tokenize('1 2\t3\n4|5&6;7(8)9<10>11'), arrayEquals);
        },
        tokenize_delimitedByMultipleMetacharacters: function () {
            var found = ['1', '\n', '|', '&', ';', '(', ')', '<', '>', '2'];
            assertEquals(found, bash.tokenize('1 \t\n|&;()<>2'), arrayEquals);
        },
        tokenize_singleQuotedDelimitedBySpace: function () {
            var found = ["'single quoted'", "' also single quoted   '"];
            assertEquals(found, bash.tokenize("'single quoted' ' also single quoted   '"), arrayEquals);
        },
        tokenize_doubleQuotedDelimitedBySpace: function () {
            var found = ['"double quoted"', '" also double quoted   "'];
            assertEquals(found, bash.tokenize('"double quoted" " also double quoted   "'), arrayEquals);
        },
        tokenize_doubleQuotedWithEscapedDoubleQuote: function () {
            var found = ['"double \\" quoted"'];
            assertEquals(found, bash.tokenize('"double \\" quoted" '), arrayEquals);
        }
    };
    t$.testSuites.push(ts);
    
    ts = {name: 'bash - execute', before: initBash};
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
            let executable = { content: 'command'};
            bash.interpret = x => 'interpreted ' + x;
            assertErrorThrown(bash.execute, [null]);
        },
    };
    t$.testSuites.push(ts);
    
    ts = {name: 'bash - interpret'};
    ts.before = function () {
        initBash();
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
        getFromPath_first: function () {
            sys.fs.get = x => x === '1/file' ? true : false ;
            sys.context.env.PATH = '1:2:3';
            assertEquals(true, bash.getFromPath('file'));
        },
        getFromPath_inTheMiddle: function () {
            sys.fs.get = x => x === '2/file' ? true : false ;
            sys.context.env.PATH = '1:2:3';
            assertEquals(true, bash.getFromPath('file'));
        },
        getFromPath_last: function () {
            sys.fs.get = x => x === '3/file' ? true : false ;
            sys.context.env.PATH = '1:2:3';
            assertEquals(true, bash.getFromPath('file'));
        },
        getFromPath_notFound: function () {
            sys.fs.get = x => x === '4/file' ? true : false ;
            sys.context.env.PATH = '1:2:3';
            assertEquals(false, bash.getFromPath('file'));
        },
    };
    t$.testSuites.push(ts);

}(window.t$ = window.t$ || {}));