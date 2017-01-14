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
            throw new Error(`Assertion failed. [${obj1}] not equal to [${obj2}]`);
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

    function createElement(type, text, id) {
        let element = document.createElement(type);
        element.id = id;
        element.textContent = text;
        return element;
    }

    function createReport() {
        let report = createElement('DIV');
        let title = createElement('H3', 'Test campaign results:');
        report.appendChild(title);
        return report;
    }

    function toggle(id) {
        let element = document.getElementById(id);
        if (element) {
            element.classList.toggle('hidden');
        }
    }

    function addTestSuiteTitle(appendTo, tsId, text) {
        let title = createElement('H4', text, tsId + '-header');
        title.addEventListener('click', () => toggle(tsId));
        appendTo.appendChild(title);
        return title;
    }

    function addTestSuiteSection(appendTo, tsId) {
        let section = createElement('DIV', null, tsId);
        appendTo.appendChild(section);
        return section;
    }

    function addTestSummary(appendTo, test, success = true) {
        let result = test + (success ? ' - PASSED.' : ' - FAILED!');
        let summary = createElement('P', result);
        summary.classList.add('result');
        summary.classList.add(success ? 'normal' : 'failed');
        appendTo.appendChild(summary);
    }

    function addTestDetails(appendTo, err) {
        let fileName = err.fileName ? err.fileName.substr(err.fileName.lastIndexOf('/') + 1) : 'unknown';
        let details = createElement('P', `${err} - ${fileName} (line  ${err.lineNumber})`);
        details.classList.add('details');
        appendTo.appendChild(details);
    }

    function runIfDefined(func = () => {}, arg = undefined) {
        func(arg);
    }

    function runTests(testSuite, section) {
        let [count, countFailed] = [0, 0];
        let tests = testSuite.tests;
        for (let test in testSuite.tests) {
            if (tests[test] instanceof Function) {
                try {
                    let sys = initSystem();
                    runIfDefined(testSuite.before, sys);
                    tests[test](sys);
                    addTestSummary(section, test);
                } catch (err) {
                    addTestSummary(section, test, false);
                    addTestDetails(section, err);
                    countFailed++;
                } finally {
                    runIfDefined(testSuite.after);
                }
                count++;
            }
        }
        return [count, countFailed];
    }

    function runTestSuites(testSuites) {
        testSuites.forEach((testSuite, i) => {
            let tsId = 'ts' + i;
            let tsTitle = addTestSuiteTitle(report, tsId, testSuite.name);
            let tsSection = addTestSuiteSection(report, tsId);

            runIfDefined(testSuite.beforeAll);
            let [total, failed] = runTests(testSuite, tsSection);
            runIfDefined(testSuite.afterAll);
            if (!failed) {
                tsTitle.classList.add('passed');
                tsTitle.textContent += ` - PASSED (${total} tests)`;
                tsTitle.click();
            } else {
                tsTitle.textContent += ` - FAILED (${failed} out of ${total} tests)`;
                tsTitle.classList.add('failed');
            }
        });
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

    const report = createReport();

    t$.assertTrue = assertTrue;
    t$.assertDefined = assertDefined;
    t$.assertEquals = assertEquals;
    t$.arrayEquals = arrayEquals;
    t$.runTestSuites = runTestSuites;
    t$.assertErrorThrown = assertErrorThrown;
    t$.initSystem = initSystem;
    t$.mockFsGet = mockFsGet;

    t$.init = function () {
        document.body.appendChild(report);
    };

}(window.t$ = window.t$ || {}));
