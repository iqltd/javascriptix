define(['system'], function (defaultSystem) {

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

    function listen(bash, sys, e) {
        if (e.keyCode === 13) {
            processInput(bash, sys, readUserInput());
            return false;
        }
    }

    function buildUi(bash, sys) {
        let context = sys.context;
        j$Div = document.getElementById('javascriptix');
        j$Div.innerHTML = '';
        stdin = newElement('textarea', ['commandText', 'normalText'], '', 'stdin');
        results = newElement('div', ['commandText', 'normalText'], '', 'results');
        prompt = newElement('span', ['commandText', 'promptText'], '', 'prompt');

        stdin.addEventListener('keypress', listen.bind(null, bash, sys));
        resetPrompt(context);

        j$Div.appendChild(results);
        j$Div.appendChild(prompt);
        j$Div.appendChild(stdin);
        stdin.focus();
    }

    function processInput(bash, sys, userInput) {
        let promptString;
        show(userInput, true);
        let [input, output, error]  = [sys.getFileByDescriptor(0), sys.getFileByDescriptor(1), sys.getFileByDescriptor(2)];
        input.append(userInput);
        if (bash.process()) {
            show(error.readline());
            show(output.readline());
            input.consume();
        } else {
            promptString = '> ';
            input.rewind();
        }
        resetPrompt(sys.context, promptString);
    }

    function Terminal(bash, sys) {
        let system = sys || defaultSystem;
        this.init =  buildUi.bind(this, bash, system);
        this.processInput = processInput.bind(this, bash, system);
        this.init();
    }

    return Terminal;
});
