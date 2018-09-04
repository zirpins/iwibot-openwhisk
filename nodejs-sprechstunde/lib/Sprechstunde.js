const request = require('request');

function main(params) {
    const url = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/lecturers/professors?images=false&lectures=false\n";
    const language = "de-DE";
    const responseObject = {};

    return new Promise(function (resolve, reject) {

        request({
            url: url
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {

                const professors = JSON.parse(body);
                for (let professor of professors) {
                    if (professor.lastname === params.entities[0].value) {
                        responseObject.payload = getPayload(professor);
                        responseObject.language = language;
                        resolve(responseObject);
                        return;
                    }
                }

                responseObject.payload = 'Für die Sprechzeiten von Professor ' + params.entities[0].value +
                                         ' konnte ich leider keine Angaben finden.';
                responseObject.language = language;
                resolve(responseObject);
            }

            else {
                console.log('http status code:', (response || {}).statusCode);
                console.log('error:', error);
                console.log('body:', body);

                reject(error);
            }
        });
    });
}

function getPayload(professor) {
    let payload = "Professor " + professor.firstname + " " + professor.lastname +
        " hat am " + getDayStringFromNumber(professor.consultationDay) +
        " von " + convertToHoursMins(professor.consultationStartTime) +
        " bis " + convertToHoursMins(professor.consultationEndTime) +
        " Sprechzeit in Raum " + professor.building + " " + professor.room;
    if (professor.consultationTimeComment !== '') {
        return payload + " (" + professor.consultationTimeComment + ').';
    } else {
        return payload + '.';
    }

}

function getDayStringFromNumber(dayNumber) {
    switch (dayNumber) {
        case 0:
            return "Montag";
        case 1:
            return "Dienstag";
        case 2:
            return "Mittwoch";
        case 3:
            return "Donnerstag";
        case 4:
            return "Freitag";
        case 5:
            return "Samstag";
        case 7:
            return "Sonntag";
    }
}

function convertToHoursMins(value) {
    let h = Math.floor(value / 60);
    let m = value % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
}

exports.main = main;