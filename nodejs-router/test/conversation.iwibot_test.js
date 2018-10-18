/**
 * Testfile for Testing the classifier-based conversation-logic and the classifier REST-Service
 * These tests are mainly here to make sure that the conversation-procedure is executed correctly.
 */

// =================================== letiables ===================================

let conversation = require('../lib/conversation');
let request = require('request');
let expect = require('chai').expect;
let assert = require('chai').assert;
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/router';

let params = {

};

let firstParams = { body: { conInit: true }, url: actionUrl};

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

describe('Conversation Test Cases', () =>{
    beforeEach(() => {
        return new Promise((resolve, reject) => {
            let options = buildRequestOptions(params, jokeSentence);
            request.post( options,
                function (err, response, body) {
                    body = JSON.parse(body);
                    assert.isOk(body.payload);
                    assert.isOk(body.context);
                    params.context = body.context;
                    resolve()
                });
        });
    });
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // :::::::::::::::::::::::::::::::::::::::::: Joke ::::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('responds a joke', (done) => {
        let options = buildRequestOptions(params, jokeSentence);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                //log(response, body, err, options.url);
                assert.isOk(body.payload);
                assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                done();
            });        
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ::::::::::::::::::::::::::::::::::::::::: Weather ::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    it('returns the weather', (done) => {
        let options = buildRequestOptions(params, weatherSentence);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                //log(response, body, err, options.url);
                assert.isOk(body.payload);
                assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                done();
            });  
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ::::::::::::::::::::::::::::::::::::::: Timetables :::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    context('Timetables Test Cases', () => {
        it('responds with a timetable; single-stage', (done) => {
            let options = buildRequestOptions(params, timetableSentenceAll);
            request.post( options,
                function (err, response, body) {
                    body = JSON.parse(body);
                    //log(response, body, err, options.url);
                    assert.isOk(body.payload);
                    assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                    done();
                });
        })

        it('responds with a timetable: two-stage', (done) => {
            // ~~~~~~ First Request ~~~~~~
            let options = buildRequestOptions(params, timetableSentenceOnlyIntent);
            request.post( options,
                function (err, response, body) {
                    body = JSON.parse(body);
                    assert.isOk(body.payload);
                    assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                    // ~~~~~~ Second Request ~~~~~~
                    let optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
                    request.post( optionsStageTwo,
                        function (err, response, body) {
                            //log(response, body, err, options.url);
                            body = JSON.parse(body);
                            assert.isOk(body.payload);
                            assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                            done();
                        });
                });
        });

        it('responds with a timetable: three-stage', (done) => {
            // ~~~~~~ First Request ~~~~~~
            let options = buildRequestOptions(params, timetableSentenceOnlyIntent);
            request.post( options,
                function (err, response, body) {

                    body = JSON.parse(body);
                    assert.isOk(body.payload);
                    assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                    // ~~~~~~ Second Request ~~~~~~
                    let optionsStageTwo = buildRequestOptions(body, garbageSentence);
                    request.post( optionsStageTwo,
                        function (err, response, body) {

                            body = JSON.parse(body);
                            assert.isOk(body.payload);
                            assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                            // ~~~~~~ Third Request ~~~~~~
                            let optionsStageTwo = buildRequestOptions(body, timetableSentenceEntity);
                            request.post( optionsStageTwo,
                                function (err, response, body) {

                                    body = JSON.parse(body);
                                    assert.isOk(body.payload);
                                    assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                                    done();
                                });
                        });
                });
        })
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // :::::::::::::::::::::::::::::::::::::::::: Meal ::::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    context('Meal Test Cases', (done) => {

        it('responds a meal: single-stage', (done) => {
            let options = buildRequestOptions(params, mealSentenceAll);
            request.post( options,
                function (err, response, body) {
                    body = JSON.parse(body);
                    assert.isOk(body.payload);
                    assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                    done();
                });
        });

        it('responds a meal: two-stage', (done) => {
            let options = buildRequestOptions(params, mealSentenceOnlyIntent);
            request.post( options,
                function (err, response, body) {

                    body = JSON.parse(body);
                    assert.isOk(body.payload);
                    assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                    // ~~~~~~ Second Request ~~~~~~
                    let optionsStageTwo = buildRequestOptions(body, mealSentenceEntity);
                    request.post( optionsStageTwo,
                        function (err, response, body) {

                            body = JSON.parse(body);
                            assert.isOk(body.payload);
                            assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                            done();
                        });
                });
        })
    })

});


// =================================== Utilities for build test-options ===================================

function buildRequestOptions(params, sentence) {
    let body = newRequestBody(params, sentence);
    return {
        headers: {'content-type': 'text/plain'},
        url: actionUrl,
        body: JSON.stringify(body)
    };
}

/**
 * Build a new param-object with the old Response-Body's context and the requested sentence
 * @param {any} params
 * @param {string} sentence
 */
function newRequestBody(params, sentence) {
    let requestBody = {};
    if(params && params.context) {
        requestBody.context = params.context;
    } else {
        requestBody = firstParams;
    }
    if(sentence) {
        requestBody.payload = sentence;
    } else {
        requestBody.payload = 'placeholder sentence'
    }
    return requestBody;
}