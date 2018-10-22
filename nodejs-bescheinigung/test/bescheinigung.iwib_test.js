let request = require('request');
let expect = require('chai').expect;
let assert = require('chai').assert;
let promisify = require('bluebird').promisify;
let actionUrl = process.env.ACTION_PREFIX_URL + '/bescheinigung';

describe("Beschinigung Action Test", function() {
    it("responds a certificate", (done) => {
        request.post(actionUrl, function (err, response, body) {
            assert.isOk(JSON.parse(body).payload, 'no payload')
            assert.isOk(JSON.parse(body).htmlText, 'no link')
            done()
        })
    })
});