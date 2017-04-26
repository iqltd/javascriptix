(function (j$) {

    var j$Div, stdin, results, prompt;

    function readUserInput() {
        return stdin.value.trim();
    }

    function resetPrompt(context, string) {
        stdin.value = '';
        prompt.textContent = string || context.promptString();
    }

    function newElement(elementType, classList, textContent, id) {
        var element = document.createElement(elementType);
        element.textContent = textContent;
        element.id = id;
        classList.forEach(function (crt) {
            element.classList.add(crt);
        });
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

    function listen(sys, e) {
        if (e.keyCode === 13) {
            processInput(sys, readUserInput());
            return false;
        }
    }

    function buildUi(sys) {
        let context = sys.context;
        j$Div = document.getElementById('javascriptix');
        j$Div.innerHTML = '';
        stdin = newElement('textarea', ['commandText', 'normalText'], '', 'stdin');
        results = newElement('div', ['commandText', 'normalText'], '', 'results');
        prompt = newElement('span', ['commandText', 'promptText'], '', 'prompt');

        stdin.addEventListener('keypress', listen.bind(null, sys));
        resetPrompt(context);

        j$Div.appendChild(results);
        j$Div.appendChild(prompt);
        j$Div.appendChild(stdin);
        stdin.focus();
    }

    function processInput(sys, userInput) {
        let [bash, context, fs] = [j$.bash, sys.context, sys.fs];
        let promptString;
        show(userInput, true);
        let [input, output, error]  = [fs.getFile(0), fs.getFile(1), fs.getFile(2)];
        input.append(userInput + '\n');
        if (bash.process()) {
            show(error.readline());
            show(output.readline());
            input.consume();
        } else {
            promptString = '> ';
            input.rewind();
        }
        resetPrompt(context, promptString);
    }

    j$.__Terminal = function(system) {
        this.init =  buildUi.bind(this, system);
        this.processInput = processInput.bind(this, system);
        this.init();
    };

}(window.j$ = window.j$ || {}));
