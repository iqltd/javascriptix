window.onload = function () {
    'use strict';

    var j$Div = document.getElementById("javashcript"),
        stdin = document.createElement("TEXTAREA"),
        results = document.createElement("DIV"),
        prompt = document.createElement("SPAN"),
        j$ = window.j$;
        
    function readUserInput() {
        return stdin.value.trim();
    }

    function resetPrompt() {
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
            span.textContent = j$.context.promptString();
            line.appendChild(span);
        }
        if (text) {
            info = document.createElement("SPAN");
            info.textContent = text;
            line.appendChild(info);
        }
    }

    function listen(e) {
        if (e.keyCode === 13) {
            var userInput = readUserInput();
            show(userInput, true);
            try {
                show(j$.bash.interpret(userInput));
            } catch (err) {
                show(err.message);
            }

            resetPrompt();
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
        prompt.textContent = j$.context.promptString();

        j$Div.appendChild(results);
        j$Div.appendChild(prompt);
        j$Div.appendChild(stdin);
    }
    
    j$.init();
    buildUi();
};