/**
 * Create a document in Cloudant database:
 * https://docs.cloudant.com/document.html#documentCreate
 **/

exports.createDocument = function (message) {

    var cloudantOrError = getCloudantAccount(message);
    if (typeof cloudantOrError !== 'object') {
        return Promise.reject(cloudantOrError);
    }
    var cloudant = cloudantOrError;

    var dbName = message.dbname;
    var doc = message.doc;
    var params = {};

    if (!dbName) {
        return Promise.reject('dbname is required.');
    }
    if (!doc) {
        return Promise.reject('doc is required.');
    }

    if (typeof message.doc === 'object') {
        doc = message.doc;
    } else if (typeof message.doc === 'string') {
        try {
            doc = JSON.parse(message.doc);
        } catch (e) {
            return Promise.reject('doc field cannot be parsed. Ensure it is valid JSON.');
        }
    } else {
        return Promise.reject('doc field is ' + (typeof doc) + ' and should be an object or a JSON string.');
    }
    var cloudantDb = cloudant.use(dbName);

    if (typeof message.params === 'object') {
        params = message.params;
    } else if (typeof message.params === 'string') {
        try {
            params = JSON.parse(message.params);
        } catch (e) {
            return Promise.reject('params field cannot be parsed. Ensure it is valid JSON.');
        }
    }

    return insert(cloudantDb, doc, params);
}

/**
 * Create document in database.
 */
function insert(cloudantDb, doc, params) {
    return new Promise(function (resolve, reject) {
        cloudantDb.insert(doc, params, function (error, response) {
            if (!error) {
                console.log("success", response);
                resolve(response);
            } else {
                console.log("error", error);
                reject(error);
            }
        });
    });
}


/**
 * Query using a Cloudant Query index:
 * https://docs.cloudant.com/cloudant_query.html#finding-documents-using-an-index
 **/

exports.execQueryFind = function (params) {

    var cloudantOrError = getCloudantAccount(params);
    if (typeof cloudantOrError !== 'object') {
        return Promise.reject(cloudantOrError);
    }
    var cloudant = cloudantOrError;

    var dbName = params.dbname;
    var query = params.query;

    if (!dbName) {
        return Promise.reject('dbname is required.');
    }
    if (!query) {
        return Promise.reject('query field is required.');
    }
    var cloudantDb = cloudant.use(dbName);

    if (typeof params.query === 'object') {
        query = params.query;
    } else if (typeof params.query === 'string') {
        try {
            query = JSON.parse(params.query);
        } catch (e) {
            return Promise.reject('query field cannot be parsed. Ensure it is valid JSON.');
        }
    } else {
        return Promise.reject('query field is ' + (typeof query) + ' and should be an object or a JSON string.');
    }

    return queryIndex(cloudantDb, query);

}

function queryIndex(cloudantDb, query) {
    return new Promise(function (resolve, reject) {
        cloudantDb.find(query, function (error, response) {
            if (!error) {
                console.log('success', response);
                resolve(response);
            } else {
                console.log('error', error);
                reject(error);
            }
        });
    });
}


/**
 * Update a document in Cloudant database:
 * https://docs.cloudant.com/document.html#update
 **/

exports.updateDocument = function(message) {

    var cloudantOrError = getCloudantAccount(message);
    if (typeof cloudantOrError !== 'object') {
        return Promise.reject(cloudantOrError);
    }
    var cloudant = cloudantOrError;

    var dbName = message.dbname;
    var doc = message.doc;
    var params = {};

    if (!dbName) {
        return Promise.reject('dbname is required.');
    }

    if (typeof message.doc === 'object') {
        doc = message.doc;
    } else if (typeof message.doc === 'string') {
        try {
            doc = JSON.parse(message.doc);
        } catch (e) {
            return Promise.reject('doc field cannot be parsed. Ensure it is valid JSON.');
        }
    } else {
        return Promise.reject('doc field is ' + (typeof doc) + ' and should be an object or a JSON string.');
    }
    if (!doc || !doc.hasOwnProperty("_rev")) {
        return Promise.reject('doc and doc._rev are required.');
    }
    var cloudantDb = cloudant.use(dbName);

    if (typeof message.params === 'object') {
        params = message.params;
    } else if (typeof message.params === 'string') {
        try {
            params = JSON.parse(message.params);
        } catch (e) {
            return Promise.reject('params field cannot be parsed. Ensure it is valid JSON.');
        }
    }

    return insert(cloudantDb, doc, params);
}

/**
 * Inserts updated document into database.
 */
function insert(cloudantDb, doc, params) {
    return new Promise(function (resolve, reject) {
        cloudantDb.insert(doc, params, function (error, response) {
            if (!error) {
                console.log('success', response);
                resolve(response);
            } else {
                console.log('error', error);
                reject(error);
            }
        });
    });
}


function getCloudantAccount(params) {

    var Cloudant = require('@cloudant/cloudant');
    var cloudant;

    if (!params.iamApiKey && params.url) {
        cloudant = Cloudant(params.url);
    } else {
        checkForBXCreds(params);

        if (!params.host) {
            return 'Cloudant account host is required.';
        }

        if (!params.iamApiKey) {
            if (!params.username || !params.password) {
                return 'You must specify parameter/s of iamApiKey or username/password';
            }
        }

        var protocol = params.protocol || 'https';
        if (params.iamApiKey) {
            var dbURL = `${protocol}://${params.host}`;
            if (params.port) {
                dbURL += ':' + params.port;
            }
            cloudant = new Cloudant({
                url: dbURL,
                plugins: {
                    iamauth: {
                        iamApiKey: params.iamApiKey,
                        iamTokenUrl: params.iamUrl
                    }
                }
            });
        } else {
            var url = `${protocol}://${params.username}:${params.password}@${params.host}`;
            if (params.port) {
                url += ':' + params.port;
            }
            cloudant = Cloudant(url);
        }
    }
    return cloudant;
}

function checkForBXCreds(params) {

    if (params.__bx_creds && (params.__bx_creds.cloudantnosqldb || params.__bx_creds.cloudantNoSQLDB)) {
        var cloudantCreds = params.__bx_creds.cloudantnosqldb || params.__bx_creds.cloudantNoSQLDB;

        if (!params.host) {
            params.host = cloudantCreds.host || (cloudantCreds.username + '.cloudant.com');
        }
        if (!params.iamApiKey && !cloudantCreds.apikey) {
            if (!params.username) {
                params.username = cloudantCreds.username;
            }
            if (!params.password) {
                params.password = cloudantCreds.password;
            }
        } else if (!params.iamApiKey) {
            params.iamApiKey = cloudantCreds.apikey;
        }
    }

}