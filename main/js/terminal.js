'use strict';

var prompt,
    results,
    currentUser,
    workingDirectory,
    promptString = '$ ';

window.onload = function () {
    prompt = document.getElementById("cmd");
    results = document.getElementById("results");
    
    var promptText = document.createTextNode(promptString + ' ');
    document.getElementById("promptText").appendChild(promptText);
    
    currentUser = users.guest;
    workingDirectory = fs.root.getChild('home').getChild('guest');
};

function readUserInput() {
	return prompt.value.trim();
}

function resetPrompt() {
	prompt.value = '';
}

function show(text) {
    if (text.length > 0) {
        var paragraph = document.createElement("P"),
            textNode = document.createTextNode(text);
        paragraph.appendChild(textNode);
        results.appendChild(paragraph);
    }
}

function listen(e) {
	if (e.keyCode === 13) {
        var userInput = readUserInput();
        show(promptString + ' ' + userInput);
        show(interpret(userInput));
        resetPrompt();
        return false;
    }
}