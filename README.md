# javascriptix

Play project emulating some basic bash commands in the browser (and, thus, giving me an excuse to play with vanilla Javascript).

The code uses ES2015 features, so it requires one of the most recent versions of browsers (Chrome, Edge, Firefox, Safari).

It only supports basic bash builtins (echo, cd) and basic binaries (pwd, ls, mkdir, touch, rm, whoami, clear, cat).

## Where to play with it?

The current release of the application is available [here](https://iqltd.github.io/javascriptix)

If you don't know what to do first, try:

`cat readme`

## Unit tests

The unit tests can be run either:
- in the browser, accessing `test/unit_tests.html` page
- in Nodejs\*, running `cd test;node unit_tests.js` 

\*Please note that in order to run the unit tests in Node, you will need to install requirejs (`npm install requirejs`)

The unit tests for the current release can be run (in the browser) [here](https://iqltd.github.io/javascriptix/test/unit_tests.html)

## Create release

The app can be built into a single js file and a minified version via the shell script `./create_release.sh`
The script will:
- perform the unit tests, and only after passing all:
- concatenate all the source files into dist/javascriptix.js
- minify that file into dist/javascriptix.min.js

The script requires that both requirejs and uglify-js-es6 are installed on the repository:

`npm install requirejs`

`npm install uglify-js-es6`
