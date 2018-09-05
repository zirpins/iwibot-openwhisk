/**
 * Created by Armin on 05.06.2017.
 */
var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/semester';
var params = {
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
            log(response, body, err, actionUrl);
            var result = response.statusCode == 204 || response.statusCode == 200;
            assert.isTrue(result);
        });
    });
});