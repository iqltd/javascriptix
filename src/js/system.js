define(['auth', 'fs', 'context'], function (Auth, Fs, Context) {

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