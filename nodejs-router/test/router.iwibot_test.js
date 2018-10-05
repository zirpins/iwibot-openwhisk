/**
 * Created by Armin on 11.06.2017.
 */
let request = require('request');
let actionUrl = process.env.ACTION_PREFIX_URL + '/router';

let params = {
    semester: 5,
    courseOfStudies: 'INFB',
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
        }
    }
};

module.exports = {
    'Router Action Test (timetable)' : function (test) {
        test.expect(2);
        params.payload = 'timetable friday';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('\n Action URL: \n' + actionUrl);
            console.log('\n Body:       \n' + JSON.stringify(body, null, 4));
            console.log('\n Error:      \n' + err);
            console.log('\n Response:   \n' + JSON.stringify(response, null, 4));
            body = JSON.parse(body);
            test.ok(typeof body.payload === 'string');
            test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
            test.done();
        });
    },
    'Router Action Test (meal)' : function (test) {
        test.expect(2);
        params.payload = 'Food 1';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('\n Action URL: \n' + actionUrl);
            console.log('\n Body:       \n' + JSON.stringify(body, null, 4));
            console.log('\n Error:      \n' + err);
            console.log('\n Response:   \n' + JSON.stringify(response, null, 4));
            body = JSON.parse(body);
            test.ok(typeof body.payload === 'string');
            test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
            test.done();
        });
    },
    'Router Action Test (joke)' : function (test) {
        test.expect(1);
        params.payload = 'joke';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('\n Action URL: \n' + actionUrl);
            console.log('\n Body:       \n' + JSON.stringify(body, null, 4));
            console.log('\n Error:      \n' + err);
            console.log('\n Response:   \n' + JSON.stringify(response, null, 4));
            body = JSON.parse(body);
            test.ok('payload' in body);
            test.done();
        });
    }
};