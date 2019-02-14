const request = require('request'),
    crypto = require('crypto');

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

        // 192 bit mock key instead of: encryption_key = crypto.randomBytes(24);
        encryption_key = new Buffer("e94b9a6b80ee2633c47bd00ab16d84d54e453c9d7118978c", "hex");

        // random IV needs to be passed along each call
        // 16 bit mock iv instead of: encryption_iv = crypto.randomBytes(16);        
        encryption_iv = new Buffer("8cbcfa139e61225f2a2050e2adda32fb", "hex");

        console.log("crypto_key created: " + encryption_key.toString('hex'));
        console.log("crypto_iv created: " + encryption_iv.toString('hex'));

        resolve({
            "payload": {
                "sid": session_id,
                "crypto_key": encryption_key.toString('hex'),
                "crypto_iv": encryption_iv.toString('hex')
            }
        });
    });
}

exports.main = main;