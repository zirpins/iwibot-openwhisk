const express = require("express"),
    http = require("http"),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    request_promise = require('request-promise');

let app = express();
let server = http.createServer(app);
server.listen(3000);
console.log("Web crypto server started on port 3000");

app.use(express.static(path.join(__dirname, 'client')));
app.use(logger('dev'));
app.use(bodyParser.json());

const algorithm = 'aes-256-cbc';

function decrypt(msg, keystring) {
    // get iv and ciphertext from msg
    const iv = Buffer.from(msg.iv, 'hex');
    const encrypted = Buffer.from(msg.encrypted, 'hex');
    // use keystring to create a buffer
    const key = Buffer.from(keystring, 'hex');

    msg.decrypted = {};

    // do decrypt
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    console.log("Decrypted " + msg.encrypted + " to " + decrypted + " using key " + keystring);
    return decrypted;
}

app.post("/requests", function (req, res) {
    if (!req.body)
        return res.sendStatus(400);

    console.log("Serving call with sid=" + req.body.sid);

    request_promise({
            // you get this key string from the key service
            uri: "https://us-south.functions.cloud.ibm.com/api/v1/web/IWIbot_dev/IWIBot/Keys.json?sid=" + req.body.sid,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        })
        .then(rsp => res.json(decrypt(req.body, rsp.payload.crypto_key)))
        .catch(err => console.log(err));
});