'use strict';

function extractCommand(input) {
    input = input.trim();
	var idx = input.slice(0).indexOf(' '),
	    word = idx === -1 ? input
		    : input.substr(0, idx);
	return word;
}

function interpret(userInput) {
    var command, file;
	if (userInput.length > 0) {
        command = extractCommand(userInput);
        file = fs.get(command);
        if (file) {
            if (file.content instanceof Function) {
                return file.content();
            } else {
                interpret(file.content);
            }
        } else {
            throw command + ': command not found';
        }
	}
    return '';
}
