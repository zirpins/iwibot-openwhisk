@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Navigation
ECHO ----------------------------------------------

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update IWIBot/Navigation --kind nodejs:8 action.zip
call DEL action.zip