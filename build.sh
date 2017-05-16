
echo "Building Javascriptix..."


echo "- Running the unit tests..."

cd test
node unit_tests.js
if [ $? -eq 0 ]
then
   echo The unit tests have run successfully.
else
   echo There are tests failing. Build process will exit in error.
   echo Please fix the failing tests and try again.
   exit 1
fi

echo "- Building javascriptix.js..."
cd ..
node node_modules/.bin/r.js -o conf/build.js optimize=none
if [ $? -eq 0 ]
then
   echo javascriptix.js has been built successfully.
else
   echo There was a problem with the build. Build process will exit in error.
   exit 1
fi

