"use strict";

var results;

function show_result(result, detail) {
    var header, details;
	results = document.getElementById("results");
	header = document.createElement("P");
	header.textContent = result;
    header.classList.add("result");
	results.appendChild(header);
    
    if (detail) {
        header.classList.add("failed");
        details = document.createElement("P");
        details.textContent = detail;
        details.classList.add("details");
        results.appendChild(details);
    } else {
        header.classList.add("passed");
    }
}

function assertEquals(obj1, obj2) {
    if (obj1 !== obj2) {
        throw "Assertion failed. [" + obj1 + "] not equal to [" + obj2 + "]";
    }
}

window.onload = function () {
    var testSuite, test;
    
    results = document.getElementById("results");

    testSuite = {
        extractCommand_nominal: function () {
            assertEquals('aaa', extractCommand('aaa'));
        },
        extractCommand_spaces: function () {
            assertEquals('aaa', extractCommand('    aaa    '));
        },
        extractCommand_threeWords: function () {
            assertEquals('aaa', extractCommand('    aaa    bbb  cc   '));
        },
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
    };

    for (test in testSuite) {
        if (testSuite.hasOwnProperty(test)) {
            try {
                testSuite[test]();
                show_result(test + " PASSED.");
            } catch (err) {
                show_result(test + " FAILED!", err);
            }
        }
    }
};