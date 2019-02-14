const request = require('request'),
    crypto = require('crypto'),
    openwhisk = require('openwhisk');

require('dotenv').load();

function main(params) {
    if ("__ow_body" in params) { // Für das Testen erforderlich..
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    // So bekommst du in den logs mit, welche parameter diese Aktion zur Verfügung hat.
    console.log("------Template Action started!------");
    console.log("TemplateAction Params:" + JSON.stringify(params));

    return new Promise(function (resolve, reject) {
        // Füge hier deine Aktionen hinzu und rufe bei positivem Feedback die resolve, und bei negativem die reject Funktion auf

        // Get session identifier if any
        var session_id = params.sid;

        // TODO
        // call session service to negotiate the session id and crypto key
        //
        
        // mock a 128 bit session identifier
        if (! session_id) {
            session_id = crypto.randomBytes(16).toString('hex');
            console.log("Session id created: " + session_id.toString('hex'));
        }

        // 256 bit mock key instead of: encryption_key = crypto.randomBytes(32);
        encryption_key = new Buffer("b26301cc95648636104ed5c40cd083ec0b507434a809b6186d882f9f3665baa5", "hex");
        console.log("crypto_key created: " + encryption_key.toString('hex'));

        resolve({
            "payload": {
                "sid": session_id,
                "crypto_key": encryption_key.toString('hex'),
            }
        });
    });
}

exports.main = main;