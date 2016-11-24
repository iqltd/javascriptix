'use strict';

function extractCommand(input) {
	var idx = input.slice(0).indexOf(' '),
	    word = idx === -1 ? input
		    : input.substr(0, idx);
	return word;
}

function interpret(userInput) {
	if (userInput.length > 0) {
		return extractCommand(userInput) + ': command not found';
	}
    return '';
}