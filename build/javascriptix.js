define('auth',[],function () {
    
    let nextUid = 100,
        nextGid = 100;

    function Group(name, gid) {
        this.name = name;
        this.gid = gid || nextGid++;
    }

    function User(name, details = {}) {
        this.name = name;
        this.shell = details.shell;
        this.home = details.home || '/home/' + name;
        this.uid = details.uid || nextUid++;
        this.group = details.group || new Group(this.name);
    }
    
    function addUser(users, name, details) {
        if (users.has(name)) {
            throw new Error(`User ${name} exists already`);
        }
        let user = new User(name, details);
        users.set(name, user);
        return user;
    }
    
    function removeUser(users, name) {
        if (!users.delete(name)) {
            throw new Error(`User ${name} doesn't exist`);
        }
    }
    
    return function () {
        var users = new Map();
        this.root = new User('root', { shell: '/bin/bash', home: '/root', uid: '0', group: new Group('0', 'root')}); 
        this.addUser = addUser.bind(null, users);
        this.removeUser = removeUser.bind(null, users);
    };
    
});
define('fs',[],function () {

    class FileSystemObject {
        constructor (name, parent, user) {
            this.name = name;
            this.parent = parent;
            this.inode = 0;
            this.user = user;
            this.group = user.group;
            this.isRoot = this.parent === null;    
        }

        get path() {
            if (this.isRoot) {
                return '/';
            }
            var ending = (this.isDirectory) ? '/' : '';

            return this.parent.path + this.name + ending;
        }
    }

    class File extends FileSystemObject {
        constructor (name, parent, user) {
            super(name, parent, user);
            this.content = '';
            this.readPointer = 0;
        }

        append(text) {
            this.content += text;
        } 

        write(text) {
            this.content = text;
            this.readPointer = 0;
        }

        isEmpty() {
            return !this.content.length;
        }

        readline() {
            let old = this.readPointer;
            this.readPointer = this.content.includes('\n') ? this.content.indexOf('\n')
                : this.content.length;
            return this.content.slice(old, this.readPointer);
        }
        
        read() {
            let old = this.readPointer;
            this.readPointer = this.content.length;
            return this.content.slice(old, this.readPointer);
        }

        rewind() {
            this.readPointer = 0;
        }

        consume() {
            this.content = this.content.slice(this.readPointer);
            this.readPointer = 0;
        }

        execute(args) {
            if (this.content instanceof Function) {
                return this.content(args);
            } else {
                throw 'Script running not supported';
            }
        }
    }

    class Directory extends FileSystemObject {
        constructor (name, parent, user) {
            super(name, parent, user);
            this.content = new Map();
            this.content.set('.', this);
            this.content.set('..', parent);
            this.isDirectory = true;
        }

        isEmpty() {
            return this.content.entries.length === 2;
        }

        getChild(name) {
            return this.content.get(name);
        }

        list() {
            let files = [];
            let keys = this.content.keys();
            let next = keys.next();
            while (!next.done){
                files.push(next.value);
                next = keys.next();
            }
            return files;
        }
    }

    function mkdir(name, parent, user) {
        let newDir = new Directory(name, parent, user);
        if (parent) {
            parent.content.set(name, newDir);
        }
        return newDir;
    }

    function touch(name, parent, user, content = '') {
        var newFile = new File(name, parent, user);
        newFile.content = content;
        parent.content.set(name, newFile);
        return newFile;
    }

    function rm(name, parent) {
        parent.content.delete(name);
    }

    function parsePath(path) {
        var index = 0,
            startingIndex = 0,
            files = [];

        path = path.trim();
        if (path.charAt(0) === '/') {
            files.push('/');
        }

        while (index < path.length) {
            index = path.indexOf('/', startingIndex);
            index = index === -1 ? path.length : index;
            if (index - startingIndex > 0) {
                files.push(path.substring(startingIndex, index));
            }
            startingIndex = index + 1;
        }
        return files;
    }

    function get(path, parent) {
        let file = parent || this.root,
            dirs = parsePath(path);

        let index = 0;
        if (dirs && dirs[0] === '/') {
            file = this.root;
            index = 1;
        }
        while (index < dirs.length && file) {
            file = file.getChild(dirs[index]);
            index++;
        }
        return file;
    }

    function Fs() {
        let root = new Directory('/', null, 0);
        this.root = root;
        this.mkdir = mkdir;
        this.touch = touch;
        this.rm = rm;
        this.get = get.bind(this);
        this.parsePath = parsePath;
    }

    return Fs;

});

