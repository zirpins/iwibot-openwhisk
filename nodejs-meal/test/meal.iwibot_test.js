/**
 * Created by Armin on 05.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('chai').assert;
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/meal';

describe("Meal Action Test", function () {
    it("returns a meal plan or a info message", (done) => {
        request.post(actionUrl, function (err, response, body) {
            assert.isOk(JSON.parse(body).payload, 'no payload');
            done()
        });
    })
});