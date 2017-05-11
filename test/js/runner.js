define(['test/mocks', 'test/auth', 'test/bash_tokens', 'test/bash', 'test/bin', 'test/builtin', 'test/fs'], 
    function (mocks, ...testPlans) {

        function getTestSuites() {
            let testSuites = [];
            testPlans.forEach(e => testSuites = testSuites.concat(e));
            return testSuites;
        }

        function runTestSuites(filters) {
            let testSuiteResults = [];
            let testSuites = getTestSuites(filters);
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
                        let sys = mocks.initSystem();
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

        return {
            runTestSuites 
        };
    });
