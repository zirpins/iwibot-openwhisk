/**
 * Created by Armin on 05.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/semester';
let params = {
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