define('context',[],function () {

    var promptSymbol = '$';

    function Context(username, auth, fs) {
        let user = auth.addUser(username, '/bin/bash');
        let homeDir = fs.mkdir(username, fs.get('/home'), user);
        
        let message = 'Welcome to javascriptix, the linux-like terminal in your browser! \n\nIf you are reading this, then you already know how to do cat.\nWhy not try other commands as well?\n\nHave fun! :)';
        fs.touch('readme', homeDir, user, message);

        this.user = user;
        this.env = {
            HOSTNAME: 'javascriptix',
            PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
        };
        this.umask = 0o022;
        this.directory = fs.get(user.home);
        this.promptString = () => `${user.name}@${this.env.HOSTNAME} ${promptSymbol} `;
    }
    
    return Context;

});
define('system',['auth', 'fs', 'context'], function (Auth, Fs, Context) {

    // The system should be initialized only once
    var auth = auth || new Auth();
    var fs = fs || new Fs();

    function getFileByPath(path) {
        return path.startsWith('/') ? fs.get(path)  
            : fs.get(path, context.directory);
    }

    function getFileByDescriptor(descriptor) {
        switch (descriptor) {
        case 0:
            return fs.get('/dev/stdin');
        case 1:
            return fs.get('/dev/stdout');
        case 2:
            return fs.get('/dev/stderr');
        }
    }

    let addDirs = (parent, names) => names.forEach(el => fs.mkdir(el, parent, 0));
    let addFiles = (parent, names) => names.forEach(el => fs.touch(el, parent, 0));

    addDirs(fs.root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'sbin', 'tmp', 'usr', 'var']);
    addDirs(getFileByPath('/usr'), ['bin', 'sbin', 'local']);
    addDirs(getFileByPath('/usr/local'), ['bin']);
    addFiles(getFileByPath('/dev'), ['stdin', 'stdout', 'stderr']);

    var context = context || new Context('guest', auth, fs);

    class Io {
        constructor(input, output, err) {
            this.input = input;
            this.output = output;
            this.err = err;
        }

        readInput() {
            return this.input.readline();
        }

        writeOutput(text) {
            if (text) {
                this.output.append(text);
            }
        }

        writeErr(text) {
            if (text) {
                this.err.append(text);
            }
        }
    }

    let io = new Io(getFileByDescriptor(0), getFileByDescriptor(1), getFileByDescriptor(2));

    return {
        auth, fs, context, getFileByPath, getFileByDescriptor, io
    };
});
define('terminal',['system'], function (defaultSystem) {

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
            show(output.read());
            output.consume();
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
    }

    return Terminal;
});

