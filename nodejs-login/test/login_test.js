/**
 * Created by Armin on 05.06.2017.
 */
var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/login';

describe("Login Action Test", function () {
   it("can login", function () {
       request.get(actionUrl, function (err, response, body) {
           body = JSON.parse(body);
           log(response, body, err, actionUrl);
           assert.isTrue('payload' in body);
           assert.isTrue(body.payload.indexOf('Es ist ein Fehler beim anmelden passiert.') == -1);
       });
   }) ;
});