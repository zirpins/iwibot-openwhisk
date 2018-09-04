#!/bin/bash

# package the project
mvn package

mv target/action-0.0.1-SNAPSHOT.jar action.jar

# install jar in openwhisk
bx wsk action update test --main de.hska.iwibot.actions.Template --kind java action.jar --web true

mvn clean
rm action.jar
