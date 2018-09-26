let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/bescheinigung';

describe("Beschinigung Action Test", function() {
    it("responds a certificate", function() {
        request.get(actionUrl, function (err, response, body) {
            body = JSON.parse(body);
            expect(body).contains("payload");
        });
    })
});