/**
 * Created by Armin on 26.08.2017.
 */
var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/weather';

var params = {
    semester: 5,
    courseOfStudies: 'INFB'
};

describe("Weather Action Test", function () {
    it("returns the weather forecast for Karlsruhe", function () {
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            log(response, body, err, actionUrl);
            assert.isTrue('payload' in body);
            assert.isTrue('htmlText' in body);
        });
    });
});