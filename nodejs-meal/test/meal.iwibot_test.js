/**
 * Created by Armin on 05.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/meal';

describe("Meal Action Test", function () {
    it("returns a meal plan or a info message", function () {
        request.get(actionUrl, function (err, response, body) {
            body = JSON.parse(body);

            assert.isOk(body.htmlText);
        })
    });
});