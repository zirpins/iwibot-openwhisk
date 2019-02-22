const request = require('request'),
    crypto = require('crypto'),
    openwhisk = require('openwhisk');

function main(params) {
    if ("__ow_body" in params) { // Für das Testen erforderlich..
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    // So bekommst du in den logs mit, welche parameter diese Aktion zur Verfügung hat.
    console.log("------Keys Action started!------");
    console.log("Keys Action Params:" + JSON.stringify(params));

    return new Promise(function (resolve, reject) {
        action( // call session service to negotiate the session id and crypto key
                name = "/IWIbot_dev/IWIbot_dev/Sessions",
                blocking = true,
                result = true,
                params = params)

            .then(function (sessions_response) {
                let session_string, key_string;

                if ('payload' in sessions_response && "sid" in sessions_response.payload) {

                    session_string = sessions_response.payload.sid;

                    if ('session_context' in sessions_response.payload &&
                        "crypto_key" in sessions_response.payload.session_context) {

                        key_string = sessions_response.payload.session_context.crypto_key;

                    } else {

                        // create and store new 256 bit aes key if required
                        raw_key = crypto.randomBytes(32);
                        key_string = raw_key.toString('hex');
                        console.log("crypto key created: " + key_string);

                        // Put crypto key in session context
                        params.session_context = {
                            'crypto_key': key_string
                        };

                        // Update session
                        action(
                            name = "/IWIbot_dev/IWIbot_dev/Sessions",
                            blocking = false,
                            result = false,
                            params = params);
                    }

                    resolve({
                        "payload": {
                            "sid": session_string,
                            "crypto_key": key_string
                        }
                    }); // End if payload.seesion_context.crypto_key

                } else {

                    reject({
                        "reason": "Sessions unavailable"
                    });

                } // End if payload.sid

            }); // End action chain

    }); // End new Promise
}

function action(name, blocking, result, params) {
    let ow = openwhisk();
    return ow.actions.invoke({
        name,
        blocking,
        result,
        params
    }); // jshint ignore:line
}

exports.main = main;