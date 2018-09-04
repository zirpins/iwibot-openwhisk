#!/bin/bash

# activate virtualenv
source virtualenv/bin/activate
# install requirements in virtualenv
pip3 install -r requirements-test.txt --cache-dir .cache
# deactivate virtualenv
deactivate
echo "virtual env deactivated!"
# zip all
zip -r action.zip lib/* virtualenv

# install zip in openwhisk
bx wsk action update testTest --kind python:3 action.zip --web true
bx wsk api create -n "iwibot Test API" $API_TEST_PATH /test post testTest --response-type json

# clean up
rm action.zip