/**
 * Created by Armin on 11.06.2017.
 */
let request = require('request');
let expect = require('chai').expect;
let assert = require('assert');
let log = require('../../utils/Logger');
let actionUrl = process.env.ACTION_PREFIX_URL + '/timetable';

let params = {
    semester: 5,
    courseOfStudies: 'INFB'
};

describe("Timetable Action Test", function () {
    it("returns a timetable", function () {
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {

            body = JSON.parse(body);

            assert.isTrue('payload' in body);
        });
    });
});