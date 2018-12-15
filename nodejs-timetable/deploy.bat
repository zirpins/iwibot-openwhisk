@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Timetable
ECHO ----------------------------------------------

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update Timetable --kind nodejs:8 action.zip
call DEL action.zip