var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/bescheinigung';

describe("Beschinigung Action Test", function() {
    it("responds a certificate", function() {
        request.get(actionUrl, function (err, response, body) {
            log(response, body, err, actionUrl);
            body = JSON.parse(body);
            expect(body).contains("payload");
        });
    })
});