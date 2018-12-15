@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Weather
ECHO ----------------------------------------------

call ..\config.cmd

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update Weather --kind nodejs:8 action.zip
call ibmcloud functions service bind weatherinsights --instance %WEATHER_INSIGHTS_SERVICE_NAME% Weather
call DEL action.zip