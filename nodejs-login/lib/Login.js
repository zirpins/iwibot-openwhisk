var request = require('request');
var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/validate";

function main(params) {

    return new Promise(function (resolve, reject) {

        var options = {
            url: url,
            headers: {
                'Authorization': 'Basic ' + new Buffer.from(params.context.username + ':' + params.context.password).toString('base64'),
                'Referer': 'https://iwibot.mybluemix.net/',
                'Host': 'www.iwi.hs-karlsruhe.de',
                'Origin': 'https://iwibot.mybluemix.net',
                'Accept': '*/*'
            }
        };
        console.log("username: " + params.context.username);
        console.log("password: " + params.context.password);
        console.log(JSON.stringify(options, null, 2));

        request(options, function (error, response, body) {
                console.log("In Callback from get request!");
                console.log('outer: http status code:', (response || {}).statusCode);
                console.log('outer: error:', error);
                console.log('outer: body:', body);

                if (!error && response.statusCode === 200) {
                    console.log('Status-Code 200');
                    resolve({payload: "Sie wurden erfolgreich angemeldet.", htmlText: "Sie wurden erfolgreich angemeldet."});
                } else {
                    console.log('http status code:', (response || {}).statusCode);
                    console.log('error:', error);
                    console.log('body:', body);

                    reject({payload: "Es ist ein Fehler beim anmelden passiert.", htmlText: "Es ist ein fehler beim anmelden passiert."});
                }
            }
         );
        console.log("request sent!");
    });
}
exports.main = main;