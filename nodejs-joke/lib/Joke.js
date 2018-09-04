var request = require('request');
var url = "http://api.icndb.com/jokes/random";
var language = "en-US";
var jokeResponse = {};

function main() {

    return new Promise(function (resolve, reject) {

        request({
            url: url
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {

                body = JSON.parse(body);
                jokeResponse.payload = body.value.joke;
                jokeResponse.language = language;
                resolve(jokeResponse);
            } else {
                console.log('http status code:', (response || {}).statusCode);
                console.log('error:', error);
                console.log('body:', body);

                reject(error);
            }
        });
    });
}
exports.main = main;