#!/usr/bin/env bash

# we need to cd into the lib directory! Otherwise the index.php file is not at the root of the zip archive
cd lib

# zip all in lib directory.
zip -r action.zip * ../vendor/

# install zip in openwhisk
bx wsk action update testTest --kind php:7.1 action.zip --web true
bx wsk api create -n "iwibot Test API" $API_TEST_PATH /test get testTest --response-type json

# clean up
rm action.zip

cd ..