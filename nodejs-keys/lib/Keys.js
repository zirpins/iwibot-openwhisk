const crypto = require('crypto'),
    openwhisk = require('openwhisk');

const SESSIONS_ACTION = "/IWIbot_dev/IWIBot/Sessions";

function main(params) {
    if ("__ow_body" in params) { // Für das Testen erforderlich..
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    // So bekommst du in den logs mit, welche parameter diese Aktion zur Verfügung hat.
    console.log("------Keys Action started!------");
    console.log("Keys Action Params:" + JSON.stringify(params));

    return new Promise(function (resolve, reject) {

        // Call sessions service to negotiate session id and crypto key
        openwhisk().actions.invoke({
                name: SESSIONS_ACTION,
                blocking: true,
                result: true,
                params: params
            })

            .then(function (response) {
                let session_string, key_string;

                if ('payload' in response && "sid" in response.payload) {

                    session_string = response.payload.sid;

                    if ('session_context' in response.payload &&
                        "crypto_key" in response.payload.session_context) {

                        // Use existing crypto key
                        key_string = response.payload.session_context.crypto_key;

                    } else { // No crypto key in session yet

                        // Create and store new 256 bit aes key if required
                        raw_key = crypto.randomBytes(32);
                        key_string = raw_key.toString('hex');
                        console.log("crypto key created: " + key_string);

                        // Ensure session identifier param
                        if (typeof params.sid === 'undefined') {
                            params.sid = session_string;
                        }

                        // Ensure session context param
                        if (typeof params.session_context === 'undefined') {
                            params.session_context = {};
                        }

                        // Put crypto key in session context
                        params.session_context.crypto_key = key_string;

                        console.log("Persisting session id " +
                            params.sid + " with context " +
                            JSON.stringify(params.session_context) +
                            " using " + SESSIONS_ACTION);

                        // Update session
                        openwhisk().actions.invoke({
                            name: SESSIONS_ACTION,
                            blocking: false,
                            result: false,
                            params: params
                        });
                    }

                    resolve({
                        "payload": {
                            "sid": session_string,
                            "crypto_key": key_string
                        }
                    }); // End if payload.seesion_context.crypto_key

                } else {
                    console.error("Sessions error");

                    reject({
                        "reason": "Sessions error"
                    });

                } // End if payload.sid

            }).catch(function (err) {
                console.error(err);

                reject({
                    "reason": err
                });

            }); // End action chain

    }); // End new Promise

}

exports.main = main;