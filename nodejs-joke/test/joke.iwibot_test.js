const request = require('request');
let expect = require('chai').expect;
let actionUrl = process.env.ACTION_PREFIX_URL + '/joke';

describe("Testing Joke action", function () {
    it("responds with a joke in a specified language (not tested if funny)", (done) => {
        request.post(actionUrl, function (err, response, body) {
            result = JSON.parse(body);
            expect(result).to.have.property("payload");
            expect(result).to.have.property("language");
            done();
        });
    });
});
