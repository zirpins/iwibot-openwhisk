@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Modulhandbuch
ECHO ----------------------------------------------

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update IWIBot/Modulhandbuch --kind nodejs:8 action.zip
call DEL action.zip