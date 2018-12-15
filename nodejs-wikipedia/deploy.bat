@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Wikipedia
ECHO ----------------------------------------------

call ..\config.cmd

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update Wikipedia --kind nodejs:8 action.zip
call DEL action.zip