"use strict";

var results;

function addTestSuiteHeader(tsId, text) {
    var ts = document.createElement("H3");
    ts.setAttribute("id", tsId + "-header");
    ts.textContent = text;
    ts.addEventListener("click", function () { toggleResults(tsId); });
    results.appendChild(ts);
    return ts;
}

function addTestSuiteDiv(tsId) {
    var ts = document.createElement("DIV");
    ts.setAttribute("id", tsId);
    results.appendChild(ts);
    return ts;
}

function show_result(appendTo, result, detail) {
    var header, details;
	header = document.createElement("P");
	header.textContent = result;
    header.classList.add("result");
	appendTo.appendChild(header);
    
    if (detail) {
        header.classList.add("failed");
        details = document.createElement("P");
        details.textContent = detail;
        details.classList.add("details");
        appendTo.appendChild(details);
    } 
}

function toggleResults(id) {
    document.getElementById(id).classList.toggle('hidden');
}

function assertEquals(obj1, obj2) {
    if (obj1 !== obj2) {
        throw "Assertion failed. [" + obj1 + "] not equal to [" + obj2 + "]";
    }
}

window.onload = function () {
    var testSuites, testSuite, test, tsId, header, section, count, countFailed;
    
    results = document.getElementById("results");

    testSuites = [];
    testSuites.push({
        name: "extractCommand",
        extractCommand_nominal: function () {
            assertEquals('aaa', extractCommand('aaa'));
        },
        extractCommand_spaces: function () {
            assertEquals('aaa', extractCommand('    aaa    '));
        },
        extractCommand_threeWords: function () {
            assertEquals('aaa', extractCommand('    aaa    bbb  cc   '));
        }
    });
    
    testSuites.push({
        name: "fileSystemObject",
        fileAppend: function () {
            var file = new File('test', null, {});
            file.content = 'prefix';
            file.append('appended');
            assertEquals('prefixappended', file.content);
        },
        fileOverwrite: function () {
            var file = new File('test', null, {});
            file.content = 'oldtext';
            file.overwrite('newtext');
            assertEquals('newtext', file.content);
        },
        filePath_root: function () {
            var file = new File('name', null, {});
            assertEquals('name', file.path());
        },
        filePath_level1: function () {
            var file = new File('name', new Directory('', null, {}), {});
            assertEquals('/name', file.path());
        },
        dirPath_level2: function () {
            var file = new File('name', new Directory('parent', new Directory('', null, {}), {}), {});
            assertEquals('/parent/name', file.path());
        },
        dirPath_root: function () {
            var file = new Directory('name', null, {});
            assertEquals('name/', file.path());
        },
        dirPath_level1: function () {
            var file = new Directory('name', new Directory('', null, {}), {});
            assertEquals('/name/', file.path());
        },
        dirPath_level2: function () {
            var file = new Directory('name', new Directory('parent', new Directory('', null, {}), {}), {});
            assertEquals('/parent/name/', file.path());
        }
    });
    
    for (var i = 0; i < testSuites.length; i++) {
        testSuite = testSuites[i];
        tsId = "ts" + i;
        header = addTestSuiteHeader(tsId, testSuite.name);
        section = addTestSuiteDiv(tsId);
        count = 0;
        countFailed = 0;
        for (test in testSuite) {
            if (testSuite[test] instanceof Function) {
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