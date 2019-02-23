let request = require('request');
let expect = require('chai').expect;
const actionUrl = process.env.ACTION_PREFIX_URL + '/keys';

describe("Testing 'Keys' action", function () {
    let session_identifier;
    let crypto_key;

    it("returns a novel session identifier and an aes crypto key on first call",
        (done) => {
            request.post(actionUrl, function (err, response, body) {
                result = JSON.parse(body);

                expect(result.payload).to.be.an("object");
                expect(result.payload.sid).to.be.a("string");
                session_identifier = result.payload.sid;

                expect(result.payload.crypto_key).to.be.a("string");
                crypto_key = result.payload.crypto_key;

                done();
            });
        });

    it("returns the same aes crypto key for successive calls based on the session identifier",
        (done) => {
            request.post({
                    url: actionUrl,
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sid: session_identifier
                    })
                },
                function (err, response, body) {
                    result = JSON.parse(body);

                    expect(result.payload.sid).to.equal(session_identifier, "Session identifier has changed");
                    expect(result.payload.crypto_key).to.equal(crypto_key, "AES Key has changed");

                    done();
                });
        });
});