

function listen(e) {
	if (e.keyCode == 13) {
        interpret(read_command());
        reset_commandline();
        return false;
    }
}

function get_commandline() {
	return document.getElementById("cmd");
}

function read_command() {
	return get_commandline().value.trim();
}

function reset_commandline() {
	get_commandline().value = '';
}

function interpret(command) {
	show(command);
	if (command.length > 0) {
		show(getFirstCommand(command) + ': command not found');
	}
}

function getFirstCommand(command) {
	var idx = command.slice(0).indexOf(' ');
	var word = idx == -1 ? command 
		: command.substr(0, idx);
	return word;
}

function show(command) {
	var results = document.getElementById("results");
	var para = document.createElement("P"); 
	var text = document.createTextNode(command); 
	para.appendChild(text); 
	results.appendChild(para); 
}