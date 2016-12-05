(function (j$) {
    'use strict';
    
    j$.bash = {};
    
    j$.bash.extractCommand = function (input) {
        input = input.trim();
        var idx = input.slice(0).indexOf(' '),
            word = idx === -1 ? input
                : input.substr(0, idx);
        return word;
    };

    j$.bash.interpret = function (userInput) {
        var command, file;
        if (userInput.length > 0) {
            command = j$.bash.extractCommand(userInput);
            file = j$.fs.get(command);
            if (file) {
                if (file.content instanceof Function) {
                    return file.content();
                } else {
                    j$.bash(file.content);
                }
            } else {
                throw command + ': command not found';
            }
        }
        return '';
    };
}(window.j$ = window.j$ || {}));