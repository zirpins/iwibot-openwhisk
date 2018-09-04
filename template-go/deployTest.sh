#!/bin/bash

cd src/de.hska.iwibot.actions.go

# get the dependencies
go get
# build the go action binary
go build -o exec
# zip the binary
zip -r action.zip exec

# install zip in openwhisk
bx wsk action update testTest --native action.zip --web true
bx wsk api create -n "iwibot Test API" $API_TEST_PATH /test post testTest --response-type http

rm action.zip
rm exec

cd ../..