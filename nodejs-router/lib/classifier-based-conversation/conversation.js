// Conversation Service for own Classifier
let request = require('request');
// Some Util-Functions
let util = require('./conversationUtils');
// ResponseObjects and Body for Requests to Classifier
let objects = require('./conversationObjects');
// Intents for Conversation
let intents = require('./intents');
// Only for test-purposes
let mock = require('./mockedClassifier');
let debug = require('./conversationDebugPrints');

let genericError = "Ich habe Sie nicht verstanden. Bitte formulieren Sie Ihre Aussage neu.";
exports.genericErrorMessage = genericError;
let technicalError = "Leider habe ich dich nicht verstanden oder es gibt technische Probleme. Bitte formulieren Sie Ihre Aussage neu oder versuche es später erneut.";
let initSentence = "Hallo, mein Name ist IWIBot. Ich kann dir mit Fragen rund um deinen Stundenplan, das Wetter oder die Mensa helfen. Wenn du willst, kann ich dich auch zum Lachen bringen. ";

let intentURL = "https://iwibotclassifier.mybluemix.net/api/getIntent";
let entityURL = "https://iwibotclassifier.mybluemix.net/api/getEntity";


// ============================================================================================================
//                                              Send Message
// ============================================================================================================

/**
 * Classifies an sentence given by the user and gives back an intent and entities if neccessary or 
 * an refinement question if the sentence could not be classified.
 * The Parameters must be the same one the Bluemix-Conversation JS-File takes!
 * @param {boolean} init    Is it an initial contact with the conversation-service?
 * @param {any} params      Contains important information about the context of the 
 *                          conversation and the sentence that has to be classified
 */
exports.sendMessage = function sendMessage(init, params) {
    console.log("[Conversation-Logic]: Start 'sendMessage()'");
    debug.debugSendMessage(init,params);
    return new Promise(function (resolve, reject) {
        let requestBody = objects.prepareBody(init, params);
        if(init) {
            handleInitRequest(requestBody, resolve);
        } else {
            classifyIntent(requestBody, resolve, reject);
        }
    });
};

// For classifying an intent
function classifyIntent(requestBody, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'classifyIntent()'");
    request({
        method: 'POST',
        url: intentURL,
        headers: {'content-type': 'application/json'},
        body: requestBody,
        json: true
    }, function (error, response, body) {
        handleResponse(
            error,
            response,
            body,
            resolve,
            reject
        );
    });
}

// For classifying an entity
function classifyEntity(body, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'classifyEntity()'");
    request({
        method: 'POST',
        url: entityURL,
        headers: {'content-type': 'application/json'},
        body: body,
        json: true
    }, function (error, response, body) {
        handleResponse(
            error,
            response,
            body,
            resolve,
            reject
        );
    });
}

// Calls a mocked JS-Classifier that only is able to classify the test-sentences given in 'router.iwibot_test.js'
function callMockClassifier(body, resolve, reject) {
    let error = null;
    let response = mock.classify(body);
    handleResponse(
        error,
        response,
        body,
        resolve,
        reject
    );
}


// ============================================================================================================
//                                       Handle Response and Check State
// ============================================================================================================

function handleResponse(error, response, body, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'handleResponse()'");
    console.log("[Conversation-Logic, Response-Body]:", body);
    debug.debugHandleResponse(error, body);
    if (error === null && response.statusCode === 200) {
        checkStateAndHandleSuccess(error, body, resolve,reject);
    } else {
        console.log("[Conversation-Logic]: ERROR");
        reject(technicalError);
    }
}

function checkStateAndHandleSuccess(error, body, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'checkStateAndHandleSuccess()'");
    debug.debugCheckStateAndHandleSuccess(error, body);
    let priorIntentNull = ((!body.context.priorIntent) || (!body.context.priorIntent.intent));
    if ((priorIntentNull) || (util.isEmptyString(body.context.priorIntent.intent))) {
        handleStateNoPriorIntent(body, resolve, reject);
    } else if ((body.context.priorIntent.intent) && (util.isNonEmptyString(body.context.priorIntent.intent))) {
        let priorIntent = intents.getClassification(body.context.priorIntent.intent);
        handleStateWaitingForEntity(priorIntent, body, resolve, reject);
    } else {
        reject(genericError);
    }
}


// ============================================================================================================
//                                           STATE = Init Request
// ============================================================================================================

function handleInitRequest(requestBody, resolve) {
    console.log("[Conversation-Logic]: Start 'handleInitRequest()'");
    let sentence = requestBody.sentence;
    let customObject = null;
    let intentName = "";
    let confidence = 1.0;
    let entity = -1;
    let context = requestBody.context;
    let refinementText = initSentence;
    let answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
    resolve(answer);
}

