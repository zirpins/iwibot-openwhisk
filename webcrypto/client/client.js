let cryptoMod = (function () {

    let secret_key = {}; // the AES secret key object

    if (!("TextEncoder" in window))
        alert("Sorry, this browser does not support TextEncoder...");

    let encoder = new TextEncoder(); // always utf-8

    function hex2buf(hex) { // hex is a hex string
        var view = new Uint8Array(hex.length / 2);
        for (var i = 0; i < hex.length; i += 2) {
            view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return view.buffer;
    }

    function buf2hex(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(
            new Uint8Array(buffer),
            x => ('00' + x.toString(16)).slice(-2)
        ).join('');
    }

    function importSecretAesKey(keyData) {
        return window.crypto.subtle.importKey(
            "raw", //can be "jwk" or "raw"
            keyData, // "raw" would be an ArrayBuffer
            { //this is the algorithm options
                name: "AES-CBC",
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
        );
    }

    function encryptPlaintextWithAes(data, aesKey) {
        var ivec = window.crypto.getRandomValues(new Uint8Array(16));
        return window.crypto.subtle.encrypt({
                    name: "AES-CBC",
                    //Don't re-use initialization vectors!
                    //Always generate a new iv every time your encrypt!
                    iv: ivec,
                },
                aesKey, //from generateKey or importKey above
                data //ArrayBuffer of data you want to encrypt
            )
            .then(function (encrypted) {
                return {
                    "iv": buf2hex(ivec),
                    "encrypted": buf2hex(new Uint8Array(encrypted))
                };
            });
    }

    return { // public part of the module

        initCryptoKey: function (keyData) {
            importSecretAesKey(hex2buf(keyData))
                .then(key => secret_key = key)
                .catch(err => console.error(err));
        },

        createEncryptedJsonMessage: function (plaintext) {
            let data = encoder.encode(plaintext);
            return encryptPlaintextWithAes(data, secret_key)
                .then(msg => Promise.resolve(JSON.stringify(msg)))
                .catch(err => console.error(err));
        }
    };
})();

let demoPageMod = (function () {
    return { // public part of the module
        sendCryptoMsg: function () {
            let plaintext = $("#plaintext").val();
            cryptoMod.createEncryptedJsonMessage(plaintext)
                .then(msgJson =>
                    $.ajax({
                        type: "POST",
                        url: "/requests",
                        data: msgJson,
                        contentType: 'application/json; charset=UTF-8',
                        success: msg => $("#answer").text(JSON.stringify(msg, null, '\t'))
                    }))
                .catch(err => console.error(err));
        }
    };
})();

$(function () { // call this function after the page has loaded
    console.log("WebCrypto init");
    // $.get("./secret.aes", cryptoMod.initCryptoKey); // use key from local sever instead of openwhisk action
    $.get(
        "https://us-south.functions.cloud.ibm.com/api/v1/web/IWIbot_dev/IWIBot/Keys.json?sid=",
        (msg) => cryptoMod.initCryptoKey(msg.payload.crypto_key)
    );
    $("#encrypt").on("click", () => demoPageMod.sendCryptoMsg());
});