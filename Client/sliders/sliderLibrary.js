  var SVGDocument = null;
  var SVGRoot = null; 

  var DragTarget = null;
  var Left;
  var Right;
  var TLeft;
  var TRight;
  var Centre;
  var OldBound;
  var NowBound;
  var BackDrop;
  var FirstQuart;
  var FirstLabel;  
  var ThirdQuart;
  var ThirdLabel;
  var Line;
  var AdjustButton;
  
  var lowBound;
  var highBound;
  var pixDistance;
  var scale;
  var ratio;
  var time;
  var q1;
  var q3;
  var midPoint;
  
  var leftVal = 440;	// pixel location
  var rightVal = 830;

  var leftie = 330;	// original "time"
  var rightie = 840;

  var alreadyThereL = false;
  var alreadyThereR = false;

  var LEFT_X = 50;	// pixels
  var RIGHT_X = 1200;

  function Init(evt){
   SVGDocument = evt.target.ownerDocument;
   SVGRoot = SVGDocument.documentElement;
   StartTimeLine(-1500, 2010, 50, 1220);  // user input
  };

  function StartTimeLine(low, high, l, r){

   if(low <= high){
    lowBound = low;
    highBound = high;
   }
   else{
    lowBound = high;
    highBound = low;
   }
   if(l <= r){
    LEFT_X = l;
    RIGHT_X = r;
   }
   else{
    LEFT_X = r;
    RIGHT_X = l;
   }

   Left = SVGDocument.getElementById('LeftSlider');
   Right = SVGDocument.getElementById('RightSlider');
   TLeft = SVGDocument.getElementById('ChangeL');
   TRight = SVGDocument.getElementById('ChangeR');
   Centre = SVGDocument.getElementById('TextBox');
   CentreLine = SVGDocument.getElementById('MiddlePath');
   OldBound = SVGDocument.getElementById('LeftBound');
   NowBound = SVGDocument.getElementById('RightBound');
   FirstQuart = SVGDocument.getElementById('Quarter1');
   ThirdQuart = SVGDocument.getElementById('Quarter3');
   BackDrop = SVGDocument.getElementById('BackDrop');
   RPath = SVGDocument.getElementById('RPath');
   LPath = SVGDocument.getElementById('LPath');
   Line = SVGDocument.getElementById('TimeLine');
   AdjustButton = SVGDocument.getElementById('Adjust');

   LPath.setAttributeNS(null, 'x1', LEFT_X);
   LPath.setAttributeNS(null, 'x2', LEFT_X);
   OldBound.setAttributeNS(null, 'x', LEFT_X);

   RPath.setAttributeNS(null, 'x1', RIGHT_X);
   RPath.setAttributeNS(null, 'x2', RIGHT_X);
   NowBound.setAttributeNS(null, 'x', RIGHT_X);

   Line.setAttributeNS(null, 'x1', LEFT_X);
   Line.setAttributeNS(null, 'x2', RIGHT_X);

   q1 = Math.round(((RIGHT_X - LEFT_X) / 4) + LEFT_X);	// pixels
   q3 = Math.round(RIGHT_X - ((RIGHT_X - LEFT_X) / 4));	// pixels

   FirstQuart.setAttributeNS(null, 'x1', q1);
   FirstQuart.setAttributeNS(null, 'x2', q1);

   ThirdQuart.setAttributeNS(null, 'x1', q3);
   ThirdQuart.setAttributeNS(null, 'x2', q3);

   mid = Math.round(((RIGHT_X - LEFT_X) / 2) + LEFT_X);	// pixels
   
   CentreLine.setAttributeNS(null, 'x1', mid);
   CentreLine.setAttributeNS(null, 'x2', mid);
   Centre.setAttributeNS(null, 'x', mid);

   third = (RIGHT_X - LEFT_X) / 3; // pixels
   leftVal = third + LEFT_X;
   rightVal = RIGHT_X - third;

   Left.setAttributeNS(null, 'cx', leftVal);
   TLeft.setAttributeNS(null, 'x', leftVal);
   Right.setAttributeNS(null, 'cx', rightVal);
   TRight.setAttributeNS(null, 'x', rightVal);

   SetBounds();
   FindPoints();
  };

  function SetBounds(){
   ChangeThing(lowBound, OldBound);
   ChangeThing(highBound, NowBound);
  };

  function FindPoints(){
   length = highBound - lowBound;
   temp = length / 3;
   leftie = Math.round(lowBound + temp);
   rightie = Math.round(highBound - temp);

   mid = length / 2;				// value
   midPoint = Math.round(highBound - mid);
   if(midPoint == 0){
    midPoint = 1;
   }
   
   ChangeThing(midPoint, Centre);
   ChangeThing(leftie, TLeft);
   ChangeThing(rightie, TRight);
  };

  function ChangeThing(xVal, thing){
   if(xVal < 0){
    xVal = xVal * -1;
    newText = SVGDocument.createTextNode(xVal + ' BCE');
   }
   else{
    newText = SVGDocument.createTextNode(xVal + ' CE');
   }
   thing.replaceChild(newText, thing.firstChild);
  };

  function Grab(evt){
   var targetElement = evt.target;
   if(targetElement == Left || targetElement == Right){
    DragTarget = targetElement;
    DragTarget.parentNode.appendChild(DragTarget); // if this is gone, behaviour is different on the 2nd drag
    DragTarget.setAttributeNS(null, 'pointer-events', 'none');
   }
  };

  function Drag(evt){
   if(DragTarget){
    newX = CheckBounds(evt.clientX);
    if(DragTarget == Left){
     if(newX <= (rightVal - 10)){
      DragTarget.setAttributeNS(null, 'cx', newX);
      TLeft.setAttributeNS(null, 'x', newX);
      if(newX >= (rightVal - 60) && (alreadyThereR == false)){
       TLeft.setAttributeNS(null, 'y', 160);
       alreadyThereL = true;
      }
      else{
       TLeft.setAttributeNS(null, 'y', 145);
       alreadyThereL = false;
      }
      ChangeWords(evt.clientX, TLeft);
      leftVal = newX;
     }
    }
    else if(DragTarget == Right){
     if(newX >= (leftVal + 10)){
      DragTarget.setAttributeNS(null, 'cx', newX);
      TRight.setAttributeNS(null, 'x', newX);
      if(newX <= (leftVal + 60) && (alreadyThereL == false)){
       TRight.setAttributeNS(null, 'y', 160);
       alreadyThereR = true;
      }
      else{
       TRight.setAttributeNS(null, 'y', 145);
       alreadyThereR = false;
      }
      ChangeWords(evt.clientX, TRight);
      rightVal = newX;
     }
    }
    AdjustButton.setAttributeNS(null, 'fill-opacity', 0.0);
 
   }
  };

  function Drop(evt){
   if(DragTarget){
    var targetElement = evt.target;
    DragTarget.setAttributeNS(null, 'pointer-events', 'all');
    DragTarget = null;
    DoQuery(leftie, rightie);
   }
  };

  function ChangeWords(xVal, slider){
   newVal = Scale(xVal);
   if(newVal < lowBound){	
    newVal = lowBound;
   }
   else if(newVal > highBound){
    newVal = highBound;
   }
   ChangeThing(newVal, slider);
   if(slider == TRight){
    rightie = newVal;
   }
   else if(slider == TLeft){
    leftie = newVal;
   }
  };

  function Scale(x){
   scale = highBound - lowBound;
   pixDistance = RIGHT_X - LEFT_X;
   ratio = (x - LEFT_X) / pixDistance;
   time = Math.round(ratio * scale) + lowBound;
   return time;
  };

  function CheckBounds(x){
   if(x <= LEFT_X){
    return LEFT_X;
   }
   else if(x >= RIGHT_X){
    return RIGHT_X;
   }
   return x;
  };

  function Adjust(evt){
   var targetElem = evt.target;
   if(targetElem == AdjustButton){
    StartTimeLine(leftie, rightie, LEFT_X, RIGHT_X);
    AdjustButton.setAttributeNS(null, 'fill-opacity', 1.0);
   }
  };

  function DoQuery(left, right){
   listEventsForTimeSpan(left,right);
  };
  
  //Event code
  
