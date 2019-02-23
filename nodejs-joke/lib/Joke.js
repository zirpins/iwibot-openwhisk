const request = require('request'),
    icndb_url = "http://api.icndb.com/jokes/random";

function main() {
    return new Promise(function (resolve, reject) {
        request({
            url: icndb_url
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                resolve({
                    payload: body.value.joke,
                    language: "en-US"
                });
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