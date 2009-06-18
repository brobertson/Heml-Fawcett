/**********************************************************
  Copyright (c) 2009
    Bruce Robertson brobertson@mta.ca
  All rights reserved.

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is furnished to do
	so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
**********************************************************/



var endpoint = "http://heml.mta.ca/joseki3/sparql/read";
var allQueryStart = " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX hemlRDF: <http://www.heml.org/rdf/2003-09-17/heml#> ";
var refQueryStart = allQueryStart + "SELECT ?node ?label   WHERE     { ?node rdfs:subPropertyOf <http://www.heml.org/rdf/2003-09-17/heml#referredToIn> . <";
var refQueryEnd = "> ?node ?reference . ?node rdfs:label ?label. }";
var refTitleStart = allQueryStart + " SELECT ?evidence ?url ?xslAddress ?label WHERE {";
var refTitleEnd = "?evidence . ?evidence hemlRDF:url ?url . ?evidence hemlRDF:xhtmlRenderingXSLT ?render . ?render <http://www.heml.org/rdf/2003-09-17/heml#uri>   ?xslAddress .  ?evidence rdfs:label ?label . }";
function onHemlFailure(reply) {
    alert("The Heml SPARQL query failed. Perhaps you do not have an Internet connection:\n" + reply);
    // do something more interesting, like putting an x through the map. or making
    // a popup
}

var successfulCallbackModel = function(htmlNode, eventNode) {
    //use '' for root
    this.htmlNode = htmlNode;
	var me = this;
    this.makeRefLinks = function(json) {
        var numberOfEntries = json.results.bindings.length;
        var a = document.createElement('div');
        a.id = eventNode;
        for (var i = 0; i < numberOfEntries; i++) {
            var typeName = json.results.bindings[i].label.value;
            var nodeName = json.results.bindings[i].node.value;
            var x = document.createElement('div');
			x.id = nodeName;
            var y = document.createElement('p');
            y.className = 'referenceTypeClass';
			y.setAttribute("clicked","false");
			y.appendChild(document.createTextNode(typeName));
            y.onclick = function() {
				var yAttributes = y.attributes;
				var clicked = yAttributes.getNamedItem("clicked").value;
				if (clicked=="false") {
					getRefTitles(nodeName, eventNode, y);
					y.setAttribute("clicked","true");	
				}
				else {
					if (y.nextSibling.style.display=="none") {
						y.nextSibling.style.display = "block";
					} else {
						y.nextSibling.style.display = "none";
					}
				}
            }
            x.appendChild(y);
            a.appendChild(x);
        }
        me.htmlNode.parentNode.appendChild(a);
    }
}

var successfulCallbackModelForTitles = function(htmlNode) {
    //use '' for root
    this.htmlNode = htmlNode;
    var me = this;
    this.makeRefTitles = function(json) {
        var numberOfEntries = json.results.bindings.length;
		var a = document.createElement('div'); 
		a.className = 'referenceTitles';       
		for (var i = 0; i < numberOfEntries; i++) {
            var refTitle = json.results.bindings[i].label.value;
            var source = json.results.bindings[i].url.value;
            var xslt = json.results.bindings[i].xslAddress.value;
            var x = document.createElement('div');
			x.className = 'referenceTitle';
            var y = document.createElement('p');
            y.className = 'referenceTitleClass';
			y.onclick = function() {
				doXMLHttp(xslt, source, y);
            }
            y.appendChild(document.createTextNode(refTitle));
            x.appendChild(y);
			a.appendChild(x)
        }
		me.htmlNode.parentNode.appendChild(a);
    }
}

function getRefTitles(refTypeResource, eventResource, htmlNode) {
    myTry = new successfulCallbackModelForTitles(htmlNode);
    hq = new Heml.SparqlQuery(endpoint, refTitleStart + " <" + eventResource + "> <" + refTypeResource + "> " + refTitleEnd, onHemlFailure, myTry.makeRefTitles);
    hq.performQuery();
}

function getRefTypes(htmlNode, eventNode) {
	var linkAttributes = htmlNode.attributes;
	var clicked = linkAttributes.getNamedItem("clicked").value;	
	if (clicked==="false"){	
		htmlNode.setAttribute("clicked", "true");
		myTry = new successfulCallbackModel(htmlNode, eventNode);
		hq = new Heml.SparqlQuery(endpoint, refQueryStart + eventNode + refQueryEnd, onHemlFailure, myTry.makeRefLinks);
		hq.performQuery();
		var theDiv = document.getElementById(eventNode);
		theDiv.style.display = "block";		
	}
	else {
		var theDiv = document.getElementById(eventNode);
		if (theDiv.style.display == "none") {
			theDiv.style.display = "block";
		} else {
			theDiv.style.display = "none";
		}
	}
}

function doXMLHttp(xslURL, documentURL, parentNode) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", xslURL, false);
    xmlhttp.send(null);
    //if (xmlhttp.status == 200)
    //alert(xmlhttp.responseText);  
    var xmlhttpDoc = new XMLHttpRequest();
    xmlhttpDoc.open("Get", documentURL, false);
    xmlhttpDoc.send(null);
    //if (xmlhttp.status == 200) alert ("yep, we're ok");//xmlhttpDoc.responseText);
    var processor = new XSLTProcessor();
    processor.importStylesheet(xmlhttp.responseXML);
    var newFragment = processor.transformToFragment(xmlhttpDoc.responseXML, document);
	var quotation = getElementsByClass(document, "quotation", "*");
	var innerArray = getElementsByClass(document, "inner", "*");
	var inner = innerArray[0];	
	if (quotation[0]!=null) {
		inner.removeChild(quotation[0]);
		var sourceNode = document.getElementById("source");
		inner.removeChild(sourceNode);
		var newSourceNode = document.createElement('p');
		newSourceNode.id = "source";
		inner.appendChild(newSourceNode);
		var sourceTitle = parentNode.firstChild.cloneNode(true);
		newSourceNode.appendChild(sourceTitle);
	}
	else {
		var sourceTitle = parentNode.firstChild.cloneNode(true);
		document.getElementById("source").appendChild(sourceTitle);
	}
	inner.appendChild(newFragment);
}

function setup() {
	var clickEls = getElementsByClass(document, "linkLike", '*');
	var numberOfEntries = clickEls.length;
	for(var i = 0; i < numberOfEntries; i++) {
		clickEls[i].setAttribute("clicked", "false");
	}
}

function getElementsByClass(node, searchClass, tag) {
	var classElements = new Array();
	var elements = node.getElementsByTagName(tag);
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elements.length; i++) {
		if ( pattern.test(elements[i].className) ) {
			classElements[j] = elements[i];
			j++;
		}
	}
	return classElements;
}
