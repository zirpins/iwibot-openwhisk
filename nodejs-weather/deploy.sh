#!/usr/bin/env bash
echo "----------------------------------------------"
echo "|      Deploying NodeJS Action: Weather      |"
echo "----------------------------------------------"
source ./../config.sh
#install production dependencies
npm install --production
#compress all required folders
zip -rq action.zip lib node_modules package.json
#upload zip action to the ibm cloud
ibmcloud functions action update IWIBot/Weather --kind nodejs:8 action.zip
#bind weather insights service
ibmcloud functions service bind weatherinsights --instance ${weather_insights_service_name} IWIBot/Weather
#remove zip file
rm action.zip