'use strict';

var stdin,
    results,
    currentUser,
    workingDirectory,
    promptString = '$ ';

window.onload = function () {
    stdin = document.getElementById("stdin");
    results = document.getElementById("results");
    
    var promptText = document.createTextNode(promptString + ' ');
    document.getElementById("prompt").appendChild(promptText);
    
    currentUser = users.guest;
    initFs();
    workingDirectory = fs.get('/home/guest');
};

function readUserInput() {
	return stdin.value.trim();
}

function resetPrompt() {
	stdin.value = '';
}

function show(text, showPromptText) {
    var line = document.createElement("DIV");
    results.appendChild(line);
    
    if (showPromptText) {
        var span = document.createElement("SPAN");
        span.classList.add("commandText");
        span.classList.add("promptText");
        span.textContent = promptString;
        line.appendChild(span);
    }
    if (text) {
        var info = document.createElement("SPAN")
        info.textContent = text;
        line.appendChild(info);
    }
}

function listen(e) {
	if (e.keyCode === 13) {
        var userInput = readUserInput();
        show(userInput, true);
        try {
            show(interpret(userInput));
        } catch(err) {
            show(err);
        }
        
        resetPrompt();
        return false;
    }
}