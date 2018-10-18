/**
 * Created by Armin on 05.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('chai').assert;
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/semester';
let params = {
    context: {
        semester: 1,
        courseOfStudies: "INFB"
    }
};

describe("Semester Action Test", function () {
    it("returns the semester plan", (done) => {
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            assert.isOk(JSON.parse(body).payload, 'no payload');
            assert.isOk(JSON.parse(body).htmlText, 'no htmlText');
            done()
        });
    })
});