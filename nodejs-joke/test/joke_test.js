var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/joke';

describe("Joke Action Test", function() {
    it("responds a joke", function () {
        request.get(actionUrl, function (err, response, body) {
            log(response, body, err, actionUrl);
            body = JSON.parse(body);
            expect('payload' in body).to.equal(true);
        });
    })
});