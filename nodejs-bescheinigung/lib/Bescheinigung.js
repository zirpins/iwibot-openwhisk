var request = require('request');

function main(params) {
    var pdfUrl = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/certificate/cache/";
    var url = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/certificates/links";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
        request({
                url: url,
                headers: {
                    'Authorization': 'Basic ' + params.context.iwibotCreds
                }
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    var bodyObject = JSON.parse(body);
                    bodyObject.forEach(function (element) {
                        if (element.certificateType === params.entities[0].value.toLowerCase()) {
                            pdfUrl += element.linkHashCode;
                        }
                    });

                    responseObject.payload = "Hier ist deine Bescheinigung:";
                    responseObject.htmlText = "<a href='" + pdfUrl + "' target='_blank'>" +
                                              convertCertificateTypeToDisplayName(params.entities[0].value) + "</a>";
                    responseObject.language = language;

                    resolve(responseObject);
                } else {
                    console.log('http status code:', (response || {}).statusCode);
                    var payload = "Es ist ein unerwarteter Fehler aufgetreten.";
                    switch (response.statusCode) {
                        case 500:
                            payload = "Der QIS-Server ist zurzeit offline.";
                            break;
                        case 401:
                            payload = "Um deine Bescheinigung zu erhalten, musst du dich einloggen.";
                            break;
                    }
                    console.log('error:', error);
                    console.log('body:', body);
                    responseObject.payload = payload;

                    resolve(responseObject);
                }
            });
    });
}
function convertCertificateTypeToDisplayName(type) {
    switch(type) {
        case 'DATA_CONTROL_SHEET':
            return 'Datenkontrollblatt';
        case 'CERTIFICATE_OF_MATRICULATION':
            return 'Immatrikulationsbescheinigung (deutsch)';
        case 'CERTIFICATE_OF_MATRICULATION_ENGLISH' :
            return 'Immatrikulationsbescheinigung (englisch)';
        case 'BAFOEG':
            return 'BAFÖG-Bescheinigung';
        case 'KVV':
            return 'KVV-Bescheinigung';
        case 'DURATION_OF_STUDY':
            return 'Studienzeitbescheinigung';
        case 'IZ_ACCESS':
            return 'Initiale IZ-Zugangsdaten';
    }

}
exports.main = main;