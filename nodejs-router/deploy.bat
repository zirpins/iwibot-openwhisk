@ECHO OFF
ECHO ----------------------------------------------
ECHO    Deploying NodeJS Action: Router
ECHO ----------------------------------------------

call ..\config.cmd

call npm install --production
call jar -cfM action.zip lib node_modules package.json
call ibmcloud functions action update Router --kind nodejs:8 action.zip -p workspace_id %WORKSPACE_ID% --web true
call ibmcloud functions service bind conversation --instance %CONVERSATION_SERVICE_NAME% Router
call ibmcloud functions api create /iwibotDev /router POST Router --response-type http
call DEL action.zip