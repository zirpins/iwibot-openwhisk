/*
 * Funktionalitäten zum erstellen eines neuen Conversation-Kontext.
 * Diese dienen dazu neue Nutzer von vorhandenen zu unterscheiden, indem
 * mit jedem INIT-Request für eine neue Conversation ein neuer Kontext
 * als Signatur für den Nutzer ausgestellt wird.
 * Dieser Kontext wird mit jeder weiteren Anfrage mitgesendet.
 */

var debug = require('./conversationDebugPrints');

/**
 * Erstellen eines neuen Conversation-Kontext.
 */
exports.getNewContext = function() {
    var context;
    var newConversationID = newUUID();
    context = {
        "conversation_id": newConversationID,
        "priorIntent": {
            "intent": ""
        },
        "system":{
            "dialog_stack":[],
            "dialog_turn_counter":1,
            "dialog_request_counter":1,
            "_node_output_map":[]
        }
    }
    debug.debugGetNewContext(context)
    return context;
}

/**
 * Erzeugen einer neuen, zufälligen UUID.
 */
function newUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    debug.debugNewUUID(uuid);
    return uuid;
}
