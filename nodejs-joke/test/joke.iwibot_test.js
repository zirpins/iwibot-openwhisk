let request = require('request');
let expect = require('chai').expect;
const { assert } = require('chai');
let log = require('../../utils/Logger');
let { promisify } = require('bluebird')
let actionUrl = process.env.ACTION_PREFIX_URL + '/joke';

describe("Joke Action Test", function() {
    it("responds a joke", (done) => {
        request.post(actionUrl, function (err, response, body) {
            assert.isOk(JSON.parse(body).payload, 'no payload')
            assert.isOk(JSON.parse(body).language, 'no language')
            done()
        })
    })
});