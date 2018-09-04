#!/bin/bash
mvn package
mv target/action-0.0.1-SNAPSHOT.jar action.jar

# install zip in openwhisk
bx wsk action update testSchwimmbad --main de.hska.action.Schwimmbad --kind java action.jar --web true
bx wsk api create -n "iwibot Test API" $API_TEST_PATH /sprechstunde post testSprechstunde --response-type http

mvn clean