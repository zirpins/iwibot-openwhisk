/**
 * Created by Armin on 05.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let actionUrl = process.env.ACTION_PREFIX_URL + '/wikipedia';

describe("Wikipedia Action Test", function () {
    it("returns a description", function (done) {
        request.post({
            headers: {
                'content-type': 'text/plain'
            },
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            assert(body.payload);
            assert(body.htmlText);
            done();
        });
    });
});