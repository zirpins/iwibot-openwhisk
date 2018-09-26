let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/joke';

describe("Joke Action Test", function() {
    it("responds a joke", function () {
        request.get(actionUrl, function (err, response, body) {

            body = JSON.parse(body);
            expect('payload' in body).to.equal(true);
        });
    })
});