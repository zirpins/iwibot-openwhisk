#!/bin/bash

# package the project
mvn package

mv target/action-0.0.1-SNAPSHOT.jar action.jar

# install jar in openwhisk
bx wsk action update testTest --main de.hska.iwibot.actions.Template --kind java action.jar --web true
bx wsk api create -n "iwibot Test API" $API_TEST_PATH /test get testTest --response-type json

# clean up
mvn clean
rm action.jar