// Conversation Service for own Classifier
var request = require('request');
// Some Util-Functions
var util = require('./conversationUtils');
// ResponseObjects and Body for Requests to Classifier
var objects = require('./conversationObjects');
// Intents for Conversation
var intents = require('./intents');
// Only for test-purposes
var mock = require('./mockedClassifier');
var debug = require('./conversationDebugPrints');

var genericError = "Ich habe Sie nicht verstanden. Bitte formulieren Sie Ihre Aussage neu.";
exports.genericErrorMessage = genericError;
var technicalError = "Leider habe ich dich nicht verstanden oder es gibt technische Probleme. Bitte formulieren Sie Ihre Aussage neu oder versuche es später erneut.";
var initSentence = "Hallo, mein Name ist IWIBot. Ich kann dir mit Fragen rund um deinen Stundenplan, das Wetter oder die Mensa helfen. Wenn du willst, kann ich dich auch zum Lachen bringen. ";

var intentURL = "https://iwibotclassifier.mybluemix.net/api/getIntent";
var entityURL = "https://iwibotclassifier.mybluemix.net/api/getEntity";


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
        var requestBody = objects.prepareBody(init, params);
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

// Calls a mocked JS-Classifier that only is able to classify the test-sentences given in 'router-test.js'
function callMockClassifier(body, resolve, reject) {
    var error = null;
    var response = mock.classify(body);
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
    var priorIntentNull = ((!body.context.priorIntent) || (!body.context.priorIntent.intent));
    if ((priorIntentNull) || (util.isEmptyString(body.context.priorIntent.intent))) {
        handleStateNoPriorIntent(body, resolve, reject);
    } else if ((body.context.priorIntent.intent) && (util.isNonEmptyString(body.context.priorIntent.intent))) {
        var priorIntent = intents.getClassification(body.context.priorIntent.intent);
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
    var sentence = requestBody.sentence;
    var customObject = null;
    var intentName = "";
    var confidence = 1.0;
    var entity = -1;
    var context = requestBody.context;
    var refinementText = initSentence;
    var answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
    resolve(answer);
}

// ============================================================================================================
//                                       STATE = No Prior Intent (NPI)
// ============================================================================================================

function handleStateNoPriorIntent(body, resolve, reject) {
    console.log("[Conversation-Logic]: Start 'handleStateNoPriorIntent()'");
    try {
        var intentIsSet =  (body.classifications.intent.length && (body.classifications.intent.length > 0));
        var intentName = (intentIsSet)? body.classifications.intent : "" ;
        var intent = intents.getClassification(intentName);
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
        var sentence = body.params.payload;
        var customObject = body.params.customObject;
        var intentName = intent.name;
        var confidence = 1.0;
        var entity = -1;
        var context = body.context;
        var refinementText = "";
        var answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
        resolve(answer);
    } else if (intent.type && intent.type === 'two-stage') {
        body.params.context.priorIntent = {
            "intent": body.classifications.intent
        };
        body.init = false;
        var requestBody = objects.prepareBody(false, body.params);
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
    var intent = intents.getClassification(body.classifications.intent);
    debug.debugWFEHandleIntentClassification(body, intent);
    var context = body.context;
    if(intent && intent != null) {
        if(intent.type && intent.type === 'one-stage') {
            console.log("WFEHandleIntentClassification: one-stage intent type");
            context.priorIntent.intent = "";
            var sentence = body.params.payload;
            var customObject = body.params.customObject;
            var intentName = intent.name;
            var confidence = 1.0;
            var entity = -1;
            var context = body.context;
            var refinementText = "";
            var answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
            resolve(answer);
        } else if (intent.type && intent.type === 'two-stage') {
            console.log("WFEHandleIntentClassification: two-stage intent type");
            // Check if message also contains an entity -> no resolve right now, resolve in next call!
            body.params.context.priorIntent = {
                "intent": body.classifications.intent
            };
            body.init = false;
            var requestBody = objects.prepareBody(false, body.params);
            classifyEntity(requestBody, resolve, reject);
        }
    } else {
        console.log("WFEHandleIntentClassification: No intent was found");
        // Check if message also contains an entity -> no resolve right now, resolve in next call!
        body.init = false;
        var requestBody = objects.prepareBody(false, body.params);
        classifyEntity(requestBody, resolve, reject);
    }

}

function WFEHandleEntityClassification(body, priorIntent, resolve) {
    console.log("[Conversation-Logic]: Start 'WFEHandleEntityClassification()'");
    debug.debugWFEHandleEntityClassification(body, priorIntent);
    var entityCorrect = intents.entityIsCorrect(priorIntent, body.classifications.entity);
    if(entityCorrect) {
        console.log("WFEHandleEntityClassification: Entity is Correct");
        var sentence = body.params.payload;
        var customObject = body.params.customObject;
        var intentName = priorIntent.name;
        var confidence = 1.0;
        var entity = intents.index(priorIntent, body.classifications.entity);
        var context = body.context;
        var refinementText = "";
        var answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
        resolve( answer );
    } else {
        console.log("WFEHandleEntityClassification: Entity is False");
        var max = priorIntent.refinementQuestions.length;
        var refinementText = priorIntent.refinementQuestions[util.random(1, max)-1];
        var sentence = body.params.payload;
        var customObject = body.params.customObject;
        var intentName = "";
        var confidence = 1.0;
        var entity = -1;
        var context = body.context;
        var answer = objects.buildResponse(sentence, intentName, confidence, entity, context, refinementText, customObject);
        resolve(answer);
    }
}
