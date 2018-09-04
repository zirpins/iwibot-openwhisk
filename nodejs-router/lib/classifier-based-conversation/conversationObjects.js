// Create new Contexts
var context = require('./conversationContext');
var debug = require('./conversationDebugPrints');

/**
  * Build Request Body for REST-Request to the Classifier
  * @param {boolean} init       Initialer Request?
  * @param {any} params         Parameter für die Klassifizierung
  * @param {any} priorIntent    
  */
exports.prepareBody = function(init, params) {
    console.log("Start method prepareBody");
    console.log("[params]:", params);
    var body;
    if(init) {
        var newContext = context.getNewContext();
        body =  {
            sentence: params.payload.toString(),
            context: newContext,
            init: init,
            params: params
        };
        body.params.context = newContext;
    } else {
        body =  {
            sentence: params.payload.toString(),
            context: params.context,
            init: init,
            params: params
        };
    }
    debug.debugPrepareBody(init, params, body);
    return body;
}


/**
 * Builds response in the same form as the Bluemix-Conversation 
 * Sichert Kompatibilität mit Bluemix Conversation Service.
 * @param {string} sentence         Satz, der klassifiziert wurde
 * @param {string} intent           Action die ausgeführt werden soll
 * @param {number} confidence       Wahrscheinlichkeit mit der der Intent stimmt
 * @param {number} entity           Spezifizert Wochentage, Wahlessen usw für Actions
 * @param {Object} context          Context um Anfragende Instanzen zu unterscheiden
 * @param {string} refinementText   Text der angezeigt wird, wenn weitere Informationen benötigt werden (für entity)
 */
exports.buildResponse = function(sentence, intent, confidence, entity, context, refinementText, customObject) {
    debug.debugBuildResponse(sentence, intent, confidence, entity, context, refinementText, customObject);
    var response;
    response = {
        "intents":[
           {
              "intent":intent,
              "confidence": confidence
           }
        ],
        "entities":[
            {
                "value" : entity
            }
        ],
        "input":{
           "text":sentence
        },
        "output":{
           "text":[
               refinementText
           ],
           "nodes_visited":[
              // "node_9_1504125683613"
           ],
           //"log_messages":[]
        },
        "context": context
    }
    if(intent && intent.length && intent.length > 0) {
        response.output.actionToInvoke = intent;
    }
    if (customObject && customObject !== null) {
        response.output.customObject = customObject;
    }
    return response;
}
