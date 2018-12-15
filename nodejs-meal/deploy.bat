@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Meal
ECHO ----------------------------------------------

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update Meal --kind nodejs:8 action.zip
call DEL action.zip