
/* eslint-env node */
/* eslint no-console: 0 */
var requirejs = require('requirejs');

requirejs.config({
    baseUrl: '../src/js',
    paths: {
        test: '../../test/js'
    }
});

requirejs(['test/runner'], function (t$) {

    let results = t$.runTestSuites(t$.testSuites);

    let logTestError = test => {
        console.error('\t', test.name, '-', 'Error:', test.error.message);
    };
    let logSuiteResult = suite => { 
        console.log('-', suite.name, `(Passed: ${suite.passed}/${suite.all})`);
        if (suite.failed) {
            suite.testResults.forEach(logTestError);        
        }
    };

    let passed = results.filter(e => !e.failed);
    if (passed.length) {
        console.log('\nPassed test suites:');
        passed.forEach(logSuiteResult);        
    }

    let failed = results.filter(e => e.failed);
    if (failed.length) {
        console.log('\nFailed test suites:');
        failed.forEach(logSuiteResult);        
    }
    
    let failedTests = results.reduce((total, crt) => total + crt.failed, 0);
    let allTests = results.reduce((total, crt) => total + crt.all, 0);
    console.log('\nSUMMARY:');
    console.log(`All: ${allTests}, Passed: ${allTests - failedTests}, Failed: ${failedTests} `);
});
