@ECHO OFF
:: installs all node_modules for all functions
call npm install

cd nodejs-bescheinigung
call npm install

::cd ..\nodejs-git\
::call npm install

cd ..\nodejs-joke\
call npm install

::cd ..\nodejs-login\
::call npm install

cd ..\nodejs-meal\
call npm install

cd ..\nodejs-modulhandbuch\
call npm install

::cd ..\nodejs-navigation\
::call npm install

cd ..\nodejs-router\
call npm install

cd ..\nodejs-semester\
call npm install

cd ..\nodejs-sprechstunde\
call npm install

cd ..\nodejs-timetable\
call npm install

cd ..\nodejs-weather\
call npm install

cd ..\nodejs-wikipedia\
call npm install

cd ..\template-nodejs\
call npm install

cd ..\
