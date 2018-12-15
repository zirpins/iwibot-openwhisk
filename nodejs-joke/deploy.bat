@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Joke
ECHO ----------------------------------------------

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update Joke --kind nodejs:8 action.zip
call DEL action.zip