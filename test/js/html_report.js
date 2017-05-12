
requirejs.config({
    baseUrl: '../src/js',
    paths: {
        test: '../../test/js'
    }
});

requirejs(['test/runner'], function (t$) {

    function createReport(results) {
        let report = createReportSection();
        report.appendChild(createReportBody(results));
        return report;
    }

    function createReportSection() {
        return createElement('DIV');
    }

    function createReportBody(results) {
        let reportBody = createElement('DIV');        
        reportBody.appendChild(createFailuresSection(results));
        reportBody.appendChild(createSuccessesSection(results));
        return reportBody;
    }

    function createFailuresSection(results) {
        let failuresSection = createElement('DIV');
        let failures = results.filter(result => result.failed);
        if (failures && failures.length > 0) {
            failuresSection.appendChild(createElement('H2', 'Failed test suites:'));
            failures.forEach((testSuiteResult, index) => {
                let id = idForFailure(index);
                failuresSection.appendChild(createTestSuiteResultFailureSectionTitle(testSuiteResult, id));
                failuresSection.appendChild(createTestSuiteResultSection(testSuiteResult, id));
            });            
        }
        return failuresSection;
    }

    function idForFailure(index) {
        return 'ts-' + index;
    }

    function createSuccessesSection(results) {
        let successSection = createElement('DIV');
        let successes = results.filter(result => !result.failed);
        if (successes) {
            successSection.appendChild(createElement('H2', 'Passed test suites:'));
            successes.forEach((testSuiteResult, index) => {
                let id = idForSuccess(index);
                successSection.appendChild(createTestSuiteResultSuccessSectionTitle(testSuiteResult, id));
                successSection.appendChild(createTestSuiteResultSection(testSuiteResult, id));
            });            
        }
        return successSection;
    }

    function idForSuccess(index) {
        return 'ts' + index;
    }

    function createTestSuiteResultSuccessSectionTitle(testSuiteResult, id) {
        let tsTitle = createTestSuiteTitle(id, testSuiteResult.name);
        tsTitle.classList.add('passed');
        tsTitle.textContent += ` (${testSuiteResult.all})`;
        return tsTitle;
    }

    function createTestSuiteResultFailureSectionTitle(testSuiteResult, id) {
        let tsTitle = createTestSuiteTitle(id, testSuiteResult.name);
        tsTitle.textContent += ` - ${testSuiteResult.failed} out of ${testSuiteResult.all} test(s) failed.`;
        tsTitle.classList.add('failed');
        return tsTitle;
    }

    function createTestSuiteTitle(tsId, text) {
        let title = createElement('H3', text, tsId + '-header');
        title.addEventListener('click', () => toggle(tsId));
        return title;
    }

    function createElement(type, text, id) {
        let element = document.createElement(type);
        if (id) {
            element.id = id;                        
        }
        element.textContent = text;
        return element;
    }

    function toggle(id) {
        let element = document.getElementById(id);
        if (element) {
            element.classList.toggle('hidden');
        }
    }

    function createTestSuiteResultSection(testSuiteResult, id) {
        let section = createTestSuiteSection();
        section.appendChild(createTestResultsSection(testSuiteResult.testResults, id));
        return section;
    }

    function createTestResultsSection(results, id) {
        let testResultsSection = createElement('DIV', null, id);
        testResultsSection.classList.add('hidden');
        results.forEach(result => {
            if (result.failed) {
                testResultsSection.appendChild(createTestSummary(result.name, false));
                testResultsSection.appendChild(createTestDetails(result.error));
                testResultsSection.classList.remove('hidden');
            } else {
                testResultsSection.appendChild(createTestSummary(result.name));
            }
        });
        return testResultsSection; 
    }

    function createTestSuiteSection() {
        return createElement('DIV');
    }

    function createTestSummary(test, success = true) {
        let result = test + (success ? '' : ' - FAILED!');
        let summary = createElement('P', result);
        summary.classList.add('result');
        summary.classList.add(success ? 'normal' : 'failed');
        return summary;
    }

    function createTestDetails(err) {
        let fileName = err.fileName ? err.fileName.substr(err.fileName.lastIndexOf('/') + 1) : 'unknown';
        let details = createElement('P', `${err} - ${fileName} (line  ${err.lineNumber})`);
        details.classList.add('details');
        return details;
    }

    let results = t$.runTestSuites(t$.testSuites);
    const report = createReport(results);
    document.getElementById('results').appendChild(report);
    
});
