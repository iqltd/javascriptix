

function interpret(e) {
	if (e.keyCode == 13) {
        var cmd = document.getElementById("cmd");
        addToResults(cmd.value);
        cmd.value = ''
        return false;
    }
	
}

function addToResults(command) {
	var results = document.getElementById("results");
	var para = document.createElement("P");                       // Create a <p> element
	var t = document.createTextNode(command);       			  // Create a text node
	para.appendChild(t);                                          // Append the text to <p>
	results.appendChild(para);                              // Append <p> to <body>

}