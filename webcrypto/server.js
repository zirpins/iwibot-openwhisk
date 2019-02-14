const express = require("express"),
    http = require("http"),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    crypto = require('crypto');

let app = express();
let server = http.createServer(app);
server.listen(3000);
console.log("Web crypto server started on port 3000");

app.use(express.static(path.join(__dirname, 'client')));
app.use(logger('dev'));
app.use(bodyParser.json());

const algorithm = 'aes-256-cbc';

function decrypt(msg) {
    // get iv and ciphertext from msg
    const iv = Buffer.from(msg.iv, 'hex');
    const encrypted = Buffer.from(msg.encrypted, 'hex');

    // you get this key string from the key service
    let keystring = 'b26301cc95648636104ed5c40cd083ec0b507434a809b6186d882f9f3665baa5';
    // use it to create a buffer
    let key = Buffer.from(keystring, 'hex');

    msg.decrypted = {};

    // do decrypt
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    console.log("Decrypted " + msg.encrypted + " to " + decrypted);
    return decrypted;
}

app.post("/requests", function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    res.json(decrypt(req.body));
});