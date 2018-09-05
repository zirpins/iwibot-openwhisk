/**
 * Created by Armin on 11.06.2017.
 */
var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/timetable';

var params = {
    semester: 5,
    courseOfStudies: 'INFB'
};

describe("Timetable Action Test", function () {
    it("returns a timetable", function () {
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            log(response, body, err, actionUrl);
            body = JSON.parse(body);

            assert.isTrue('payload' in body);
        });
    });
});