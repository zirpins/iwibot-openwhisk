/*
 * Functionalities for printing variable-values for debugging-purposes
 */

// ============================================================================================================
//          conversation.js
// ============================================================================================================

exports.debugCheckStateAndHandleSuccess = function(error, response) {
    console.log("~~~~~~~~~~~~ START debugCheckStateAndHandleSuccess ~~~~~~~~~~~~");
    console.log("[Conversation-Logic, error]:     START<\n", error,     "\n>END");
    console.log("[Conversation-Logic, response]:  START<\n", response,  "\n>END");
    console.log("~~~~~~~~~~~~~ END debugCheckStateAndHandleSuccess ~~~~~~~~~~~~~");
}

exports.debugHandleResponse = function(error, response) {
    console.log("~~~~~~~~~~~~ START debugHandleResponse ~~~~~~~~~~~~");
    console.log("[Conversation-Logic, error]:     START<\n", error,     "\n>END");
    console.log("[Conversation-Logic, response]:  START<\n", response,  "\n>END");
    console.log("~~~~~~~~~~~~~ END debugHandleResponse ~~~~~~~~~~~~~");
}

exports.debugHandleStateNoPriorIntent = function(intent) {
    console.log("~~~~~~~~~~~~ START debugHandleStateNoPriorIntent ~~~~~~~~~~~~");
    console.log("[Conversation-Logic, intent]:  START<\n", intent,  "\n>END");
    console.log("~~~~~~~~~~~~~ END debugHandleStateNoPriorIntent ~~~~~~~~~~~~~");
}

exports.debugNPIHandleIntentClassification = function(responseBody, intent) {
    console.log("~~~~~~~~~~~~ START debugNPIHandleIntentClassification ~~~~~~~~~~~~");
    console.log("[Conversation-Logic, responseBody]:    START<\n", responseBody,    "\n>END");
    console.log("[Conversation-Logic, intent]:          START<\n", intent,  "\n>END");
    console.log("~~~~~~~~~~~~~ END debugNPIHandleIntentClassification ~~~~~~~~~~~~~");
}

exports.debugWFEHandleIntentClassification = function(responseBody, intent) {
    console.log("~~~~~~~~~~~~ START debugWFEHandleIntentClassification ~~~~~~~~~~~~");
    console.log("[Conversation-Logic, responseBody]:    START<\n", responseBody,    "\n>END");
    console.log("[Conversation-Logic, intent]:          START<\n", intent,  "\n>END");
    console.log("~~~~~~~~~~~~~ END debugWFEHandleIntentClassification ~~~~~~~~~~~~~");
}

exports.debugWFEHandleEntityClassification = function(response, priorIntent) {
    console.log("~~~~~~~~~~~~ START debugWFEHandleEntityClassification ~~~~~~~~~~~~");
    console.log("[Conversation-Logic, response]:    START<\n", response,         "\n>END");
    console.log("[Conversation-Logic, priorIntent]: START<\n", priorIntent,  "\n>END");
    console.log("~~~~~~~~~~~~~ END debugWFEHandleEntityClassification ~~~~~~~~~~~~~");
}

exports.debugSendMessage = function(init, params) {
    console.log("~~~~~~~~~~~~ START debugSendMessage ~~~~~~~~~~~~");
    console.log("[Conversation-Logic, init]:   START<\n", init,   "\n>END");
    console.log("[Conversation-Logic, params]: START<\n", params, "\n>END");
    console.log("~~~~~~~~~~~~~ END debugSendMessage ~~~~~~~~~~~~~");
}

// ============================================================================================================
//          conversationContext.js
// ============================================================================================================

exports.debugGetNewContext = function(context) {
    console.log("~~~~~~~~~~~~ START debugGetNewContext ~~~~~~~~~~~~");
    console.log("[Conversation-Context, context]: START<\n", context, "\n>END");
    console.log("~~~~~~~~~~~~~ END debugGetNewContext ~~~~~~~~~~~~~");
}

exports.debugNewUUID = function(uuid) {
    console.log("~~~~~~~~~~~~ START debugNewUUID ~~~~~~~~~~~~");
    console.log("[Conversation-Context, UUID]: START<\n", uuid, "\n>END");
    console.log("~~~~~~~~~~~~~ END debugNewUUID ~~~~~~~~~~~~~");
}

