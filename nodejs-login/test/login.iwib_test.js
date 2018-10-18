/**
 * Created by Armin on 05.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/login';

describe("Login Action Test", function () {
   it("can login", function () {
       request.get(actionUrl, function (err, response, body) {
           body = JSON.parse(body);

           assert.isTrue('payload' in body);
           assert.isTrue(body.payload.indexOf('Es ist ein Fehler beim anmelden passiert.') === -1);
       });
   }) ;
});