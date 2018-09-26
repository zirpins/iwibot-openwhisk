/**
 * Created by Armin on 26.08.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/weather';

let params = {
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

            assert.isTrue('payload' in body);
            assert.isTrue('htmlText' in body);
        });
    });
});