[![Stories in Ready](https://badge.waffle.io/micul01/javascriptix.png?label=ready&title=Ready)](http://waffle.io/micul01/javascriptix)

# javascriptix

A naive bash and gnu tools implementation in Javascript.

## Current release (v0.0)
The code uses ES2015 features, so it requires one of the most recent versions of browsers (Chrome, Edge, Firefox, Safari).
The current release version supports basic bash builtins (echo, cd) and basic binaries (pwd, ls, mkdir, touch, rm, whoami, clear, cat).

Other features (bash expansion, pipes, redirections etc.) as well as command options are not supported in this version. 

## Where to play with it?
The current release of the application is available [here](https://micul01.github.io/javascriptix)

If you don't know what to do first, try:

`cat readme`

## Unit tests
The unit tests can be run either:
- in the browser: accessing test/unit_tests.html page
- in Nodejs\*: running cd test;node unit_tests.js 
\*Please note that in order to run the unit tests in Node, you will need to install requirejs (npm install requirejs)

## Create release
The app can be built into a single js file and a minified version via the shell script ./create_release.sh
The script will:
- perform the unit tests, and only after passing all:
- concatenate all the source files into dist/javascriptix.js
- minify that file into dist/javascriptix.min.js

## Current development
Selective requirements extracted from the bash specification [here](https://www.gnu.org/software/bash/manual/bash.html), as well as underlying "operating system" functionalities to support them.
The progress can be seen [here](https://waffle.io/micul01/javascriptix)
