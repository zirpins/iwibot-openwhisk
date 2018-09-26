module.exports = function (response, body, error, actionUrl) {
    console.log('\n Action URL: \n' + actionUrl);
    console.log('\n Body:       \n' + JSON.stringify(body, null, 4));
    console.log('\n Error:      \n' + error);
    console.log('\n Response:   \n' + JSON.stringify(response, null, 4));
};