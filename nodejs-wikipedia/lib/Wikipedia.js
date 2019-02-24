var request = require('request');

function main(params) {
    return new Promise(function (resolve, reject) {

        var url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search=' +
            params.input.text.toLowerCase().replace(" ", "%20") + '&limit=10&namespace=0&format=json';

        request(url, function (err, response, data) {
            if (!err) {
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

exports.main = main;