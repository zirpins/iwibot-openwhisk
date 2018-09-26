/**
 * ========================================== !CAUTION! ==========================================
 * Mock-Classifier-Rest-Service for testing changes in the conversation-logic without having
 * a deployed Classifier-Rest-Service. Do not use this thing for anything but testing-purposes!
 * This classifier only accepts the test-sentences used by router.iwibot_test.js
 * ========================================== !CAUTION! ==========================================
 */

let debug = require('./conversationDebugPrints');

exports.classify = function(request) {
    request = JSON.parse(request);
    let sentence = request.sentence;
    let context = request.context;
    request.params.context = context;
    let entity = "";
    let intent = "";
    let priorIntent = "";
    if(sentence && sentence.indexOf('timetable thursday') !== -1) {
        priorIntent = "Timetables";
        entity = "Donnerstag"
    } else if(sentence && sentence.indexOf('Food 1') !== -1) {
        priorIntent = "Meal";
        entity = "essen1";
    } else if(sentence && sentence.indexOf('joke') !== -1) {
        intent = "Joke";
        entity = "";
    }
    let response = buildMockResponse(intent, priorIntent, entity, context, request.params, request.init);
    debug.debugClassify(request, response);
    return response;
}

function buildMockResponse(intent, priorIntent,  entity, context, params, init) {
    debug.debugBuildMockResponse(intent, entity, context, params, init);
    if(priorIntent.intent && priorIntent.intent.length && priorIntent.intent.length > 0) {
        context.priorIntent = {
                "intent": priorIntent
        };
    } else {
        context.priorIntent = {
            "intent": undefined
        };
    }
    let response = {
        "classifications": {
                "intent": intent,
                "entity": entity
        },
        "context" : context,
        "init": init,
        "params": params,
        "statusCode": 200
    };
    return response;
}
