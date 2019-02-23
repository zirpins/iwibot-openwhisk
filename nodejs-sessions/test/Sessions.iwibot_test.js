let request = require('request');
let expect = require('chai').expect;
const actionUrl = process.env.ACTION_PREFIX_URL + '/sessions';

describe("Testing 'Sessions' action", function () {
    let session_identifier;
    let session_context;

    it("stores a novel session context and provides a session identifier",
        (done) => {
            request.post({
                    url: actionUrl,
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        session_context: {
                            foo: "bar"
                        }
                    })
                },
                function (err, response, body) {
                    result = JSON.parse(body);

                    expect(result).to.have.property("payload");
                    expect(result.payload).to.be.an("object");
                    expect(result.payload).to.have.property("sid");
                    expect(result.payload.sid).to.be.a("string");
                    session_identifier = result.payload.sid;

                    expect(result.payload).to.have.property("session_context");
                    expect(result.payload.session_context).to.be.an("object");
                    session_context = result.payload.session_context;

                    expect(result.payload.session_context).to.have.property("foo");
                    expect(result.payload.session_context.foo).to.be.a("string");
                    expect(result.payload.session_context.foo).to.equal("bar");
    
                    done();
                });
        });
});