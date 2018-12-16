#!/usr/bin/env bash

./print-test-banner.sh

#NodeJs: Bescheinigung
cd nodejs-bescheinigung/ && ./deploy.sh && cd -

#NodeJs: Joke
cd nodejs-joke/ && ./deploy.sh && cd -

#NodeJs: Meal
cd nodejs-meal/ && ./deploy.sh && cd -

#NodeJs: Navigation
#cd nodejs-navigation/ && ./deploy.sh && cd -

#NodeJs: Router
cd nodejs-router/ && ./deploy.sh && cd -

#NodeJs: Semester
cd nodejs-semester/ && ./deploy.sh && cd -

#NodeJs: Sprechstunde
cd nodejs-sprechstunde/ && ./deploy.sh && cd -

#NodeJs: Timetable
cd nodejs-timetable/ && ./deploy.sh && cd -

#NodeJs: Weather
cd nodejs-weather/ && ./deploy.sh && cd -

#NodeJs: Wikipedia
cd nodejs-wikipedia/ && ./deploy.sh && cd -

#NodeJs: Modulhandbuch
cd nodejs-modulhandbuch/ && ./deploy.sh && cd -

echo "-------------------------DONE!-------------------------"