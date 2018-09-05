/**
 * Testfile for Testing the classifier-based conversation-logic and the classifier REST-Service
 * These tests are mainly here to make sure that the conversation-procedure is executed correctly.
 */

// =================================== Variables ===================================

var conversation = require('../lib/conversation');
var request = require('request');
var actionUrl = process.env.ACTION_PREFIX_URL + '/router';
var initParams = {
    semester: 5,
    courseOfStudies: 'INFB',
    context: {
        conversation_id: 'edde5df3-a4d2-4875-ada7-ca95dec02daf',
        priorIntent:{
            intent : 'greeting'
        },
        system: {
            dialog_stack:[{dialog_node: 'root'}],
            dialog_turn_counter: 1,
            dialog_request_counter: 1,
            _node_output_map:{
                "Willkommen":[0]
            }
        }
    }
};
var responseBodyParsingError = "'responseBody' could not be parsed. Maybe it already has been parsed. Please check in tests for conversation-service";
var genericError = conversation.genericErrorMessage;

// =================================== Router sentences ===================================

var jokeSentence =                    'Erzähle mir einen Witz !';
var weatherSentence =                 'Wie wird das Wetter ?';
var timetableSentenceAll =            'Was steht am Donnerstag auf dem Stundenplan?';
var timetableSentenceOnlyIntent =     'Was steht auf dem Stundenplan?';
var timetableSentenceEntity =         'Mittwoch';
var mealSentenceAll =                 'Was gibt es als Wahlessen 1?';
var mealSentenceOnlyIntent =          'Was gibt es heute zu Essen?';
var mealSentenceEntity =              'Aktionstheke';
var garbageSentence =                 'Skidoodle';

console.log("=========================================================================================================");
console.log("                                         Start Conversation-Tests                                        ");
console.log("=========================================================================================================");
console.log("generic error message:         ", genericError);
console.log("action url:                    ", actionUrl);
console.log("=========================================================================================================");
console.log("jokeSentence:                  ", jokeSentence);
console.log("weatherSentence:               ", weatherSentence);
console.log("timetableSentenceAll:          ", timetableSentenceAll);
console.log("timetableSentenceOnlyIntent:   ", timetableSentenceOnlyIntent);
console.log("timetableSentenceEntity:       ", timetableSentenceEntity);
console.log("mealSentenceAll:               ", mealSentenceAll);
console.log("mealSentenceOnlyIntent:        ", mealSentenceOnlyIntent);
console.log("mealSentenceEntity:            ", mealSentenceEntity);
console.log("garbageSentence:               ", garbageSentence);
console.log("=========================================================================================================");


// =================================== Tests ===================================

module.exports = {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // :::::::::::::::::::::::::::::::::::::::::: Joke ::::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (joke)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (joke) ~~~~~ \n")
        var options = buildRequestOptions(null, jokeSentence);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ::::::::::::::::::::::::::::::::::::::::: Weather ::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (weather)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (weather) ~~~~~ \n")
        var options = buildRequestOptions(null, weatherSentence);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ::::::::::::::::::::::::::::::::::::::: Timetables :::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (timetable, one sentence)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (timetable, one sentence) ~~~~~ \n")
        var options = buildRequestOptions(null, timetableSentenceAll);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    'Conversation Action Test (timetable, two sentences)' : function (test) {
        test.expect(4);
        console.log("\n ~~~~~ Run Conversation Action Test (timetable, two sentences) ~~~~~ \n");

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        test.done();
                });
        });
    },

    'Conversation Action Test (timetable, abort timetable)' : function (test) {
        test.expect(4);
        console.log("\n ~~~~~ Run Conversation Action Test (timetable, abort timetable) ~~~~~ \n");

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, jokeSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        test.done();
                });
        });
    },

    /*'Conversation Action Test (timetable, abort timetable, check if priorIntent is deleted)' : function (test) {
        test.expect(7);
        console.log("\n ~~~~~ Run Conversation Action Test (timetable, abort timetable, check if priorIntent is deleted) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, jokeSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        var optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
                        request.post( optionsStageTwo,
                            function (err, response, body) {
                                consoleLog(body, err, response);
                                body = JSON.parse(body);
                                test.ok(typeof body.payload === 'string');
                                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                                test.ok(body.payload.indexOf(genericError) !== -1 );
                                test.done();
                        });
                });
        });
    },*/

    'Conversation Action Test (timetable, three sentences)' : function (test) {
        test.expect(6);
        console.log("\n ~~~~~ Run Conversation Action Test (timetable, three sentences) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, garbageSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        var optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
                        request.post( optionsStageTwo,
                            function (err, response, body) {
                                consoleLog(body, err, response);
                                body = JSON.parse(body);
                                test.ok(typeof body.payload === 'string');
                                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                                test.done();
                        });
                });
        });
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // :::::::::::::::::::::::::::::::::::::::::: Meal ::::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (meal, one sentence)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (meal, one sentence) ~~~~~ \n")
        var options = buildRequestOptions(null, mealSentenceAll);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    'Conversation Action Test (meal, two sentences)' : function (test) {
        test.expect(4);
        console.log("\n ~~~~~ Run Conversation Action Test (meal, two sentences) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, mealSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, mealSentenceEntity);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        test.done();
                });
        });
    },
    
    'Conversation Action Test (timetable, three sentences)' : function (test) {
        test.expect(6);
        console.log("\n ~~~~~ Run Conversation Action Test (timetable, three sentences) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, mealSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, garbageSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        var optionsStageTwo = buildRequestOptions(body, mealSentenceEntity);
                        request.post( optionsStageTwo,
                            function (err, response, body) {
                                consoleLog(body, err, response);
                                body = JSON.parse(body);
                                test.ok(typeof body.payload === 'string');
                                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                                test.done();
                        });
                });
        });
    }
};


// =================================== Utilities for build test-options ===================================

function buildRequestOptions(responseBody, sentence) {
    var body = newRequestBody(responseBody, sentence);
    var options = {
        headers: {'content-type': 'text/plain'},
        url: actionUrl,
        body: JSON.stringify(body)
    };
    return options
}

/**
 * Build a new param-object with the old Response-Body's context and the requested sentence
 * @param {any} responseBody
 * @param {string} sentence
 */
function newRequestBody(responseBody, sentence) {
    if (requestBody) {
        responseBody = JSON.parse(responseBody);
    }
    var requestBody = initParams;
    if(responseBody && responseBody.context) {
        requestBody.context = responseBody.context;
    }
    if(sentence) {
        requestBody.payload = sentence;
    }
    console.log('\n Request-Body \n' + JSON.stringify(requestBody, null, 4));
    return requestBody;
}

function consoleLog(body, err, response) {
    console.log('\n Body:       \n' + JSON.stringify(body, null, 4));
    console.log('\n Error:      \n' + err);
    console.log('\n Response:   \n' + JSON.stringify(response, null, 4));
}