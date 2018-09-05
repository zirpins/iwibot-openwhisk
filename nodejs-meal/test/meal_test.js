/**
 * Created by Armin on 05.06.2017.
 */
var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/meal';

describe("Meal Action Test", function () {
    it("returns a meal plan or a info message", function () {
        request.get(actionUrl, function (err, response, body) {
            body = JSON.parse(body);
            log(response, body, err, actionUrl);
            assert.isOk(body.htmlText);
        })
    });
});