/**
 * Created by Stefan.
 */
var request = require('request');
var actionUrl = process.env.ACTION_PREFIX_URL + '/navigation';

module.exports = {
    'Navigation Action Test' : function (test) {
        test.expect(1);
        test.ok(true);
        test.done();
    }
};
