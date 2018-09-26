let dispatcher = require('./dispatcher');
// Use this for Bluemix Conversation-Service
let conversation = require('./conversation');
// Use this for own Python-Classifer Based Conversation
//let conversation = require('./classifier-based-conversation/conversation');


function main(params) {

    console.log("------Router started!------");
    console.log('Router Action Params: ' + JSON.stringify(params, null, 4));

    let semester;
    let courseOfStudies;
    let position;

    if ("onlyPositionDataFlag" in params) {
        let positionObj = {
            latitude: params.position[1],
            longitude: params.position[0]
        };

        return locationEvents.getEventsForPosition(positionObj).then(function (response) {
            console.log("Responding... " + JSON.stringify(response));
            return {
                headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain'},
                body: JSON.stringify(response),
                code: 200
            };       
        });
    }

    if("__ow_body" in params) { // For testing this action!!
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    if ("semester" in params && "courseOfStudies" in params) {
        semester = params.semester;
        courseOfStudies = params.courseOfStudies;
    }
    
    if ("position" in params) {
        position = params.position;
    }

    return conversation.sendMessage("conInit" in params, params).then(function (params) {
            params.semester = semester;
            params.courseOfStudies = courseOfStudies;
            params.position = typeof position !== 'undefined' ? {
                latitude: position[1],
                longitude: position[0]
            } : position;

            return dispatcher.dispatch(params);

        }, function (reason) {
            console.error("Conversation Error: " + reason);

            throw reason;

        }).then(function (response) {

            return {
                headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain'},
                body: JSON.stringify(response),
                code: 200
            };

        }, function (reason) {
            console.log("Dispatcher Error: " + reason);

            let response = {};
            response.payload = 'Error occurred';

            return {
                headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain'},
                body: JSON.stringify(response),
                code: 200
            };

        });
}
exports.main = main;
