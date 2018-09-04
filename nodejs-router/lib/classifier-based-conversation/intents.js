/* =========================================================
 * Intents that are known to the classifier
 * - name must be the same as given by the classifier
 * - entities must be the same order as in the actions
 * ========================================================= */

var debug = require('./conversationDebugPrints');

var joke = {
    name: 'Joke',
    type: 'one-stage',
    entities: [],
    refinementQuestions: []
}

var meal = {
    name: 'Meal',
    type: 'two-stage',
    entities: [
        'Platzhalter, Indizes beginnen in der Action bei 1.',
        'essen1',
        'essen2',
        'aktionstheke',
        'gutundguenstig',
        'buffet',
        'schnitzelbar'
    ],
    refinementQuestions: [
        'Für welches von folgenden Angebote interessierst du dich: Wahlessen 1, Wahlessen 2, Aktionstheke, Gut und Günstig, Buffet oder Schnitzelbar?'
    ]
}

var timetables = {
    name: 'Timetables',
    type: 'two-stage',
    entities: [
        'Platzhalter, Indizes beginnen in der Action bei 1.',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag',
        'Sonntag',
        'Montag'
    ],
    refinementQuestions: [
        'Für welchen Tag möchtest du den Stundenplan haben?',
        'Gib bitte noch einen Tag an.',
        'Ohne den Tag kann ich dir nicht weiterhelfen.'
    ]
}

var weather = {
    name: 'Weather',
    type: 'one-stage',
    entities: [],
    refinementQuestions: []
}

var navigation = {
    name: 'Navigation',
    type: 'two-stage',
    entities: [
        'Platzhalter, Indizes beginnen in der Action bei 1.',
        'Aula',
        'building E',
        'building F',
        'building LI',
        'building M',
        'building P',
        'building R',
        'cafeteria',
        'main entrance',
        'Mensa'
    ],
    refinementQuestions: [
        'Wohin soll ich dich navigieren?',
        'Wo möchtest du hin?',
        'Wo soll ich dich hinbringen?',
        'Wohin möchtest du?'
    ]
}

var intents = [
    joke,
    meal,
    timetables,
    weather,
    navigation
]


/**
* Gets an Object that represents the classification that was returned by
* the classifier-script. Those objects can represent Entities or Intents.
* @param {string} classification
*/
exports.getClassification = function(classifiedName) {
    var result = null;
    if (typeof classifiedName === 'string' || classifiedName instanceof String) {
        intents.forEach( function(intent) {
            if(classifiedName.trim().toLocaleLowerCase() == intent.name.trim().toLocaleLowerCase()) {
                result = intent;
            }
        })
    }
    debug.debugGetClassification(classifiedName, result);
    return result;
}


/**
 * Checks if the entity is fitting to the intent.
 * @param {*} priorIntent 
 * @param {*} entity 
 */
exports.entityIsCorrect = function(priorIntent, classifiedEntity) {
    var acceptedEntities = priorIntent.entities;
    var entityCorrect = false;
    if(acceptedEntities.length && acceptedEntities.length > 0 ) {
        acceptedEntities.forEach(
            function(acceptedEntity) {
                if(acceptedEntity === classifiedEntity ) {
                    entityCorrect = true;
                }
            }
        )
    }
    debug.debugEntityIsCorrect(priorIntent, classifiedEntity, entityCorrect);
    return entityCorrect;
}

/**
 * Gives back position of the entity in the array of entities in an intent.
 * The index has to be the same as the one used in the Action itself.
 * @param {*} priorIntent
 * @param {*} entity
 */
exports.index = function(intent, entityName) {
    var index = intent.entities.indexOf(entityName);
    return index.toString();
}