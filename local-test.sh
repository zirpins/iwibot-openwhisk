#!/bin/bash
set -e
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "                               _____ _    _ _____     ______       _                                "
echo "                              |_   _| |  | |_   _|    | ___ \     | |                               "
echo "                                | | | |  | | | |______| |_/ / ___ | |_                              "
echo "                                | | | |/\| | | |______| ___ \/ _ \| __|                             "
echo "                               _| |_\  /\  /_| |_     | |_/ / (_) | |_                              "
echo "                               \___/ \/  \/ \___/     \____/ \___/ \__|                             "
echo "                                                                                                    "
echo -e "${NC}"

# Load configuration
source local-test.env

# Remove Deployments that are left over by interrupted Test-Run
./deployTestFunctions.sh --install

echo -e "${BLUE}"
echo "===================================================================================================="
echo "                                         Running tests                                              "
echo "===================================================================================================="
echo -e "${NC}"

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 1/8) Running Joke Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd openwhisk/joke
rm -rf node_modules
npm install > /dev/null
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 2/8) Running Meal Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../meal
rm -rf node_modules
npm install > /dev/null
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 3/8) Running Navigation Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../navigation
rm -rf node_modules
npm install > /dev/null
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 4/8) Running Router Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../router
rm -rf node_modules
npm install > /dev/null
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 5/8) Running Timetable Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../timetable
rm -rf node_modules
npm install > /dev/null
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 6/8) Running Weather Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../weather
rm -rf node_modules
npm install > /dev/null
npm test
: '
echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 7/8) Running Login Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../login
rm -rf node_modules
npm install > /dev/null
npm test
'
echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 8/8) Running Semester Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../semester
rm -rf node_modules
npm install > /dev/null
npm test

cd ../..

echo -e "${GREEN}"
echo -e "______________________       __    ___    ___    __        ___       ___       _____________________"
echo -e "                      )  ____) |  |   |  |  /  __) \    ___)  )  ____)  )  ____)                    "
echo -e "                     (  (___   |  |   |  | |  /     |  (__   (  (___   (  (___                      "
echo -e "                      \___  \  |  |   |  | | |      |   __)   \___  \   \___  \                     "
echo -e "                      ____)  ) |   \_/   | |  \__   |  (___   ____)  )  ____)  )                    "
echo -e "_____________________(      (___\       /___\    )_/       )_(      (__(      (_____________________"
echo -e "${NC}"