define('builtins',[],function () {
    
    function changeDirectory(fs, context, args) {
        var newDir;
        if (args) {
            if (args[1]) {
                newDir = fs.get(args[1], context.directory);
            } else {
                newDir = fs.get(context.user.home);
            }
        }
        if (newDir) {
            if (newDir.isDirectory) {
                context.directory = newDir;
            } else {
                throw new Error(args[1] + ': Not a directory');
            }
        } else {
            throw new Error(args[1] + ': No such file or directory');
        }
    }
    
    function echo(args) {
        var i, message = '';
        for (i = 1; i < args.length; i++) {
            message += args[i] + ' ';
        }
        return message;
    }

    function init(bash) {
        let fs = bash.getFs();
        let context = bash.getContext();
        bash.builtins = {
            cd: changeDirectory.bind(null, fs, context),
            echo: echo
        };
    }

    return { init };
    
});
define('bash_tokens',[],function () {

    class TokenType {
        constructor(canContain) {
            this.canContain = canContain;        
            this.starts = () => true;
            this.ends = () => true;
            this.adjustEnd = i => i;
        }

        embeddedDetected(text, index) {
            return this.canContain && this.canContain.find(token => token.starts(text, index));  
        }

        afterEmbedded(text, index) {
            return this.embeddedDetected(text, index).getEnd(text, index + 1);
        }

        getEnd(text, index) {
            while (index >= 0 && index <= text.length) {
                if (this.ends(text, index)) {
                    return this.adjustEnd(index);
                }
                if (this.embeddedDetected(text, index)){
                    index = this.afterEmbedded(text, index);
                }
                index++;
            }
            return -2;
        }
    }

    class Token {
        constructor(text, startIndex, endIndex) {
            this.complete = startIndex < endIndex;
            this.word = text.slice(startIndex, endIndex);
            this.rest = text.slice(endIndex);
        }
    }

    let either = (...fcts) => (...args) => fcts.some(f => f.apply(null, args));
    let not = f => (...args) => !f.apply(null, args);

    let matches = chars => (text, index) => chars.includes(text[index]); 
    let matchesUnescaped = chars => (text, index) => chars.includes(text[index]) && text[index - 1] !== '\\'; 
    let inputEnded = (s, i) => s.length < i + 1;

    let comment = new TokenType();
    comment.starts = matchesUnescaped('#'); 
    comment.ends = either(matches('\n'), inputEnded);
    comment.adjustEnd = i => i - 1;

    let metacharacter = new TokenType();
    let isMetacharacter = matchesUnescaped('\n|&;()<>');
    metacharacter.starts = isMetacharacter; 
    metacharacter.ends = () => true;

    let whitespace = new TokenType();
    let isWhitespace = matchesUnescaped(' \t');
    whitespace.starts = isWhitespace;
    whitespace.ends = either(not(isWhitespace), inputEnded);
    whitespace.adjustEnd = i => i - 1;

    let singleQuoted = new TokenType();
    singleQuoted.starts = matchesUnescaped('\'');
    singleQuoted.ends = matches('\'');

    let doubleQuoted = new TokenType();
    doubleQuoted.starts = matchesUnescaped('"');
    doubleQuoted.ends = matchesUnescaped('"');

    let word = new TokenType([singleQuoted, doubleQuoted]);
    word.starts = () => true;
    word.ends = either(inputEnded, isWhitespace, isMetacharacter);
    word.adjustEnd = i => i - 1;

    let findTokenStarting = function (text, i) {
        return [comment, whitespace, metacharacter, word]
            .find(token => token.starts(text, i));
    };

    let shouldBeSkipped = (token) => [comment, whitespace].includes(token);

    function extractWord(text, start = 0) {
        if (start >= text.length) {
            return new Token(text, start, start);
        }    
        let token = findTokenStarting(text, start);
        let end = token.getEnd(text, start) + 1;
        if (shouldBeSkipped(token)) {
            return extractWord(text, end);
        } else {
            return new Token(text, start, end);    
        }
    }

    function tokenizeAll(input) {
        let tokens = [];
        let toTokenize = input;
        while (toTokenize) {
            let result = extractWord(toTokenize);
            if (!result.complete) {
                return;
            }
            tokens.push(result.word);
            toTokenize = result.rest;
        }
        return tokens;
    }

    function init(bash) {
        bash.tokenize = (text) => extractWord(text, 0);
        bash.tokenizeAll = tokenizeAll;
    }

    return { init };

});

define('bash',['system', 'builtins', 'bash_tokens'], function (defaultSystem, builtins, tokens) {

    let isQuote = character => '\'"'.includes(character);
    let stripQuotes = word => {
        return isQuote(word[0]) ? word.substr(1, word.length - 2)
                : word;
    };
    let strip = tokens => tokens.map(stripQuotes);
    let isEmpty = list => list.length == 0;
    let doNothing = () => {}; 

    function process() {
        let io = this.getIo();
        let tokens = this.tokenizeAll(io.readInput());
        if (tokens) {
            let execute = isEmpty(tokens) ? doNothing
                : this.interpret(strip(tokens));
            perform(execute, io);
            return true;
        } 
        return false;
    }

    let isPath = command => command.includes('/');        

    function interpret(tokens) {
        if (tokens.length > 0) {
            let command = tokens[0];
            if (isPath(command)) {
                return this.execute(this.getFs().get(command), tokens, this);
            } else if (this.builtins.hasOwnProperty(command)) {
                return () => this.builtins[command](tokens);
            } else {
                return this.execute(this.getFromPath(command), tokens, this);
            }
        }
    }

    function execute(executable, args) {
        return () => {
            if (executable && executable.content instanceof Function) {
                return executable.content(args);
            } else if (executable) {
                this.getIo().input.consume();
                this.getIo().input.append(args);
                return this.process();
            } else {
                throw new Error(args[0] + ': command not found');
            }
        };
    }

    function perform(execute, io) {
        try {
            let result = execute();
            io.writeOutput(result);
        } catch (err) {
            io.writeErr(err.message);
            /*eslint no-console: ["error", { allow: ["error"] }] */
            console.error(err);
        }
    }

    function getFromPATH(filename) {
        let path = this.getContext().env.PATH;
        let find = p => this.getFs().get(p + '/' + filename);
        let file = path.split(':').find(e => find(e));
        return find(file);
    }

    class Bash {
        constructor(sys) {
            let system = sys || defaultSystem;
            this.getIo = () => system.io;
            this.getSystem = () => system;
            this.getFs = () => system.fs;
            this.getContext = () => system.context;
            this.process = process.bind(this);
            this.interpret = interpret.bind(this);
            this.execute = execute.bind(this);
            this.getFromPath = getFromPATH.bind(this);
            builtins.init(this);
            tokens.init(this);
        }
    }

    return Bash;

});

