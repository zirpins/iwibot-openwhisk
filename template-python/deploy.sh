#!/bin/bash

# activate virtualenv
#source virtualenv/bin/activate
#echo "virtual env activated!"
# install requirements in virtualenv
#pip3 install -r requirements.txt --cache-dir .cache
# deactivate virtualenv
#deactivate
#echo "virtual env deactivated!"

# zip all
cd lib
zip -r action.zip *

# install zip in openwhisk
bx wsk action update test --kind python:3 action.zip --web true

# clean up
rm action.zip

cd ..