
window.onload = function () {

    function createReport(results) {
        let report = createReportSection();
        report.appendChild(createReportTitle());
        report.appendChild(createReportBody(results));
        return report;
    }

    function createReportSection() {
        return createElement('DIV');
    }

    function createReportTitle() {
        return createElement('H3', 'Test campaign results:');
    }

    function createReportBody(results) {
        let reportBody = createElement('DIV');
        results.forEach((testSuiteResult, index) => {
            reportBody.appendChild(createTestSuiteResultSectionTitle(testSuiteResult, testSuiteResultId(index)));
            reportBody.appendChild(createTestSuiteResultSection(testSuiteResult, testSuiteResultId(index)));
        });
        return reportBody;
    }

    function createTestSuiteResultSection(testSuiteResult, id) {
        let section = createTestSuiteSection(id);
        section.appendChild(createTestResultsSection(testSuiteResult.testResults));
        return section;
    }

    function testSuiteResultId(index) {
        return 'ts' + index;
    }

    function createTestSuiteResultSectionTitle(testSuiteResult, id) {
        let tsTitle = createTestSuiteTitle(id, testSuiteResult.name);
        if (testSuiteResult.countFailed) {
            tsTitle.textContent += ` - FAILED (${testSuiteResult.countFailed} out of ${testSuiteResult.count} tests)`;
            tsTitle.classList.add('failed');
        } else {
            tsTitle.classList.add('passed');
            tsTitle.textContent += ` - PASSED (${testSuiteResult.count} tests)`;
            tsTitle.click();
        }        
        return tsTitle;
    }

    function createTestResultsSection(results) {
        let testResultsSection = createElement('DIV');
        results.forEach(result => {
            if (result.failed) {
                testResultsSection.appendChild(createTestSummary(result.name, false));
                testResultsSection.appendChild(createTestDetails(result.error));
            } else {
                testResultsSection.appendChild(createTestSummary(result.name));
            }
        });
        return testResultsSection; 
    }

    function toggle(id) {
        let element = document.getElementById(id);
        if (element) {
            element.classList.toggle('hidden');
        }
    }

    function createElement(type, text, id) {
        let element = document.createElement(type);
        element.id = id;
        element.textContent = text;
        return element;
    }

    function createTestSuiteTitle(tsId, text) {
        let title = createElement('H4', text, tsId + '-header');
        title.addEventListener('click', () => toggle(tsId));
        return title;
    }

    function createTestSuiteSection(appendTo, tsId) {
        return createElement('DIV', null, tsId);
    }

    function createTestSummary(test, success = true) {
        let result = test + (success ? ' - PASSED.' : ' - FAILED!');
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

    let results = window.t$.runTestSuites(window.t$.testSuites);
    const report = createReport(results);
    document.body.appendChild(report);
    
};


