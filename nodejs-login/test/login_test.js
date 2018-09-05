/**
 * Created by Armin on 05.06.2017.
 */
var request = require('request');
var actionUrl = process.env.ACTION_PREFIX_URL + '/login';

module.exports = {
    'Login Action Test' : function (test) {
        test.expect(1);

        request.get(actionUrl, function (err, response, body) {
            console.log('\n Action URL: \n' + actionUrl);
            console.log('\n Body:       \n' + JSON.stringify(body, null, 4));
            console.log('\n Error:      \n' + err);
            console.log('\n Response:   \n' + JSON.stringify(response, null, 4));
            body = JSON.parse(body);
            test.ok('payload' in body);
            test.ok(body.payload.indexOf('Es ist ein Fehler beim anmelden passiert.') == -1);
            test.ok(!err);
            test.done();
        });
    }
};