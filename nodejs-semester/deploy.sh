#!/usr/bin/env bash
echo "----------------------------------------------"
echo "|      Deploying NodeJS Action: Semester     |"
echo "----------------------------------------------"

#install production dependencies
npm install --production
#compress all required folders
zip -r action.zip lib node_modules package.json
#upload zip action to the ibm cloud
ibmcloud functions action update Semester --kind nodejs:8 action.zip
#remove zip file
rm action.zip