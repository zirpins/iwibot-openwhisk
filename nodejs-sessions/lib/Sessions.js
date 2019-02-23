const request = require('request'),
    crypto = require('crypto'),
    openwhisk = require('openwhisk');

const QUERY_ACTION = "/IWIbot_dev/my-cloudant-package/exec-query-find";
const UPDATE_ACTION = "/IWIbot_dev/my-cloudant-package/update-document";
const CREATE_ACTION = "/IWIbot_dev/my-cloudant-package/create-document";

const SESSION_DB = "iwibot_sessions";

// returns a promise for a session document
function retrieve_or_create_session(params) {

    const SESSION_LIFETIME = 60 * 10; // 10 minutes

    // Create new session doc with 128 bit session id
    let _session_tmplt = function () {
        timestamp = Math.floor(new Date() / 1000); // unix time 
        return {
            sid: crypto.randomBytes(16).toString('hex'),
            created_h: new Date(),
            created_u: timestamp,
            expires_u: timestamp + SESSION_LIFETIME,            
            session_context: {}
        };
    };

    // Openwhisk invocation spec
    let call = {
        name: QUERY_ACTION,
        blocking: true,
        result: true,
        params: {
            "dbname": SESSION_DB,
            "query": {
                "selector": {
                    "sid": params.sid
                }
            }
        }
    };

    if (typeof params.sid !== "undefined") {
        // Retrieve session_context
        return openwhisk().actions.invoke(call)
            .then(function (msg) {
                // if session still exists in db
                if (msg.docs.length > 0) {
                    now = Math.floor(new Date() / 1000);
                    // if session is not expired
                    if (msg.docs[0].expires_u > now) {
                        return msg.docs[0];
                    }
                }
                // else crete new session
                return _session_tmplt();
            });
    } else { // No sid was provided
        return new Promise((resolve, reject) =>
            resolve(_session_tmplt()));
    }
}

// Returns updated session document
function write_or_update_session(session_doc, params) {

    // Store session_doc if it has no revision (it is new) 
    // or if params contain a session_context (to be persisted).
    if (typeof session_doc._rev === "undefined" ||
        typeof params.session_context !== "undefined") {

        // Iterate all members of provided session context and 
        // merge it into the exiting session document.
        for (var key in params.session_context) {
            if (params.session_context.hasOwnProperty(key)) {
                console.log("Setting " + key + " -> " + params.session_context[key]);
                session_doc.session_context[key] = params.session_context[key];
            }
        }

        // Preselect create action ...
        let _action = CREATE_ACTION;
        // ... or change to update if session doc already exists
        if (typeof session_doc._rev !== "undefined") {
            _action = UPDATE_ACTION;
        }

        console.log("Persisting session id " +
            session_doc.sid + " with extended context " +
            JSON.stringify(session_doc.session_context) +
            " using " + _action);

        // Openwhisk invocation spec
        let call = {
            name: _action,
            blocking: true,
            result: true,
            params: {
                "dbname": SESSION_DB,
                "doc": session_doc
            }
        };

        return openwhisk().actions.invoke(call)
            .then(function (msg) {
                console.log("Cloudant update response:" + JSON.stringify(msg));
                return new Promise(function (res, rej) {
                    res(session_doc);
                });
            })
            .catch(function (err) {
                console.error("Cloudant error:" + err);
                return new Promise(function (res, rej) {
                    rej(err);
                });
            });

    } else {
        return new Promise(function (res, rej) {
            res(session_doc);
        });
    }
}

function main(params) {
    if ("__ow_body" in params) { // Für das Testen erforderlich..
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    console.log("------Sessions Action started!------");
    console.log("Sessions Action Params:" + JSON.stringify(params, null, 4));

    return new Promise(function (resolve, reject) {
        retrieve_or_create_session(params)
            .then(function (session_doc) {
                console.log("Fetched session id " +
                    session_doc.sid + " with current context " +
                    JSON.stringify(session_doc.session_context));
                return write_or_update_session(session_doc, params);
            }).then(function (session_doc) {
                resolve({
                    "payload": session_doc
                });
            }).catch(function (err) {
                console.error(err);
                reject({
                    "error": err
                });
            });
    });
}

exports.main = main;