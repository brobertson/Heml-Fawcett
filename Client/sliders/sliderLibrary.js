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
  var BottomGraph;
  var TopGraph;

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
   BottomGraph = SVGDocument.getElementById('BottomGraph');
   TopGraph = SVGDocument.getElementById('TopGraph');

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
    temp = CheckX(evt);  // changed
    newX = CheckBounds(temp);  // changed
    if(DragTarget == Left){
     if(newX <= (rightVal - 10)){
      DragTarget.setAttributeNS(null, 'cx', newX);
      TLeft.setAttributeNS(null, 'x', newX);
      if(newX >= (rightVal - 50) && (alreadyThereR == false)){
       TLeft.setAttributeNS(null, 'y', 140);
       alreadyThereL = true;
      }
      else{
       TLeft.setAttributeNS(null, 'y', 125);
       alreadyThereL = false;
      }
      ChangeWords(newX, TLeft);
    //  ChangeWords(newX, BottomGraph);
      leftVal = newX;
     }
    }
    else if(DragTarget == Right){
     if(newX >= (leftVal + 10)){
      DragTarget.setAttributeNS(null, 'cx', newX);
      TRight.setAttributeNS(null, 'x', newX);
      if(newX <= (leftVal + 50) && (alreadyThereL == false)){
       TRight.setAttributeNS(null, 'y', 140);
       alreadyThereR = true;
      }
      else{
       TRight.setAttributeNS(null, 'y', 125);
       alreadyThereR = false;
      }
      ChangeWords(newX, TRight);
      rightVal = newX;
     }
    }
    AdjustButton.setAttributeNS(null, 'fill-opacity', 0.0);
   }
  };

  function CheckX(evt){
   xVal = evt.clientX - 128;
   return xVal;
  };

  function Drop(evt){
   if(DragTarget){
    var targetElement = evt.target;
    DragTarget.setAttributeNS(null, 'pointer-events', 'all');
    DragTarget = null;
    DoQuery(leftie, rightie);
    ChangeWords(leftVal, BottomGraph);
    ChangeWords(rightVal, TopGraph);
   }
  };

  function ChangeWords(xVal, slider){
   newVal = Scale(xVal);
   if(newVal == 0){
    newVal = 1;
   }
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
    TLeft.setAttributeNS(null, 'y', 125);
    TRight.setAttributeNS(null, 'y', 125);
   }
  };

  function ShowDensity(start, end){
   time = end - start;
   splice = time / 20;
   start = parseInt(start, 10);
   end = parseInt(end, 10);
   for(var i = 0; i < 20; i++){
    begin = start + (i * splice);
    stop = start + ((i + 1) * splice);
  //  numQs = Math.round(Math.random()*51);  // running on random number generator while server down
   numQs = getNumberOfQueries(begin, stop);
    graph = SVGDocument.getElementById(i);
    if(numQs > 0){
     visible = numQs * 3;
     graph.setAttributeNS(null, 'height', visible);
    }
    opaque = numQs / 50;
    graph.setAttributeNS(null, 'fill-opacity', opaque);
   }
  };


  function DoQuery(left, right){
  //Code to make the years 4 digits long
  left = parseInt(left, 10);
  right = parseInt(right, 10);
  if(left<0){
     var left = "" + left;
    
    if(left.length == 2)
    {left = "-000"+(left*(-1))}
    if(left.length==3)
    {left = "-00"+(left*(-1))}
    if(left.length==4)
    {left = "-0"+(left*(-1))}
    }
  else{
    var left = "" + left;
    if(left.length == 1)
    {left = "000"+(left)}
    if(left.length==2)
    {left = "00"+(left)}
    if(left.length==3)
    {left = "0"+(left)}
    }
  
  if(right<0){
    var right = "" + right;
    if(right.length == 2)
    {right = "-000"+(right*(-1))}
    if(right.length==3)
    {right = "-00"+(right*(-1))}
    if(right.length==4)
    {right = "-0"+(right*(-1))}
    }
  else{
    var right = "" + right;
    if(right.length == 1)
    {right = "000"+(right)}
    if(right.length==2)
    {right = "00"+(right)}
    if(right.length==3)
    {right = "0"+(right)}
    }
   listEventsForTimeSpan(left, right);
   ShowDensity(left, right);
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

    if(headerText != null){
     theHeader.removeChild(headerText);
    }

    var theNewHeaderText = document.createTextNode("event");
    var theDocs = document.getElementById("docs");
    var theEventList = document.getElementById("eventList");
    
    try{
     if(theEventList != null){
      theDocs.removeChild(theEventList);
     }
    }

    catch(error){
     alert("error: " + error);
    }

   var newEventList = document.createElement('div');
   newEventList.id = "eventList";
   var eventsLength = json.results.bindings.length;
   for(var i = 0; i<eventsLength; i++){
    try{
     if(json.results.bindings[i].date.value != null){
      var prettyDate = formatDate(json.results.bindings[i].date.value);
     } 
     else{
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

  function formatDate(dateIn){
   var dateRegex = new RegExp("(-?\\d+)-(\\d+)-(\\d+)");
   var yearRegex = new RegExp("\s*(-?\\d+)\s*");
   var match = dateRegex.exec(dateIn);
   //alert(match);

   if (yearRegex.exec(dateIn)){
    yearAsInt = parseInt(dateIn, 10);

    if(yearAsInt > 0){
     return yearAsInt + " CE";
    } 
    else{
     return yearAsInt * -1 + " BCE";
    }
   }

   if(match){
    return dateIn;
   }
   else{
    var string = "matched at position " + match.index + ":\n";
    string = string + "string matched: " + match[0] + "\n";

    if(match.length > 0){
     for(var i = 1; i<match.length; i++){
      string = string + "(" + i + " " + match[i] + ")" + "\n";
     }
    }
   }

   yearAsInt = parseInt(match[1], 10);
   if(yearAsInt > 0){
    return yearAsInt + " CE";
   }
   else{
    return yearAsInt * -1 + " BCE";
   }
  }

  eventsQuery.performQuery();
 }

function getNumberOfQueries(left, right){
left = parseInt(left, 10);
  right = parseInt(right, 10);
  if(left<0){
     var left = "" + left;
    
    if(left.length == 2)
    {left = "-000"+(left*(-1))}
    if(left.length==3)
    {left = "-00"+(left*(-1))}
    if(left.length==4)
    {left = "-0"+(left*(-1))}
    }
  else{
    var left = "" + left;
    if(left.length == 1)
    {left = "000"+(left)}
    if(left.length==2)
    {left = "00"+(left)}
    if(left.length==3)
    {left = "0"+(left)}
    }
  
  if(right<0){
    var right = "" + right;
    if(right.length == 2)
    {right = "-000"+(right*(-1))}
    if(right.length==3)
    {right = "-00"+(right*(-1))}
    if(right.length==4)
    {right = "-0"+(right*(-1))}
    }
  else{
    var right = "" + right;
    if(right.length == 1)
    {right = "000"+(right)}
    if(right.length==2)
    {right = "00"+(right)}
    if(right.length==3)
    {right = "0"+(right)}
    }

var startDate = left+"-01-01";
   var endDate = right+"-01-01";
   var count;
var countEventsFromJson = function(json) {
count= json.results.bindings.length;
console.warn(count);
}
var AND = "&&";
var queryString = "SELECT DISTINCT ?event ?eventLabel ?date ?refURI WHERE { ?event <http://dbpedia.org/ontology/date> ?date. ?event rdfs:label ?eventLabel. OPTIONAL { ?event <http://www.heml.org/rdf/2003-09-17/heml#Evidence> ?refURI.} FILTER ((lang(?eventLabel) = 'en')"+AND+"(?date <\""+endDate+"\"^^xsd:date)"+AND+"(?date>\""+startDate+"\"^^xsd:date))} ORDER BY ?date";
var eventsQuery = new Heml.SparqlQuery(endpoint, queryString, onHemlFailure, countEventsFromJson);
eventsQuery.performQuery();

}

