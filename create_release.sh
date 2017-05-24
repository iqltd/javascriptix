NODE_PATH='node_modules/.bin'
REQUIREJS='r.js'
UGLIFYJS='uglifyjs'
DISTRIBUTION='dist'


echo "Building Javascriptix..."

echo "Checking if nodejs is installed..."
node -v >/dev/null 2>&1
if [ $? -eq 0 ]
then
   echo Nodejs is installed.
else
   echo Nodejs is not installed, but it is needed for the build
   echo Please install Nodejs and try again.
   exit 1
fi

echo "Checking if required nodejs modules are installed..."

if [[ -f "$NODE_PATH/$REQUIREJS" && -f "$NODE_PATH/$UGLIFYJS" ]]
then
   echo All the needed modules are installed.
else
   echo One of the required libraries is missing.
   echo Please perform 'npm install requirejs' and 'npm install uglify-js-es6' and try again.
   exit 1
fi

echo "- Running the unit tests..."
cd test
node unit_tests.js
if [ $? -eq 0 ]
then
   echo The unit tests have run successfully.
else
   echo There are tests failing.
   echo Please fix the failing tests and try again.
   exit 1
fi
cd ..

echo "- Building javascriptix.js..."
node "$NODE_PATH/$REQUIREJS" -o conf/build.js out="$DISTRIBUTION/javascriptix.js" optimize=none
if [ $? -eq 0 ]
then
   echo javascriptix.js has been built successfully.
else
   echo There was a problem with the build. Process will exit in error.
   exit 1
fi

echo "- Minifying javascriptix.js..."
node "$NODE_PATH/$UGLIFYJS" "$DISTRIBUTION/javascriptix.js" -o "$DISTRIBUTION/javascriptix.min.js"
if [ $? -eq 0 ]
then
   echo javascriptix.js has been minified successfully.
else
   echo There was a problem with the minification. Process will exit in error.
   exit 1
fi
