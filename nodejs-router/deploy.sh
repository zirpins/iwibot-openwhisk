#!/usr/bin/env bash
echo "----------------------------------------------"
echo "|      Deploying NodeJS Action: Router       |"
echo "----------------------------------------------"
 source ../config.sh
npm install --production
#compress all required folders
zip -rq action.zip lib node_modules package.json
#upload zip action to the ibm cloud
ibmcloud functions action update Router --kind nodejs:8 action.zip -p workspace_id ${workspace_id} --web true
#set the workspace id as parameter
ibmcloud functions service bind conversation --instance ${conversation_service_name} IWIBot/Router
#create api
ibmcloud functions api create /iwibotDev /router POST IWIBot/Router --response-type http
#remove zip file
rm action.zip