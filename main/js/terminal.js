(function (j$) {
    'use strict';

    var stdin = document.getElementById("stdin"),
        results = document.getElementById("results"),
        prompt = document.getElementById("prompt"),
        promptString = '$ ';
    
    prompt.textContent = promptString + ' ';

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
            span.textContent = promptString;
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
                show(j$.bash(userInput));
            } catch (err) {
                show(err);
            }

            resetPrompt();
            return false;
        }
    }
}(window.j$ = window.j$ || {}));


window.onload = function () {
    'use strict';
    
    var j$ = window.j$;
    j$.currentUser = j$.users.guest;
    j$.initFs();
    j$.workingDirectory = j$.fs.get('/home/guest');
};