// ============================================================================================================
//          intents.js
// ============================================================================================================

exports.debugGetClassification = function(classifiedName, result) {
    console.log("~~~~~~~~~~~~ START debugGetClassification ~~~~~~~~~~~~");
    console.log("[Conversation-Objects, classifiedName]:    START<\n", classifiedName, "\n>END");
    console.log("[Conversation-Objects, result]:            START<\n", result,         "\n>END");
    console.log("~~~~~~~~~~~~~ END debugGetClassification ~~~~~~~~~~~~~");
}

exports.debugEntityIsCorrect = function(priorIntent, classifiedEntity, entityCorrect) {
    console.log("~~~~~~~~~~~~ START debugEntityIsCorrect ~~~~~~~~~~~~");
    console.log("[Conversation-Objects, priorIntent]:       START<\n", priorIntent,      "\n>END");
    console.log("[Conversation-Objects, classifiedEntity]:  START<\n", classifiedEntity, "\n>END");
    console.log("[Conversation-Objects, entityCorrect]:     START<\n", entityCorrect,    "\n>END");
    console.log("~~~~~~~~~~~~~ END debugEntityIsCorrect ~~~~~~~~~~~~~");
}

// ============================================================================================================
//          conversationObjects.js
// ============================================================================================================

exports.debugPrepareBody = function(init, params, body) {
    console.log("~~~~~~~~~~~~ START debugPrepareBody ~~~~~~~~~~~~");
    console.log("[Conversation-Objects, init]:   START<\n", init,   "\n>END");
    console.log("[Conversation-Objects, params:  START<\n", params, "\n>END");
    console.log("[Conversation-Objects, body]:   START<\n", body,   "\n>END");
    console.log("~~~~~~~~~~~~~ END debugPrepareBody ~~~~~~~~~~~~~");
}

exports.debugBuildResponse = function(sentence, intent, confidence, entity, context, refinementText, customObject) {
    console.log("~~~~~~~~~~~~ START debugBuildResponse ~~~~~~~~~~~~");
    console.log("[Conversation-Objects, sentence]:       START<\n", sentence,        "\n>END");
    console.log("[Conversation-Objects, intent]:         START<\n", intent,          "\n>END");
    console.log("[Conversation-Objects, confidence]:     START<\n", confidence,      "\n>END");
    console.log("[Conversation-Objects, entity]:         START<\n", entity,          "\n>END");
    console.log("[Conversation-Objects, context]:        START<\n", context,         "\n>END");
    console.log("[Conversation-Objects, refinementText]: START<\n", refinementText,  "\n>END");
    console.log("[Conversation-Objects, customObject]:   START<\n", customObject,    "\n>END");
    console.log("~~~~~~~~~~~~~ END debugBuildResponse ~~~~~~~~~~~~~");
}

// ============================================================================================================
//          mockClassifierRestService.js
// ============================================================================================================

exports.debugClassify = function(request, response) {
    console.log("~~~~~~~~~~~~ START debugClassify ~~~~~~~~~~~~");
    console.log("[Mock-Classifier, request]:  START<\n", request,  "\n>END");
    console.log("[Mock-Classifier, response]: START<\n", response, "\n>END");
    console.log("~~~~~~~~~~~~~ END debugClassify ~~~~~~~~~~~~~");
}

exports.debugBuildMockResponse = function(intent, entity, context, params, init) {
    console.log("~~~~~~~~~~~~ START debugBuildMockResponse ~~~~~~~~~~~~");
    console.log("[Mock-Classifier, intent]:     START<\n", intent,      "\n>END");
    console.log("[Mock-Classifier, entity]:     START<\n", entity,      "\n>END");
    console.log("[Mock-Classifier, context]:    START<\n", context,     "\n>END");
    console.log("[Mock-Classifier, params]:     START<\n", params,      "\n>END");
    console.log("[Mock-Classifier, init]:       START<\n", init,        "\n>END");
    console.log("~~~~~~~~~~~~~ END debugBuildMockResponse ~~~~~~~~~~~~~");
}