define('bin',['system'], function (defaultSystem) {

    function getArgument(args, index) {
        if (args.length < index + 1) {
            throw new Error('missing operand');
        }
        return args[index];
    }

    function prepareCreation(fs, path, type, context) {
        var creation = {}, dirs;
        dirs = fs.parsePath(path);
        creation.filename = dirs.pop();
        creation.parent = dirs.length ? fs.get(dirs.join('/')) : context.directory;
        if (!creation.parent) {
            throw new Error(`cannot create ${type} '${path}': No such file or directory`);
        }
        return creation;
    }

    function printWorkingDirectory(sys) {
        return sys.context.directory.path;
    }

    function whoAmI(sys) {
        return sys.context.user.name;
    }

    function clear(sys) {
        sys.terminal.init();
    }

    function listFiles(sys, args) {
        let [fs, context] = [sys.fs, sys.context];
        var files = '', dir;
        if (args.length < 2) {
            dir = context.directory;
        } else {
            dir = fs.get(args[1], context.directory);
        }
        dir.list().forEach(crt => {
            if (!crt.startsWith('.')) {
                files += crt + '\t';
            }
        });
        return files;
    }

    function makeDirectory(sys, args) {
        let [fs, context] = [sys.fs, sys.context];
        let path = getArgument(args, 1);
        if (fs.get(path)) {
            throw new Error(`cannot create directory '${path}': File exists`);
        }
        let creation = prepareCreation(fs, path, 'directory', context);
        fs.mkdir(creation.filename, creation.parent, context.user);
    }

    function touch(sys, args) {
        let [fs, context] = [sys.fs, sys.context];
        var creation = prepareCreation(fs, getArgument(args, 1), 'file', context);
        fs.touch(creation.filename, creation.parent, context.user);
    }

    function rm(sys, args) {
        let [fs, context] = [sys.fs, sys.context];
        var path = getArgument(args, 1),
            file = fs.get(path, context.directory);
        if (!file) {
            throw new Error(`cannot remove '${path}': No such file or directory`);
        }
        fs.rm(file.name, file.parent, context.user);
    }

    function cat(sys, args) {
        let [fs, context] = [sys.fs, sys.context];
        let path = getArgument(args, 1);
        let file = fs.get(path, context.directory);
        if (!file) {
            throw new Error(path + ': No such file or directory');
        }
        if (file.isDirectory) {
            throw new Error(path + ': Is a directory');
        }
        if (file.content instanceof Function) {
            throw new Error(path + ': Is a binary file');
        }
        return file.content;
    }

    function init(sys = defaultSystem) {
        let [fs, auth] = [sys.fs, sys.auth];
        let [root, bin, usrBin] = [auth.root, fs.get('/bin'), fs.get('/usr/bin')];

        fs.touch('pwd', bin, root, printWorkingDirectory.bind(null, sys));
        fs.touch('ls', bin, root, listFiles.bind(null, sys));
        fs.touch('mkdir', bin, root, makeDirectory.bind(null, sys));
        fs.touch('touch', bin, root, touch.bind(null, sys));
        fs.touch('rm', bin, root, rm.bind(null, sys));
        fs.touch('whoami', usrBin, root, whoAmI.bind(null, sys));
        fs.touch('clear', usrBin, root, clear.bind(null, sys));
        fs.touch('cat', bin, root, cat.bind(null, sys));
    }

    return { init };

});

var j$ = {};

define('javascriptix',['terminal', 'bash', 'bin', 'system'], 
    function (Terminal, Bash, bins, system) {
        let init = () => {
            bins.init(); 
            j$.bash = new Bash();   
            j$.terminal = new Terminal(j$.bash);

            j$.terminal.init();

            return system;
        };
        return { init };
    }
);
requirejs.config({
    baseUrl: 'js',
});

requirejs(['javascriptix'], function (j$) {
    j$.init();
});
define("app", function(){});

