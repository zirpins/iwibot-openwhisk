/**
 * Created by Armin on 05.06.2017.
 */
var request = require('request');
var expect = require('chai').expect;
var assert = require('assert');
var log = require('../../utils/Logger');
var actionUrl = process.env.ACTION_PREFIX_URL + '/semester';
var params = {
    context: {
        semester: 1,
        courseOfStudies: 'INFB'
    }
};

describe("Modulhandbuch Action Test", function () {
   it("empty test", function () {
       expect(true).to.equal(true);
   });
});