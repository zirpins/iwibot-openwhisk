var request = require('request');
var bot = require('nodemw');

// read config from external file
var client = new bot({
    "protocol": "https",  // default to 'http'
    "server": "de.wikipedia.org",  // host name of MediaWiki-powered site
    "path": "/w",                  // path to api.php script
    "debug": true,                // is more verbose when set to true
    "userAgent": "Custom UA",      // define custom bot's user agent
    "concurrency": 5               // how many API requests can be run in parallel (defaults to 3)
});

function main(params) {
    return new Promise(function (resolve, reject) {
        var url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search='+ params.input.text.toLowerCase().replace(" ", "%20") +'&limit=10&namespace=0&format=json';
        /*client.getArticle(params.input.text, function(err, data) {
            // error handling
            if (err) {
                console.error(err);
                return;
            }
            console.log(JSON.stringify(data, null, 2));

            var responseObject = {};
            responseObject.payload = "Das habe ich zu " + params.input.text + " gefunden.";

            client.parse(data, params.input.text, function (result) {
                console.log("paresd Result: " + result);
                console.log("arguments: " + JSON.stringify(arguments));
                responseObject.htmlText = JSON.stringify(result);
                resolve(responseObject);
            });
        });*/
        request(url, function(err, response, data) {
            if(!err) {
                console.log("Params: " + JSON.stringify(params, null, 2));
                console.log("in callback");

                console.log("data: " + JSON.stringify(data, null, 2));
                console.log("repsonse: " + JSON.stringify(response, null, 2));

                data = JSON.parse(data);
                console.log("in callback: data" + data);
                console.log("in callback: data stringify" + JSON.stringify(data));

                var searchQuery = data[0];
                var title = data[1][0];
                var shortText = data[2][0];
                console.log("data2: " + data[2]);
                var wikiUrl = data[3][0];

                var responseObject = {};

                if (title != undefined) {
                    responseObject.payload = "Das habe ich zu " + searchQuery + " gefunden.";
                    responseObject.htmlText = shortText + "\n(" + wikiUrl + ")";
                } else {
                    responseObject.payload = "Zu ihrem Suchwort habe ich nichts gefunden.";
                }

                resolve(responseObject);
            }
        }).setMaxListeners(12);
    });
}
function convertCertificateTypeToDisplayName(type) {
    switch(type) {
        case 'DATA_CONTROL_SHEET':
            return 'Datenkontrollblatt';
        case 'CERTIFICATE_OF_MATRICULATION':
            return 'Immatrikulationsbescheinigung (deutsch)';
        case 'CERTIFICATE_OF_MATRICULATION_ENGLISH' :
            return 'Immatrikulationsbescheinigung (englisch)';
        case 'BAFOEG':
            return 'BAFÖG-Bescheinigung';
        case 'KVV':
            return 'KVV-Bescheinigung';
        case 'DURATION_OF_STUDY':
            return 'Studienzeitbescheinigung';
        case 'IZ_ACCESS':
            return 'Initiale IZ-Zugangsdaten';
    }

}
exports.main = main;