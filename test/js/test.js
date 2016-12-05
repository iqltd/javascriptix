"use strict";

var results;

function toggleResults(id) {
    document.getElementById(id).classList.toggle('hidden');
}

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

function assertEquals(obj1, obj2) {
    if (obj1 !== obj2) {
        throw "Assertion failed. [" + obj1 + "] not equal to [" + obj2 + "]";
    }
}

window.onload = function () {
    var j$, user, testSuites, testSuite, test, tsId, header, section, count, countFailed;
    
    j$ = window.j$;
    results = document.getElementById("results");

    testSuites = [];
    testSuites.push({
        name: "extractCommand",
        extractCommand_nominal: function () {
            assertEquals('aaa', j$.bash.extractCommand('aaa'));
        },
        extractCommand_spaces: function () {
            assertEquals('aaa', j$.bash.extractCommand('    aaa    '));
        },
        extractCommand_threeWords: function () {
            assertEquals('aaa', j$.bash.extractCommand('    aaa    bbb  cc   '));
        }
    });
    
    user = j$.users.guest;
    
    testSuites.push({
        name: "fileSystemObject",
        fileAppend: function () {
            var file = new j$.fs.touch('test', j$.fs.root, user);
            file.content = 'prefix';
            file.append('appended');
            assertEquals('prefixappended', file.content);
        },
        fileOverwrite: function () {
            var file = new j$.fs.touch('test', j$.fs.root, user);
            file.content = 'oldtext';
            file.overwrite('newtext');
            assertEquals('newtext', file.content);
        },
        filePath_level1: function () {
            var file = j$.fs.touch('name', j$.fs.root, user);
            assertEquals('/name', file.path());
        },
        filePath_level2: function () {
            var file = j$.fs.touch('name', j$.fs.mkdir('parent', j$.fs.root, user), user);
            assertEquals('/parent/name', file.path());
        },
        dirPath_root: function () {
            var file = j$.fs.mkdir('name', null, user);
            assertEquals('name/', file.path());
        },
        dirPath_level1: function () {
            var file = j$.fs.mkdir('name', j$.fs.root, user);
            assertEquals('/name/', file.path());
        },
        dirPath_level2: function () {
            var file = j$.fs.mkdir('name', j$.fs.mkdir('parent', j$.fs.root, user), user);
            assertEquals('/parent/name/', file.path());
        }
    });
    
    j$.fs.mkdir('level1', j$.fs.root, user);
    j$.fs.touch('fileNameWithStrangeCharacters []', j$.fs.root, user);
    
    testSuites.push({
        name: "parsePath",
        fsGet_level1_normal: function () {
            var found = j$.fs.mkdir('level1', j$.fs.root, user);
            assertEquals(found, j$.fs.get("/level1"));
        },
        fsGet_level1_slashesAtTheEnd: function () {
            var found = j$.fs.mkdir('level1', j$.fs.root, user);
            assertEquals(found, j$.fs.get("/level1////"));
        },
        fsGet_level1_moreSlashes: function () {
            var found = j$.fs.mkdir('level1', j$.fs.root, user);
            assertEquals(found, j$.fs.get("///level1"));
        },
        fsGet_root_normal: function () {
            assertEquals(j$.fs.root, j$.fs.get("/"));
        },
        fsGet_root_moreSlashes: function () {
            assertEquals(j$.fs.root, j$.fs.get("//////"));
        },
        fsGet_fileNameWithStrangeCharacters_moreSlashes: function () {
            var level1 = j$.fs.mkdir('level1', j$.fs.root, user),
                fileName = "fileNameWithStrangeCharacters !@#$%^&*()_-+={}[];:\\|'",
                found = j$.fs.touch(fileName, level1, user);
            assertEquals(found, j$.fs.get("////level1//////////////////" + fileName + "//////////////"));
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