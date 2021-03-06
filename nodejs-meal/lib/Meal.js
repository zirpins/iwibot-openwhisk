var request = require('request');
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
var url = 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/canteen/2/' + yyyy + '-' + mm + '-' + dd;

var LocalDate = require('js-joda').LocalDate;

var d = LocalDate.parse('2012-12-24').atStartOfDay().plusMonths(2);

var entity;

function main(params) {
    console.log("------Meal Action started!------");
    console.log("Meal Action Params:" + JSON.stringify(params, null, 4));

    return new Promise(function (resolve, reject) {

        if ('entities' in params && params.entities.length !== 0) {
            console.log("Entity found in Params");
            entity = params.entities[0].value;
        } else {
            console.log("No Entity in Params!");
            entity = "-1";
        }

        switch (entity) {
            case 'Wahlessen 1':
                entity = 0;
                break;
            case 'Wahlessen 2':
                entity = 1;
                break;
            case 'Aktionstheke':
                entity = 2;
                break;
            case 'Gut und Günstig':
                entity = 3;
                break;
            case 'Buffet':
                entity = 4;
                break;
            case 'Schnitzelbar':
                entity = 5;
                break;
        }

        request({
            url: url
        }, function (error, response, body) {

            var resultObject = {};

            if (!error && response.statusCode === 200) {
                var meals = JSON.parse(body);

                console.log("Mensa" + meals.mealGroups);

                if (meals.mealGroups.length === 0 || meals.mealGroups.length === undefined ||
                    meals.mealGroups[entity] === undefined || meals.mealGroups[entity].meals.length === 0 ||
                    meals.mealGroups[entity].meals.length === undefined) {

                    resultObject.payload = "In der Mensa gibt es heute nichts zu essen, vielleicht sind Ferien?" + d;

                    resolve(resultObject);
                } else {

                    var mealsLength = meals.mealGroups[entity].meals.length;
                    var mealsArray = meals.mealGroups[entity].meals;
                    var ulStart = '<ul>';

                    for (var i = 0; mealsLength > i; i++) {
                        ulStart += '<li>' + mealsArray[i].name + '</li>';
                    }

                    ulStart += '</ul>';
                    resultObject.payload = meals.mealGroups[entity].title + ' hat heute folgendes im Angebot:' + d;
                    resultObject.htmlText = ulStart;

                    resolve(resultObject);
                }
            } else {
                console.log('http status code:', (response || {}).statusCode);
                console.log('error:', error);
                console.log('body:', body);
                resultObject.payload = error.toString();

                reject(error.toString());
            }
        });
    });
}

exports.main = main;