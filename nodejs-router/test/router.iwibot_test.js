/**
 * Created by Armin on 11.06.2017.
 */
const request = require('request');
const assert = require('chai').assert;
let actionUrl = process.env.ACTION_PREFIX_URL + '/router';

let params = {
    context: { // If this test is not successful, try to get a new context! (Log and paste it here!)
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
        },
        semester: 5,
        courseOfStudies: 'INFB'
    }
};

describe('Router Test Cases', () => {
    it('Router Action Test (timetable)', (done) => {
        params.payload = 'timetable friday';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            assert.isOk(body.payload);
            assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
            done();
        });
    });
    it('Router Action Test (meal)', (done) => {
        params.payload = 'Food 1';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            assert.isOk(body.payload);
            assert(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
            done();
        });
    });
    it('Router Action Test (joke)', (done) => {
        params.payload = 'joke';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            assert.isOk(body.payload);
            done();
        });
    })
})