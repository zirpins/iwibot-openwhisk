const request = require('request');
let url = 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/timetable/INFB/0/5?format=json';
const today = new Date();
const currentDay = parseInt(today.getDay());
const weekdays = new Array(7);
weekdays[0] = "montag";
weekdays[1] = "dienstag";
weekdays[2] = "mittwoch";
weekdays[3] = "donnerstag";
weekdays[4] = "freitag";
weekdays[5] = "samstag";
weekdays[6] = "sonntag";
const currentDayString = weekdays[(currentDay-1)%7];

function main(params) {
    console.log("------Timetable Action started!------");
    console.log("TimetableAction Params:" + JSON.stringify(params, null, 4));
    console.log("Timetable Semester: " + params.semester);
    console.log("Day: " + currentDay);
    console.log("DayString: " + currentDayString);
    let semester = -1;
    let courseOfStudies = 'INFB';
    let entities = [{value: 'Montag'}]
    if("__ow_body" in params) { // For testing this action!!
        semester = JSON.parse(params.__ow_body).semester;
        courseOfStudies = JSON.parse(params.__ow_body).courseOfStudies;
        entities = JSON.parse(params.__ow_body).entities
    } else {
        semester = params.semester;
        courseOfStudies = params.courseOfStudies;
        entities = params.entities;
    }
    console.log('~~~> semester ' + semester + ' courseOfStudies ' + courseOfStudies)
    return new Promise(function (resolve, reject) {
        const resultObject = {};

        if (semester && courseOfStudies) {
            url = 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/timetable/' + courseOfStudies + '/0/' + semester + '?format=json';
        } else {
            console.log("Es wurde kein Semester angegeben");
            resolve({ payload: "Es wurde kein Semester angegeben!"});
        }

        request({
            url: url
        }, function (error, response, body) {
            let ulStart = '<ul>';

            function getWeekdayIndex() {
                return weekdays.indexOf(entities[0].value.toLowerCase());
            }

            if (!error && response.statusCode === 200) {
                let responseObject = JSON.parse(body);

                console.log('Response Object: ' + JSON.stringify(responseObject, null, 4));
                const entries = responseObject.timetables[getWeekdayIndex()].entries;

                if (!entries || entries.length === 0) {
                    resolve({"payload": "Heute findet keine Vorlesung statt."});
                }
                for (let i = 0; entries.length > i; i++) {
                    let startTime = entries[i].startTime;
                    let endTime = entries[i].endTime;
                    let locationsLength = entries[i].locations.length;
                    let locationsUl = '<ul>';

                    for (let j = 0; locationsLength > j; j++) {
                        let aliasName = '';
                        if (entries[i].locations[j].aliasName) {
                            aliasName = entries[i].locations[j].aliasName;
                        }
                        locationsUl += '<li>' + aliasName + ' ' + entries[i].locations[j].building + entries[i].locations[j].room + '</li>';
                    }
                    locationsUl += '</ul>';

                    ulStart += '<li>' + combineStartAndEndTime(startTime, endTime) + ': <strong>' + entries[i].lectureName + '</strong>' + locationsUl + '</li>';
                }
                ulStart += '</ul>';
                resultObject.htmlText = ulStart;
                //  Erstes Zeichen groß machen
                resultObject.payload = 'Hier ist der Stundenplan für ' + weekdays[getWeekdayIndex()].substr(0,1).toUpperCase() + weekdays[getWeekdayIndex()].substr(1) + ':';

                resolve(resultObject);

            } else {
                console.log('http status code:', (response || {}).statusCode);
                console.log('error:', error);
                console.log('body:', body);
                reject(error);
            }
        });
    });
}

function convertToHoursMins(value) {
    let h = Math.floor(value / 60);
    let m = value % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
}

function combineStartAndEndTime(startTime, endTime) {
    startTime = convertToHoursMins(startTime);
    endTime = convertToHoursMins(endTime);
    return startTime + " - " + endTime;
}

function convertDayToHskaDay(day) {
    day = currentDay - 1;
    if (day === -1) {
        day = 6;
    }
    return day;
}

exports.main = main;