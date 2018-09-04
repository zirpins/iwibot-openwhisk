var request = require('request');
var url = 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/mhb/modules/dependencies/';

function main(params) {

    return new Promise(function (resolve, reject) {
        var tmpUrl = url + params.context.courseOfStudies + '/0'; // eg. INFB/0 -> All lectures for the studies INFB

        console.log('url: ' + tmpUrl);
        console.log(JSON.stringify(params));
        var options = {
            url: tmpUrl,
            headers: {
                'Host': 'www.iwi.hs-karlsruhe.de',
                'Accept': '*/*'
            }
        };

        request(options, function (error, response, body) {
                console.log('In Callback from get request!');
                console.log('outer: http status code:', (response || {}).statusCode);
                console.log('outer: error:', error);
                console.log('outer: body:', body);

                if (!error && response.statusCode === 200) {
                    console.log('Status-Code 200');

                    var body = JSON.parse(body);
                    var lectures_for_one_semester = body.modules.filter(function (el) {
                        return el.semester == params.context.semester;
                    });

                    // get voice response
                    var count = 0;
                    var payload = lectures_for_one_semester.map(function(el) {
                        count++;
                        if (count == lectures_for_one_semester.length) {
                            return 'und ' + el.name;
                        }
                        return el.name;
                    }).join(', ');
                    delete count;

                    // get html response
                    var htmlText = '<ul>';
                    lectures_for_one_semester.map(function (el) {
                        htmlText += '<li>' + el.name + '</li>';
                    });
                    htmlText += '</ul>';

                    resolve({payload: 'Im ' + params.context.semester + '. Semester hast du ' + payload + '.', htmlText: htmlText});
                } else {
                    console.log('http status code:', (response || {}).statusCode);
                    console.log('error:', error);
                    console.log('body:', body);

                    reject({payload: 'Nicht Erflogreich geholt.', htmlText: 'Nicht Erflogreich geholt.'});
                }
            }
        );
        console.log('request sent!');
        delete url;
        delete tmpUrl;
    });
}
exports.main = main;