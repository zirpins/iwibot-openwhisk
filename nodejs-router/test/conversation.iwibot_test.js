/**
 * Testfile for Testing the classifier-based conversation-logic and the classifier REST-Service
 * These tests are mainly here to make sure that the conversation-procedure is executed correctly.
 */

// =================================== letiables ===================================

let conversation = require('../lib/conversation');
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/router';
let initParams = {
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
let responseBodyParsingError = "'responseBody' could not be parsed. Maybe it already has been parsed. Please check in tests for conversation-service";
let genericError = conversation.genericErrorMessage;

// =================================== Router sentences ===================================

let jokeSentence =                    'Erzähle mir einen Witz !';
let weatherSentence =                 'Wie wird das Wetter ?';
let timetableSentenceAll =            'Was steht am Donnerstag auf dem Stundenplan?';
let timetableSentenceOnlyIntent =     'Was steht auf dem Stundenplan?';
let timetableSentenceEntity =         'Mittwoch';
let mealSentenceAll =                 'Was gibt es als Wahlessen 1?';
let mealSentenceOnlyIntent =          'Was gibt es heute zu Essen?';
let mealSentenceEntity =              'Aktionstheke';
let garbageSentence =                 'Skidoodle';

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
        let options = buildRequestOptions(null, jokeSentence);
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
        let options = buildRequestOptions(null, weatherSentence);
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
        let options = buildRequestOptions(null, timetableSentenceAll);
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
        let options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                let optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
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
        let options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                let optionsStageTwo = buildRequestOptions(body, jokeSentence);
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
        let options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                let optionsStageTwo = buildRequestOptions(body, jokeSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        let optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
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
        let options = buildRequestOptions(null, timetableSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                let optionsStageTwo = buildRequestOptions(body, garbageSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        let optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
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
        let options = buildRequestOptions(null, mealSentenceAll);
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
        let options = buildRequestOptions(null, mealSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                let optionsStageTwo = buildRequestOptions(body, mealSentenceEntity);
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
        let options = buildRequestOptions(null, mealSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                let optionsStageTwo = buildRequestOptions(body, garbageSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        let optionsStageTwo = buildRequestOptions(body, mealSentenceEntity);
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
    let body = newRequestBody(responseBody, sentence);
    let options = {
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
    let requestBody = initParams;
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