var i;
var endpoint = "http://heml.mta.ca/openrdf-sesame/repositories/labels";
function onHemlFailure(reply) {
    alert("The Heml SPARQL query failed. Perhaps you do not have an Internet connection:\n" + reply);
    // do something more interesting, like putting an x through the map. or making
    // a popup
}


function listEventsForTimeSpan(start, end) {
	var startDate = start+"-01-01";
    var endDate = end+"-01-01";
	var listEventsFromJson = function(json) {
		var theHeader = document.getElementById("locationLabel");
		headerText = theHeader.childNodes[0];
		if (headerText != null) {
			theHeader.removeChild(headerText);
		}
		var theNewHeaderText = document.createTextNode("event");
		var theDocs = document.getElementById("docs");
		var theEventList = document.getElementById("eventList");
		try {
			if (theEventList != null) {
				theDocs.removeChild(theEventList);
			}
		}
		catch(error) {
			alert("error: " + error);
		}
		var newEventList = document.createElement('div');
		newEventList.id = "eventList";
		var eventsLength = json.results.bindings.length;
		for(var i = 0; i<eventsLength; i++) {
			try {
				if (json.results.bindings[i].date.value != null) {
					var prettyDate = formatDate(json.results.bindings[i].date.value);
				} 
				else {
					var prettyDate = "BAD DATE";
				}
				var theTextOfTheParagraph = document.createTextNode(prettyDate + ": " + json.results.bindings[i].eventLabel.value);
			} 
			catch(anError) {
				alert(anError);
			}
			if (i > 0) {
				newEventList.appendChild(document.createElement('br'));
			}
			var eventDiv = document.createElement('div');
			eventDiv.className = 'event';
			var para = document.createElement('p');
			para.className = 'eventTitle';
			para.setAttribute("onclick", "getRefTypes(this, '" + json.results.bindings[i].event.value + "')");
			para.setAttribute("clicked", "false");            
			para.appendChild(theTextOfTheParagraph);
			eventDiv.appendChild(para);
			newEventList.appendChild(eventDiv);
	}	
	theHeader.appendChild(theNewHeaderText);
	theDocs.appendChild(newEventList);
}

var AND = "&&";
var queryString = "SELECT DISTINCT ?event ?eventLabel ?date ?refURI WHERE { ?event <http://dbpedia.org/ontology/date> ?date. ?event rdfs:label ?eventLabel. OPTIONAL { ?event <http://www.heml.org/rdf/2003-09-17/heml#Evidence> ?refURI.} FILTER ((lang(?eventLabel) = 'en')"+AND+"(?date <\""+endDate+"\"^^xsd:date)"+AND+"(?date>\""+startDate+"\"^^xsd:date))} ORDER BY ?date";
var eventsQuery = new Heml.SparqlQuery(endpoint, queryString, onHemlFailure, listEventsFromJson);

function formatDate(dateIn) {
	var dateRegex = new RegExp("(-?\\d+)-(\\d+)-(\\d+)");
	var yearRegex = new RegExp("\s*(-?\\d+)\s*");
	var match = dateRegex.exec(dateIn);
	//alert(match);
	if (yearRegex.exec(dateIn)) {
		yearAsInt = parseInt(dateIn, 10);
		if (yearAsInt > 0) {
			return yearAsInt + " CE";
		} 
		else {
			return yearAsInt * -1 + " BCE";
		}
	}
	if (match) {
		return dateIn;
	}
	else {
		var string = "matched at position " + match.index + ":\n";
		string = string + "string matched: " + match[0] + "\n";
		if (match.length > 0) {
			for (var i = 1; i<match.length; i++) {
				string = string + "(" + i + " " + match[i] + ")" + "\n";
			}
		}
	}
	yearAsInt = parseInt(match[1], 10);
	if (yearAsInt > 0) {
		return yearAsInt + " CE";
	}
	else {
		return yearAsInt * -1 + " BCE";
	}
}

eventsQuery.performQuery();
}
