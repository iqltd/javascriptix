(function (j$) {
    'use strict';
    
    var metacharacters;
    
    j$.bash = {};
    
    j$.bash.extractCommand = function (input) {
        input = input.trim();
        var idx = input.slice(0).indexOf(' '),
            word = idx === -1 ? input
                : input.substr(0, idx);
        return word;
    };
    
    j$.bash.tokenize = function (input) {
        var i = 0,
            start = 0,
            closing = null,
            tokens = [];
        
        function addToken(index) {
            if (index >= 0 && index >= start) {
                var token = input.substring(start, index + 1);
                tokens.push(token);
                start = index + 1;
            }
        }
        
        function checkIfComplete(index) {
            if (input[index] === closing) {
                addToken(index);
                closing = null;
            }
        }
        
        function checkIfMeta(index) {
            switch (input[index]) {
            case ' ':
            case '\t':
                addToken(index - 1);
                start++;
                break;
            case '\n':
            case '|':
            case '&':
            case ';':
            case '<':
            case '>':
            case '(':
            case ')':
                addToken(index - 1);
                addToken(index);
                break;
            case '"':
            case "'":
                addToken(index - 1);
                closing = input[index];
                break;
            }
        }
        
        for (i = 0; i < input.length; i++) {
            if (closing) {
                checkIfComplete(i);
            } else {
                checkIfMeta(i);
            }
        }
        addToken(i - 1);
        return tokens;
    };

    j$.bash.interpret = function (userInput) {
        var tokens = j$.bash.tokenize(userInput),
            file,
            command,
            i = 0;
        if (userInput.length > 0) {
            command = tokens[0];
            if (userInput.indexOf('/') > -1) {
                file = j$.fs.get(command);
            } else {
                file = j$.fs.getFromPATH(command);
            }
            if (file) {
                if (file.content instanceof Function) {
                    return file.content(tokens);
                } else {
                    j$.bash(file.content);
                }
            } else {
                throw new Error(command + ': command not found');
            }
        }
        return '';
    };
}(window.j$ = window.j$ || {}));