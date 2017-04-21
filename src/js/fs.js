(function (j$) {

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
                j$.bash(this.content);
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

    function get(sys, path) {
        var file, index,
            dirs = parsePath(path);

        if (dirs && dirs[0] === '/') {
            file = this.root;
            index = 1;
        } else {
            file = sys.context.directory;
            index = 0;
        }

        while (index < dirs.length && file) {
            file = file.getChild(dirs[index]);
            index++;
        }
        return file;
    }

    function addDirs(parent, names) {
        names.forEach(el => mkdir(el, parent, 0));
    }

    function addFiles(parent, names) {
        names.forEach(el => touch(el, parent, 0));
    }

    function getFile(descriptor) {
        switch (descriptor) {
        case 0:
            return this.get('/dev/stdin');
        case 1:
            return this.get('/dev/stdout');
        case 2:
            return this.get('/dev/stderr');
        }
    }

    function Fs(sys) {
        let root = new Directory('/', null, 0);
        this.root = root;
        this.mkdir = mkdir;
        this.touch = touch;
        this.rm = rm;
        this.get = get.bind(this, sys);
        this.getFile = getFile.bind(this);
        this.parsePath = parsePath;

        addDirs(root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'sbin', 'tmp', 'usr', 'var']);
        addDirs(this.get('/usr'), ['bin', 'sbin', 'local']);
        addDirs(this.get('/usr/local'), ['bin']);
        addFiles(this.get('/dev'), ['stdin', 'stdout', 'stderr']);
    }

    j$.__Fs = Fs;

}(window.j$ = window.j$ || {}));
