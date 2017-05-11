define(['auth', 'fs', 'context', 'bin', 'bash'], function (Auth, Fs, Context, bin, Bash) {

    function initAuth() {
        return new Auth();
    }

    function initFilesystem() {
        let fs = new Fs();
        let addDirs = (parent, names) => names.forEach(el => fs.mkdir(el, parent, 0));
        let addFiles = (parent, names) => names.forEach(el => fs.touch(el, parent, 0));

        addDirs(fs.root, ['bin', 'dev', 'etc', 'home', 'lib', 'mnt', 'opt', 'proc', 'sbin', 'tmp', 'usr', 'var']);
        addDirs(fs.get('/usr'), ['bin', 'sbin', 'local']);
        addDirs(fs.get('/usr/local'), ['bin']);
        addFiles(fs.get('/dev'), ['stdin', 'stdout', 'stderr']);
        return fs; 
    }

    function initContext(auth, filesystem) {
        return new Context('test', auth, filesystem);
    }

    function initSystem() {
        let auth = initAuth();
        let fs = initFilesystem();
        let context = initContext(auth, fs);

        let test = fs.mkdir('test', fs.root, auth.root);
        let dir1 = fs.mkdir('dir1', test, auth.root);
        fs.touch('file1', dir1, auth.root);
        fs.touch('file2', dir1, auth.root);
        fs.mkdir('dir2', test, auth.root);
        context.directory = test;

        return {
            auth, fs, context
        };
    }

    function initBash(system = initSystem()) {
        return new Bash(system);
    }

    function initBin(system = initSystem()) {
        bin.init(system);
    }

    
    function mockFsGet(fs, path, file) {
        let oldGet = fs.get;
        fs.get = x => (x === path) ? file : oldGet(x);
    }

    return {
        initAuth, initFilesystem, initContext, initSystem, initBash, initBin, 
        mockFsGet
    };
});