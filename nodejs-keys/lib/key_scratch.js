const request = require('request'),
    crypto = require('crypto'),
    cloudant = require('@cloudant/cloudant');

require('dotenv').load();

function randomKey(num_bytes = 4) {
    var x = crypto.randomBytes(num_bytes);
    return x.toString('hex');
}

function main(params) {
    if("__ow_body" in params) { // Für das Testen erforderlich..
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    // So bekommst du in den logs mit, welche parameter diese Aktion zur Verfügung hat.
    console.log("------Template Action started!------");
    console.log("TemplateAction Params:" + JSON.stringify(params, null, 4));

    // Initialize Cloudant with settings from .env
    var username = process.env.cloudant_username || "nodejs";
    var password = process.env.cloudant_password;
    var cloudant = Cloudant({ account: username, password: password });

    return new Promise(function (resolve, reject) {
        // Füge hier deine Aktionen hinzu und rufe bei positivem Feedback die resolve, und bei negativem die reject Funktion auf

        const HSE = Math.floor(new Date() / 1000 * 60 * 60); // hours since epoch
        const SESSION = HSE + random(1e6, 1e7);
 
        // Get or create session id
        var session_id = params.sid;
        if (session_id) {
            session_id = random(0, Math.pow(2, 4 * 8 - 1));
        }

        key = hse + session_id;

        hash.update(hse); // create hash from day index
        var key = hash.digest('hex'); // our secret key

        console.log("Key created: " + key);

        resolve({ "payload": { "key": key.toString() }, "htmlText": "Key returned in payload" });
    });
}

exports.main = main;