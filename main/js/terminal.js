window.onload = function () {
    'use strict';

    var j$Div = document.getElementById("javascriptix"),
        stdin = document.createElement("TEXTAREA"),
        results = document.createElement("DIV"),
        prompt = document.createElement("SPAN"),
        j$ = window.j$;
    
    j$.test = {};
        
    function readUserInput() {
        return stdin.value.trim();
    }

    function resetPrompt() {
        prompt.textContent = j$.context.promptString();
        stdin.value = '';
    }
    
    function continueOnNextLine() {
        prompt.textContent = '>';
        stdin.value = '';
    }

    function show(text, showPromptText) {
        var line = document.createElement("DIV"),
            span,
            info;
        results.appendChild(line);

        if (showPromptText) {
            span = document.createElement("SPAN");
            span.classList.add("commandText");
            span.classList.add("promptText");
            span.textContent = prompt.textContent;
            line.appendChild(span);
        }
        if (text) {
            info = document.createElement("SPAN");
            info.textContent = text;
            line.appendChild(info);
        }
    }
    
    j$.test.processInput = function (userInput) {
        show(userInput, true);
        try {
            show(j$.bash.interpret(userInput));
        } catch (err) {
            if (err.statementIncomplete) {
                continueOnNextLine();
                return;
            }
            show(err.message);
            throw err;
        }
        resetPrompt();
    };

    function listen(e) {
        if (e.keyCode === 13) {
            j$.test.processInput(readUserInput());
            return false;
        }
    }
    
    function buildUi() {
        stdin.id = "stdin";
        stdin.classList.add("commandText");
        stdin.classList.add("normalText");
        stdin.addEventListener("keypress", listen);

        results.id = "results";
        results.classList.add("commandText");
        results.classList.add("normalText");

        prompt.id = "prompt";
        prompt.classList.add("commandText");
        prompt.classList.add("promptText");
        resetPrompt();
        
        j$Div.appendChild(results);
        j$Div.appendChild(prompt);
        j$Div.appendChild(stdin);
    }
    
    j$.init();
    buildUi();
};