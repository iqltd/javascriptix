
function get_commandline() {
    'use strict';
    
	return document.getElementById("cmd");
}

function read_command() {
    'use strict';
    
	return get_commandline().value.trim();
}

function reset_commandline() {
    'use strict';
    
	get_commandline().value = '';
}

function getFirstCommand(command) {
    'use strict';
    
	var idx = command.slice(0).indexOf(' '),
	    word = idx === -1 ? command
		    : command.substr(0, idx);
	return word;
}

function show(command) {
    'use strict';
    
	var results = document.getElementById("results"),
        para = document.createElement("P"),
        text = document.createTextNode(command);
	para.appendChild(text);
	results.appendChild(para);
}

function interpret(command) {
    'use strict';
    
	show(command);
	if (command.length > 0) {
		show(getFirstCommand(command) + ': command not found');
	}
}

function listen(e) {
    'use strict';
    
	if (e.keyCode === 13) {
        interpret(read_command());
        reset_commandline();
        return false;
    }
}