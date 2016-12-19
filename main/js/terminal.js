window.onload = function () {
    'use strict';
    
    var j$Div, stdin, results, prompt,
        j$ = window.j$;

    function readUserInput() {
        return stdin.value.trim();
    }

    function resetPrompt(string) {
        prompt.textContent = string ? string : j$.context.promptString();
        stdin.value = '';
    }

    function newElement(elementType, classList, textContent, id) {
        var i, element = document.createElement(elementType);
        element.textContent = textContent;
        element.id = id;
        for (i = 0; i < classList.length; i++) {
            element.classList.add(classList[i]);
        }
        return element;
    }

    function show(text, showPromptText) {
        var line = document.createElement('div');
        if (showPromptText) {
            line.appendChild(newElement('span', ['commandText', 'promptText'], prompt.textContent));
        }
        if (text) {
            line.appendChild(newElement('span', ['preformatted'], text));
        }
        results.appendChild(line);
    }
    
    function listen(e) {
        if (e.keyCode === 13) {
            j$.terminal.processInput(readUserInput());
            return false;
        }
    }
    
    function buildUi() {
        j$Div = document.getElementById("javascriptix");
        stdin = newElement('textarea', ['commandText', 'normalText'], '', 'stdin');
        results = newElement('div', ['commandText', 'normalText'], '', 'results');
        prompt = newElement('span', ['commandText', 'promptText'], '', 'prompt');

        stdin.addEventListener("keypress", listen);
        resetPrompt();
        
        j$Div.appendChild(results);
        j$Div.appendChild(prompt);
        j$Div.appendChild(stdin);
    }
    
    j$.terminal = {};
    
    j$.terminal.processInput = function (userInput) {
        var promptString;
        show(userInput, true);
        try {
            show(j$.bash.interpret(userInput));
        } catch (err) {
            if (err instanceof j$.bash.IncompleteInputError) {
                promptString = '> ';
            } else {
                show(err.message);
                throw err;
            }
        }
        resetPrompt(promptString);
    };
    
    j$.init();
    buildUi();
};