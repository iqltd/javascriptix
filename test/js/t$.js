(function (t$) {
    "use strict";
    
    var results;

    window.j$.init.bash();
    
    function simpleEquals(o1, o2) {
        return o1 === o2;
    }

    t$.assertEquals = function (obj1, obj2, equals) {
        if (!equals) {
            equals = simpleEquals;
        }
        if (!equals(obj1, obj2)) {
            throw new Error("Assertion failed. [" + obj1 + "] not equal to [" + obj2 + "]");
        }
    };

    t$.simpleArrayEquals = function (arr1, arr2) {
        var i, length;

        if (arr1 === arr2) {
            return true;
        }
        if (arr1 === null || arr2 === null || arr1.length !== arr2.length) {
            return false;
        }
        for (i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };
    
    function createResultsDiv() {
        var header = document.createElement("H3");
        header.textContent = 'Results:';
        results = document.createElement("DIV");
        results.appendChild(header);
        document.body.appendChild(results);
    }
    
    t$.init = function () {
        createResultsDiv();
    };
    
    function toggleResults(id) {
        document.getElementById(id).classList.toggle('hidden');
    }
    
    function createTestSuiteHeader(tsId, text) {
        var ts = document.createElement("H4");
        ts.setAttribute("id", tsId + "-header");
        ts.textContent = text;
        ts.addEventListener("click", function () { toggleResults(tsId); });
        return ts;
    }
    
    function createTestSuiteDiv(tsId) {
        var ts = document.createElement("DIV");
        ts.setAttribute("id", tsId);
        return ts;
    }

    function show_result(appendTo, result, detail) {
        var header, details, fileName;
        header = document.createElement("P");
        header.textContent = result;
        header.classList.add("result");
        appendTo.appendChild(header);

        if (detail) {
            header.classList.add("failed");
            details = document.createElement("P");
            if (detail.fileName) {
                fileName = detail.fileName.substr(detail.fileName.lastIndexOf('/') + 1);
            }
            details.textContent = detail + ' - ' + fileName + ' (line ' + detail.lineNumber + ')';
            details.classList.add("details");
            appendTo.appendChild(details);
        }
    }
    
    t$.runTestStuites = function (testSuites) {
        var i, test, testSuite, tsId, header, section, count, countFailed;
        for (i = 0; i < testSuites.length; i++) {
            testSuite = testSuites[i];
            tsId = "ts" + i;
            header = createTestSuiteHeader(tsId, testSuite.name);
            results.appendChild(header);
            section = createTestSuiteDiv(tsId);
            results.appendChild(section);
            count = 0;
            countFailed = 0;
            for (test in testSuite) {
                if (testSuite.hasOwnProperty(test) && testSuite[test] instanceof Function) {
                    try {
                        testSuite[test]();
                        show_result(section, test + " - PASSED.");
                    } catch (err) {
                        show_result(section, test + " - FAILED!", err);
                        countFailed++;
                    }
                    count++;
                }
            }
            if (!countFailed) {
                header.classList.add("passed");
                header.textContent += " - PASSED (" + count + " tests)";
                header.click();
            } else {
                header.textContent += " - FAILED (" + countFailed + " out of " + count + " tests)";
                header.classList.add("failed");
            }
        }
    };
}(window.t$ = window.t$ || {}));