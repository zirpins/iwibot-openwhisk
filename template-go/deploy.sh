#!/bin/bash
# This script shows a way to pack any kind of executables.
# Only the binary "exec" is needed to build the action.zip
# Just build the binary and create the action with --native flag

cd src/de.hska.iwibot.actions.go

# get the dependencies
go get
# build the go action binary
go build -o exec
# zip the binary
zip -r action.zip exec

# install the native go action
bx wsk action update test --native action.zip

# clean up
rm action.zip
rm exec

cd ../..