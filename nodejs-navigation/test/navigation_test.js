/**
 * Created by Stefan.
 */
var request = require('request');
var actionUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/'+process.env.WSK_API_CODE+'/iwibotTest/navigation';

module.exports = {
    'Navigation Action Test' : function (test) {
        test.expect(1);
        test.ok(true);
        test.done();
    }
};
