var ConversationV1 = require('watson-developer-cloud/conversation/v1');

exports.sendMessage = function sendMessage(init, params) {
    console.log("------Conversation Started!------");
    console.log('Conversation Params: ' + JSON.stringify(params, null, 2));

    var conversation = new ConversationV1({
        username: params.__bx_creds.conversation.username,
        password: params.__bx_creds.conversation.password,
        url: params.__bx_creds.conversation.url,
        path: {workspace_id: "49d2a377-47a0-42aa-9649-cbce4637b624"},
        version_date: "2018-24-05"
    });

    return new Promise(function (resolve, reject) {
        var options = init ? { workspace_id: "49d2a377-47a0-42aa-9649-cbce4637b624" } :
            {
                input: {
                    text: params.payload.toString()
                },
                context: params.context,
                workspace_id: "49d2a377-47a0-42aa-9649-cbce4637b624"
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