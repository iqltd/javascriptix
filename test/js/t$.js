(function (t$) {

    var j$ = window.j$;

    function simpleEquals(o1, o2) {
        return o1 === o2;
    }

    function assertTrue(condition) {
        if (!condition) {
            throw new Error('Assertion failed. Condition not true.');
        }
    }

    function assertDefined(o) {
        if (o == undefined || o == null) {
            throw new Error('Assertion failed. Object undefined or null');
        }
    }

    function assertEquals(obj1, obj2, equals = simpleEquals) {
        if (!equals(obj1, obj2)) {
            throw new Error(`Assertion failed. Expected [${obj1}] not equal to [${obj2}]`);
        }
    }

    function arrayEquals(arr1, arr2, equals = simpleEquals) {
        if (arr1 === arr2) {
            return true;
        }
        if (!arr1 || !arr2 || arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (!equals(arr1[i], arr2[i])) {
                return false;
            }
        }
        return true;
    }

    function assertErrorThrown(func, args) {
        let errorId = Symbol();
        try {
            func.call(null, args);
            throw errorId;
        } catch (e) {
            if (e === errorId) {
                throw new Error('Assertion failed. No error was thrown.');
            }

        }
    }


    function runTestSuites(testSuites) {
        let testSuiteResults = [];
        testSuites.forEach(testSuite => {
            runIfDefined(testSuite.beforeAll);
            let testResults = runTests(testSuite);
            runIfDefined(testSuite.afterAll);

            testSuiteResults.push(new TestSuiteResult(testSuite.name, testResults));
        });
        return testSuiteResults;
    }

    function runIfDefined(func = () => {}, arg = undefined) {
        func(arg);
    }

    class TestSuiteResult {
        constructor(name, testResults = []) {
            this.name = name;
            this.testResults = testResults;
        }

        get all() {
            return this.testResults.length;
        }

        get failed() {
            return this.testResults.filter(result => result.failed).length;
        }
    }

    function runTests(testSuite) {
        let testResults = [];        
        let tests = testSuite.tests;
        for (let test in testSuite.tests) {
            if (tests[test] instanceof Function) {
                try {
                    let sys = initSystem();
                    runIfDefined(testSuite.before, sys);
                    tests[test](sys);
                    testResults.push(new TestResult(test));
                } catch (err) {
                    testResults.push(new TestResult(test, err));
                } finally {
                    runIfDefined(testSuite.after);
                }
            }
        }
        return testResults;
    }

    class TestResult {
        constructor(name, error) {
            this.name = name;
            this.error = error;
        }

        get failed() {
            return this.error;
        }
    }

    function mockFsGet(fs, path, file) {
        let oldGet = fs.get;
        fs.get = x => (x === path) ? file : oldGet(x);
    }

    function initSystem() {
        let sys = {};
        sys.auth = new j$.__Auth();
        sys.fs = new j$.__Fs(sys);
        sys.context = new j$.__Context('test', sys);
        window.j$.__initBins(sys);

        let test = sys.fs.mkdir('test', sys.fs.root, sys.auth.root);
        let dir1 = sys.fs.mkdir('dir1', test, sys.auth.root);
        sys.fs.touch('file1', dir1, sys.auth.root);
        sys.fs.touch('file2', dir1, sys.auth.root);
        sys.fs.mkdir('dir2', test, sys.auth.root);
        sys.context.directory = test;
        return sys;
    }

    t$.assertTrue = assertTrue;
    t$.assertDefined = assertDefined;
    t$.assertEquals = assertEquals;
    t$.arrayEquals = arrayEquals;
    t$.runTestSuites = runTestSuites;
    t$.assertErrorThrown = assertErrorThrown;
    t$.initSystem = initSystem;
    t$.mockFsGet = mockFsGet;

}(window.t$ = window.t$ || {}));
