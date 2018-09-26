/**
 * Created by Armin on 05.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/semester';
let params = {
    context: {
        semester: 1,
        courseOfStudies: 'INFB'
    }
};

describe("Semester Action Test", function () {
    it("returns the semester plan", function () {
        request.post({
            headers: {'content-type': 'application/json'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {

            let result = response.statusCode == 204 || response.statusCode == 200;
            assert.isTrue(result);
        });
    });
});