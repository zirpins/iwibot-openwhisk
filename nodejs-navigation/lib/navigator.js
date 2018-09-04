
var fs = require('fs');
var graphImport = require('./graph');
var GraphConstr = graphImport.graphConstr;
var map = {};
var coordinateMap = {}
var iwiNavigator = {};

/** 
 * Liest die Koordinaten aus coordinates.txt und formt sie in ein Object, welches von der Dijkstra-Algorithmus-Implementation
 * in graph.js benutzt werden kann
 */
iwiNavigator.readCoordinateFile = function()	{
    // Liest die Datei
    var allText = fs.readFileSync(__dirname + "/coordinates.txt").toString();
    allText = allText.replace(/\s/g,'');
    	var wayPoints = allText.split(';');
        if(wayPoints.length > 0 && wayPoints[wayPoints.length-1] === '')	{
		wayPoints.splice(wayPoints.length - 1, 1);
	}
	// Liest die Coordinaten und Vebindungen zwischen den Wegpunkten
	for(var i=0; i<wayPoints.length; i++)	{
		var point = wayPoints[i].split(':');
		map[point[1]] = {};
		var coordinates = point[0].split(',');
		coordinateMap[point[1]] = {
			latitude: coordinates[0], 
			longitude: coordinates[1]
		};
		var neighbours = point[2].split(',');
		for(var j = 0; j < neighbours.length; j++)	{
			map[point[1]][neighbours[j]] = -1;
		}
	}
	// Bestimmt die Entfernungen zwischen den verschiedenen Wegpunkten
	for(point in map)	{
		var neighbours = Object.keys(map[point]);
		for(var i=0; i < neighbours.length; i++)	{
			if(map[point][neighbours[i]] === -1 || map[neighbours[i]][point] === -1)	{
				var distance = iwiNavigator.getDistance(coordinateMap[point], coordinateMap[neighbours[i]]);
				map[point][neighbours[i]] = distance;
				map[neighbours[i]][point] = distance;
			}
		}
	}
	// Baut das Object fuer den Dijkstra
	graph = new GraphConstr(map);
}

// Bestimmt Distanz ziwschen 2 Wegpunkten
iwiNavigator.getDistance = function(p1,p2){
	return Math.sqrt(Math.pow(p1.longitude - p2.longitude,2) + Math.pow(p1.latitude - p2.latitude,2));
}

// Bestimmt den (nach Luftlinie) naechstgelegen Wegpunkt zu einem Coordinatenpaar.
iwiNavigator.getNearestWaypoint = function(position)	{
	var smallestDistance = null;
	var nearestWaypoint = null;
	for(point in map)	{
		var distance = iwiNavigator.getDistance(coordinateMap[point], position);
		if(smallestDistance === null || distance < smallestDistance)	{
			smallestDistance = distance;
			nearestWaypoint = point;
		}			
	}
	return nearestWaypoint;
}

//latitude = X; longitude = Y
/**
 * Methode zur Bestimmung des Abbiegewinkels aus drei Punkten c0,c1 und c2. Der berechnete Winkel gibt an um wie viel Grad der
 * neue Weg c1->c2 vom bisherigen Weg c0->c1 abweicht. Beispiel: Der Algorithmus berechnet 10Grad. Das bedeutet dann das der Navigierte,
  der aus Richtung c0 kommt, am Punkt c1 um 10 Grad nach rechts/lnks laufen muss um in Richtung von c2 zu laufen.
  Aus dem Winkel wird zudem berechnet, ob derjenige nun geradeaus, nach links oder nach rechts laufen muss.
 */
