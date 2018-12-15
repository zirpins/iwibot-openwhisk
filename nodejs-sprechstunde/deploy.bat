@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Sprechstunde
ECHO ----------------------------------------------

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update Sprechstunde --kind nodejs:8 action.zip
call DEL action.zip