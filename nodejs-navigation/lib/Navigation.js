var request = require('request');
var navi = require('./navigator');

var navigationResponse = {};
var voice = "en-US_MichaelVoice";
var entity;

function main(params) {
    console.log("------Navigation Action started!------");
    console.log("Navigation Params:" + JSON.stringify(params));

    return new Promise(function (resolve, reject) {

	   // Ueberprueft auf notwendige Parameter
        if ('entities' in params && params.entities.length !== 0) {
            console.log("Entity found in Params");
            entity = params.entities[0].value;
        } else {
            console.log("No Entity in Params!");
            entity = "-1";
        }

	// Sucht fuer die Rueckgabe des Communications-Service den passenden Namen im Dijkstra    
        switch (entity) {
            case '1':	//aula
                entity = 'zum_Haupteingang_vom_A_Gebaeude';
                break;
	        case '2':	//building E
                entity = 'zum_Haupteingang_vom_E_Gebaeude';
                break;
            case '3':	//building F
                entity = 'zum_Haupteingang_vom_F_Gebaeude';
                break;
            case '4':	//building LI
                entity = 'zur_Schranke_beim_Parkplatz_vor_Gebaeude_LI';
                break;
            case '5':	//building M
                entity = 'zum_Haupteingang_vom_M_Gebaeude';
                break;
            case '6':	//building P
                entity = 'zum_Haupteingang_vom_P_Gebaeude';
                break;
            case '7':	//building R
                entity = 'zum_Haupteingang_vom_R_Gebaeude';
                break;
	        case '8':	//cafeteria
                entity = 'die_Treppe_runter_zur_Cafeteria';
                break;
            case '9':	//main entrance
                entity = 'zum_Haupteingang_der_Hochschule';
                break;
	        case '10':	//Mensa
                entity = 'zur_Mensa_Moltke';
                break;
       }
	
	// Berechne Navigation
	var result = navi.iwiNavigator.getNavigationPath(params.position, entity);
		
	// Ergebis-Array zu String umwandeln
	var parsedResult = JSON.stringify({"waypoints": result, "navigationDestination": entity});
	/*for(var i=0; i<result.length; i++)	{
		parsedResult = parsedResult + 'step:' + (i+1) + ',name:' + result[i].name + ',longitude:' + result[i].longitude  + ',latitude:' + result[i].latitude + ';';
	}*/
	
	var navigationResponse = {};    
        // Setzen des Ergebnis als payload, damit es im Chat ausgegeben wird. Wenn das Ergebnis in eine andere Variable als payload
	// geschrieben wird wird sie ebenfalls ans Frontend mitzurueckgegeben, aber nicht im Chat ausgegeben (Der Chat gibt nach aktueller
	// Implmenetierung immer den String aus der in payload steht).
	navigationResponse.payload = "Navigation " + entity.replace(/_/g,' ') + " gestartet!";
	navigationResponse.navigationData = parsedResult;
	navigationResponse.voice = voice;
	resolve(navigationResponse);
	});
} 

exports.main = main;
