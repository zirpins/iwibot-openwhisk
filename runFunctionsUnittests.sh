#!/bin/bash

##############################################################################
# Copyright 2017 IBM Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
##############################################################################
# set -x trace
set -e # terminate after non-null return value

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
echo "===================================================================================================="
echo "                              Configuring CLI from apihost and API key                              "
echo "===================================================================================================="
echo -e "${NC}"


# fake local.env (Configurations defined in travis-ci console)
touch local.env
touch local-test.env

# Deploy WSK Test-Actions
./deployTestFunctions.sh --install

echo -e "${BLUE}"
echo "===================================================================================================="
echo "                                           Running tests                                            "
echo "===================================================================================================="
echo -e "${NC}"

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 1/8) Running Joke Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd openwhisk/joke
rm -Rf node_modules
npm install
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 2/8) Running Meal Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../meal
rm -Rf node_modules
npm install
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 3/8) Running Navigation Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../navigation
rm -Rf node_modules
npm install
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 4/8) Running Router Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../router
rm -Rf node_modules
npm install
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 5/8) Running Timetable Tests~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../timetable
rm -Rf node_modules
npm install
npm test

echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 6/8) Running Weather Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"
cd ../weather
rm -Rf node_modules
npm install
npm test
: '
echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 7/8) Running Login Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"

cd ../login
rm -Rf node_modules
npm install
npm test
'
echo -e "${BLUE}"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 8/8) Running Semester Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "${NC}"

cd ../semester
rm -Rf node_modules
npm install
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
