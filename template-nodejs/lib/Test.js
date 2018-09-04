var request = require('request');

function main(params) {
    if("__ow_body" in params) { // Für das Testen erforderlich..
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    // So bekommst du in den logs mit, welche parameter diese Aktion zur Verfügung hat.
    console.log("------Template Action started!------");
    console.log("TemplateAction Params:" + JSON.stringify(params, null, 4));

    return new Promise(function (resolve, reject) {
        // Füge hier deine Aktionen hinzu und rufe bei positivem Feedback die resolve, und bei negativem die reject Funktion auf
        resolve({"payload": "Hallo NodeJs", "htmlText": "Hallo aus Node"});
    });
}

exports.main = main;