// ============================================================================================================
//                                       STATE = No Prior Intent (NPI)
// ============================================================================================================

function handleStateNoPriorIntent(body, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'handleStateNoPriorIntent()'");
    try {
        let intentIsSet =  (body.classifications.intent.length && (body.classifications.intent.length > 0));
        let intentName = (intentIsSet)? body.classifications.intent : "" ;
        let intent = intents.getClassification(intentName);
    } catch (ex) {
        console.log("[CONVERSATION-LOGIC-ERROR]", ex);
        reject(genericError);
    }
    debug.debugHandleStateNoPriorIntent(intent);
    if (intent != null) {
        NPIHandleIntentClassification(body, intent, resolve, reject);
    } else {
        reject(genericError);
    }
}

function NPIHandleIntentClassification(body, intent, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'NPIHandleIntentClassification()'");
    debug.debugNPIHandleIntentClassification(body, intent);
    if(intent.type && intent.type === 'one-stage') {
        let sentence = body.params.payload;
        let customObject = body.params.customObject;
        let intentName = intent.name;
        let confidence = 1.0;
        let entity = -1;
        let context = body.context;
        let refinementText = "";
        let answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
        resolve(answer);
    } else if (intent.type && intent.type === 'two-stage') {
        body.params.context.priorIntent = {
            "intent": body.classifications.intent
        };
        body.init = false;
        let requestBody = objects.prepareBody(false, body.params);
        classifyEntity(requestBody, resolve, reject);
    } else {
        reject(genericError);
    }
}


// ============================================================================================================
//                                      STATE = Waiting for Entity (WFE)
// ============================================================================================================

function handleStateWaitingForEntity(priorIntent, body, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'handleStateWaitingForEntity()'");
    console.log(body.classifications.intent);
    console.log(body.classifications.entity);
    if (body.classifications.intent != undefined) {
        WFEHandleIntentClassification(body, resolve, reject);
    } else {
        if (body.classifications.entity != undefined) {
            WFEHandleEntityClassification(body, priorIntent, resolve);
        } else {
            reject(genericError);
        }
    }
}

function WFEHandleIntentClassification(body, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'WFEHandleIntentClassification()'");
    let intent = intents.getClassification(body.classifications.intent);
    debug.debugWFEHandleIntentClassification(body, intent);
    let context = body.context;
    if(intent && intent != null) {
        if(intent.type && intent.type === 'one-stage') {
            console.log("WFEHandleIntentClassification: one-stage intent type");
            context.priorIntent.intent = "";
            let sentence = body.params.payload;
            let customObject = body.params.customObject;
            let intentName = intent.name;
            let confidence = 1.0;
            let entity = -1;
            let context = body.context;
            let refinementText = "";
            let answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
            resolve(answer);
        } else if (intent.type && intent.type === 'two-stage') {
            console.log("WFEHandleIntentClassification: two-stage intent type");
            // Check if message also contains an entity -> no resolve right now, resolve in next call!
            body.params.context.priorIntent = {
                "intent": body.classifications.intent
            };
            body.init = false;
            let requestBody = objects.prepareBody(false, body.params);
            classifyEntity(requestBody, resolve, reject);
        }
    } else {
        console.log("WFEHandleIntentClassification: No intent was found");
        // Check if message also contains an entity -> no resolve right now, resolve in next call!
        body.init = false;
        let requestBody = objects.prepareBody(false, body.params);
        classifyEntity(requestBody, resolve, reject);
    }

}

function WFEHandleEntityClassification(body, priorIntent, resolve) {
    console.log("[Conversation-Logic]: Start 'WFEHandleEntityClassification()'");
    debug.debugWFEHandleEntityClassification(body, priorIntent);
    let entityCorrect = intents.entityIsCorrect(priorIntent, body.classifications.entity);
    if(entityCorrect) {
        console.log("WFEHandleEntityClassification: Entity is Correct");
        let sentence = body.params.payload;
        let customObject = body.params.customObject;
        let intentName = priorIntent.name;
        let confidence = 1.0;
        let entity = intents.index(priorIntent, body.classifications.entity);
        let context = body.context;
        let refinementText = "";
        let answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
        resolve( answer );
    } else {
        console.log("WFEHandleEntityClassification: Entity is False");
        let max = priorIntent.refinementQuestions.length;
        let refinementText = priorIntent.refinementQuestions[util.random(1, max)-1];
        let sentence = body.params.payload;
        let customObject = body.params.customObject;
        let intentName = "";
        let confidence = 1.0;
        let entity = -1;
        let context = body.context;
        let answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
        resolve(answer);
    }
}
