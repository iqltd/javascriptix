
window.onload = function () {

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
        results.forEach((testSuiteResult, index) => {
            let id = testSuiteResultId(index);
            reportBody.appendChild(createTestSuiteResultSectionTitle(testSuiteResult, id));
            reportBody.appendChild(createTestSuiteResultSection(testSuiteResult, id));
        });
        return reportBody;
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
            tsTitle.textContent += ` (${testSuiteResult.count})`;
            tsTitle.click();
        }        
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
        results.forEach(result => {
            if (result.failed) {
                testResultsSection.appendChild(createTestSummary(result.name, false));
                testResultsSection.appendChild(createTestDetails(result.error));
            } else {
                testResultsSection.appendChild(createTestSummary(result.name));
                testResultsSection.classList.add('hidden');
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

    let results = window.t$.runTestSuites(window.t$.testSuites);
    const report = createReport(results);
    document.getElementById('results').appendChild(report);
    
};


