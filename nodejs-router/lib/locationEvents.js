/*This is a dummy class to be expanded to an action that has database
access and can check whether the location provided triggers any events.
For now, only a sample response and an array as database mockup is implemented.
This is only to show how location based events could be implemented using the
locationEventHandler in the frontend. */

function getEventsForPosition(position) {
    console.log("Check for Position " + position);
    var eventsFound = [];
    
    for (var i = 0; i < eventDatabase.length; i++) {
        //About 7m in each direction
        if (checkIfInRange(position.latitude, parseFloat(eventDatabase[i].latitude) - 0.0001, parseFloat(eventDatabase[i].latitude) + 0.0001) &&
         (checkIfInRange(position.longitude, parseFloat(eventDatabase[i].longitude) - 0.0001, parseFloat(eventDatabase[i].longitude) + 0.0001))) {
             eventsFound.push(eventDatabase[i]);
         }
    }
    var responseObject = {events: eventsFound, numberOfEventsFound: eventsFound.length}

    return new Promise(function (resolve) {
        console.log("ResponseObject " + JSON.stringify(responseObject));
        resolve(responseObject);
    });

}

var eventDatabase = [
    {id: 0, name: "Glühweinverkauf!", description: "Heute findet ein Glühweinverkauf vor dem Gebäude E statt!", latitude: 49.015032, longitude: 8.390393},
    {id: 0, name: "Firmenkontaktmesse", description: "Die Firmenkontaktmesse findet heute in der Aula statt!", latitude: 49.015538, longitude: 8.391474}
]

//Hilfsfunktion. Berechnet, ob sich eine Zahl zwischen zwei anderen Zahlen befindet
function checkIfInRange(number, range1, range2) {
    var min = Math.min.apply(Math, [range1, range2]);
    var max = Math.max.apply(Math, [range1, range2]);
  return (number > min) && (number < max);
  };

  exports.getEventsForPosition = getEventsForPosition;