iwiNavigator.getDirectionOrder = function(c0, c1, c2)	{
	K//Koeffizienten fuer die Geraden c0_c1 und c1_c2
	var a1 = ((c1.longitude-c0.longitude)/(c1.latitude-c0.latitude)),
		b1 = (c0.longitude-(a1*c0.latitude)),
		a2 = ((c2.longitude-c1.longitude)/(c2.latitude-c1.latitude)),
		b2 = (c1.longitude-(a2*c1.latitude));
	
	// Hilfsfunktion um das x des Schnittpunktes zweier Funktionen mit den Koeffizienten a&b und b&c zu berechnen. 
	var crossing = function(a,b,c,d)	{
		return (d-b)/(a-c);
	}
	
	// Hilfsfunktion zur Abstandsberechnung zwischen zwei Punkten.
	var distance = function(p1,p2)	{
		return Math.sqrt((p2.latitude-p1.latitude)*(p2.latitude-p1.latitude)+(p2.longitude-p1.longitude)*(p2.longitude-p1.longitude));
	}
	
	var graphC0_C1 = function(x)	{
		return a1*x+b1;
	}
	var graphC1_C2 = function(x)	{
		return a2*x+b2
	}
	
	// Koefizienten der Normalen-Geraden von c0_c1. Schneidet c0_c1 garantiert an einem hoeheren x-Wert als es c1_c2 tut. 
	var	aN = -(1/a1),
		bN = c1.longitude - (c1.latitude*aN)+((Math.sign(a1)));
	
	var graphNormal = function(x)	{
		return aN*x+bN;
	}
	
	
	// Berechnet den Schnittpunkt der Normalen-Geraden mit c0_c1.
	var result1 = crossing(a1,b1,aN,bN);
	var cN1 = {
		latitude: result1,
		longitude: graphC0_C1(result1)
	};
	
	// Berechnet den Schnittpunkt der Normalen-Geraden mit c1_c2.
	var result2 = crossing(a2,b2,aN,bN);
	var cN2	= {
		latitude: result2,
		longitude: graphC1_C2(result2)
	};
	
	/*Berechnet ein gleichschenkliges Dreieck aus c0_c1, c1_c2 und Normalen mit den Ecken c1, cN1 und cN2. 
	  Berechnet den Winkel an c1 (= der Endergebniswinkel).*/
	var hypothenuse = distance(c1,cN2),
		nebenKatete = distance(c1,cN1),
		gegenKatete = distance(cN1,cN2);
		degree = Math.asin(gegenKatete/hypothenuse) * 180/Math.PI;

	var c0_c1_y = graphC0_C1(cN1.latitude),
	    c1_c2_y = graphC1_C2(cN1.latitude);
	
	/* Fallunterscheidung ob der Weg nach links, rechts oder geradeaus geht. Momentan wird wird links/rechts ausgegeben
	wenn der Winkel mehr als 10 Grad ist.*/
	if(degree > 10 && c0_c1_y > c1_c2_y)	{
		return 'Bitte rechts abbiegen'; 
	}
	else if(degree > 10 && c0_c1_y < c1_c2_y)	{
		return 'Bitte links abbiegen';
	}
	else{
		return 'Bitte geradeaus weiterlaufen';
	}
};

/** 
 * Berechnet aus einem Start-Koordinatenpaar (muss kein Wegpunkt aus coordinates.txt sein) und einem Zielwegpunkt (muss ein Wegpunkt 
 * aus coordinates.txt sein; target=name des Wegpunkts als String) den kuerzesten Pfad nach Dijkstra. Ubernimmt auch notwendige vorberechnung
 (=momentan: naechsten Wegpunkt zu Startkoordinaten berechnen & Graph aufbauen).
*/
iwiNavigator.getNavigationPath = function(coords, target)	{
	// Lese coordinates.txt ein und erstelle Graph-Object
	iwiNavigator.readCoordinateFile();
	// Nachsten Wegpunkt zu Startkoordinaten finden und Dijkstra durchfuehren
	var path = graph.findShortestPath(iwiNavigator.getNearestWaypoint(coords), target);
	var returner = [];
	// Parse das Ergebnis zu [{wegpunktNr im Pfad, Wegpunkt-Name, latitude, longitude},...]
	for(var i=0; i<path.length; i++)	{
		returner.push({
			latitude: coordinateMap[path[i]].latitude,
			longitude: coordinateMap[path[i]].longitude,
			name: path[i]
		});
	}
	return returner;
}

exports.iwiNavigator = iwiNavigator;
