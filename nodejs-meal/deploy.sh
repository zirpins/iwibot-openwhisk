#!/bin/bash
# preserve dev deps if any
mkdir -p .mod
mv node_modules .mod
# install only prod deps only=production
npm install --production  > /dev/null
# zip all but skip the dev deps
zip -rq action.zip package.json lib node_modules
# delete prod deps
rm -rf node_modules
# recover dev deps
mv .mod node_modules
# install zip in openwhisk
bx wsk action update Meal --kind nodejs:6 action.zip --web true