@ECHO OFF

call print-test-banner.bat

:: NodeJs: Bescheinigung
call cd nodejs-bescheinigung\ && call deploy.bat && call cd ..

:: NodeJs: Joke
call cd nodejs-joke\ && call deploy.bat && call cd ..

:: NodeJs: Meal
call cd nodejs-meal\ && call deploy.bat && call cd ..

:: NodeJs: Navigation
::call cd nodejs-navigation\ && call deploy.bat && call cd ..

:: NodeJs: Router
call cd nodejs-router\ && call deploy.bat && call cd ..

:: NodeJs: Semester
call cd nodejs-semester\ && call deploy.bat && call cd ..

:: NodeJs: Sprechstunde
call cd nodejs-sprechstunde\ && call deploy.bat && call  cd ..

:: NodeJs: Timetable
call cd nodejs-timetable\ && call deploy.bat && call cd ..

:: NodeJs: Weather
call cd nodejs-weather\ && call deploy.bat && call cd ..

:: NodeJs: Wikipedia
call cd nodejs-wikipedia\ && call deploy.bat && call cd ..

:: NodeJs: Modulhandbuch
call cd nodejs-modulhandbuch\ && call deploy.bat && call cd ..


ECHO -------------------------DONE!-------------------------