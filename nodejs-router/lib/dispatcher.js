let openwhisk = require('openwhisk');

function dispatch(response) {
    console.log("------Dispatcher started!------");
    console.log('skip: ' + JSON.stringify(response, null, 4));
    let context = response.context;
    let responseObject = {};
    if (response.output && "positionFlag" in response.output) {
		responseObject.positionFlag = response.output.positionFlag;
	}

	if (response.output && "actionToInvoke" in response.output) {
        console.log("Action to be invoked: " + response.output.actionToInvoke);
        console.log("Context : " + JSON.stringify(context, null, 4));
        let params = response;
        //const name = response.intents[0].intent;
        let name = response.output.actionToInvoke;
        let blocking = true, result = true;
        return action(name, blocking, result, params).then(function (response) {
            console.log("openwhisk response: " + JSON.stringify(response, null, 4));
            return new Promise(function (resolve) {
                responseObject = response;
                responseObject.context = context;
                resolve(responseObject);
            });
        });
    } else {
        responseObject.payload = response.output.text[0];
        responseObject.context = context;
        // this info should not lack to the Frontend
        delete responseObject.context.password;

        return new Promise(function (resolve) {
            console.log("Skiped action");
            console.log("ResponseObject " + JSON.stringify(responseObject, null, 4));
            resolve(responseObject);
        });
    }
}

function action(name, blocking, result, params) {
    let ow = openwhisk();
    return ow.actions.invoke({name, blocking, result, params}); // jshint ignore:line
}

exports.dispatch = dispatch;
