/**
 * Created by Armin on 05.06.2017.
 */
var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/test';

describe("Test Action Test", function () {
    it("tests the Test Action", function () {
        request.get(actionUrl, function (err, response, body) {
            log(response, body, err, actionUrl);
            body = JSON.parse(body);
            assert.isTrue(true);
        });
    });
});