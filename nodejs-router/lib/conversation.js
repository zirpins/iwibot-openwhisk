const AssistantV1 = require('watson-developer-cloud/assistant/v1');

exports.sendMessage = function sendMessage(init, params) {
    console.log("------Conversation Started!------");
    console.log('Conversation Params: ' + JSON.stringify(params, null, 2));

    const conversation = new AssistantV1({
        username: params.__bx_creds.conversation.username,
        password: params.__bx_creds.conversation.password,
        url: params.__bx_creds.conversation.url,
        version: "2018-14-10"
    });

    return new Promise(function (resolve, reject) {
        const options = init ? { workspace_id: params['workspace_id'] } :
            {
                input: {
                    text: params.payload.toString()
                },
                context: params.context,
                workspace_id: params['workspace_id']
            };
        conversation.message(options, function (err, response) {
            if (err) {
                console.error("Conversation Error: " + err);
                reject(err);
            }

            console.log("Conversation Response: " + JSON.stringify(response, null, 4));
            resolve(response);
        });
    });
};