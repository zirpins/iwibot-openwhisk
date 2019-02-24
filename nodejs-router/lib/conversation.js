const AssistantV1 = require('watson-developer-cloud/assistant/v1');

const extend = require('extend');
const vcap = require('vcap_services');

exports.sendMessage = function (init, params) {

    console.log("------Conversation Started!------");
    console.log('Conversation Params: ' + JSON.stringify(params, null, 2));

    return new Promise((resolve, reject) => {

        // move conversation parameters in place
        params = extend({},
            params, init ? {
                workspace_id: params.workspace_id
            } : {
                input: {
                    text: params.payload.toString()
                },
                context: params.context,
                workspace_id: params.workspace_id
            }
        );

        // add conversation api version
        params = extend({}, params, {
            'version': "2018-07-10"
        });

        // try to retrieve conversation api credentials from binding
        if (params.__bx_creds && params.__bx_creds.conversation && params.__bx_creds.conversation.username && params.__bx_creds.conversation.password) {
            params = extend({}, params, {
                'username': params.__bx_creds.conversation.username,
                'password': params.__bx_creds.conversation.password
            });
        } else if (params.__bx_creds && params.__bx_creds.conversation && params.__bx_creds.conversation.apikey) {
            params = extend({}, params, {
                'username': "apikey",
                'password': params.__bx_creds.conversation.apikey
            });
        }

        // finally try to retrieve credentials from cloud context
        let _params = vcap.getCredentialsFromServiceBind(params, 'conversation');
        _params.headers = extend({},
            _params.headers, {
                'User-Agent': 'openwhisk'
            }
        );

        try {
            
            const conversation = new AssistantV1(_params);

            conversation.message(_params, (err, response) => {
                if (err) {
                    console.error("Conversation failed: " + err);
                    reject(err.message);
                } else {
                    console.log("Conversation succeeded: " + JSON.stringify(response));
                    resolve(response);
                }

            });

        } catch (err) { // call failed
            console.error("Connection failed: " + err);
            reject(err.message);
            return;
        }

    });
};