#!/bin/bash

# we need to cd into the lib directory! Otherwise the index.php file is not at the root of the zip archive
cd lib

# zip all in lib directory.
zip -r action.zip * ../vendor/

# install zip in openwhisk
bx wsk action update test --kind php:7.1 action.zip

# clean up
rm action.zip

cd ..