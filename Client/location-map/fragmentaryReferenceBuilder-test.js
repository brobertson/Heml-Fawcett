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

/* var refQueryStart = allQueryStart + "SELECT ?node ?label   WHERE     { ?node rdfs:subPropertyOf <http://www.heml.org/rdf/2003-09-17/heml#referredToIn> . <"; */
var refQueryStart = allQueryStart + "SELECT ?parent ?parentlabel ?child ?childlabel WHERE { ?child rdfs:subPropertyOf ?parent. <";
var refQueryEnd = " ?child rdfs:label ?childlabel. ?parent rdfs:label ?parentlabel. }";
/*var refQueryEnd = "> ?node ?reference . ?node rdfs:label ?label. }";*/

var refTitleStart = allQueryStart + " SELECT ?evidence ?url ?xslAddress ?label WHERE {";
var refTitleEnd = "?evidence . ?evidence hemlRDF:url ?url . ?evidence hemlRDF:xhtmlRenderingXSLT ?render . ?render <http://www.heml.org/rdf/2003-09-17/heml#uri>   ?xslAddress .  ?evidence rdfs:label ?label . }";
function onHemlFailure(reply) {
    alert("The Heml SPARQL query failed. Perhaps you do not have an Internet connection:\n" + reply);
    // do something more interesting, like putting an x through the map. or making
    // a popup
}

var successfulCallbackModel = function(htmlNode, eventNode) {
	this.htmlNode = htmlNode;
	var me = this;
	this.makeRefLinks = function(json) {
		var numberOfEntries = json.results.bindings.length;
		if (numberOfEntries == 0) {
			alert("No sources are available");
		}
		else {
		var a = document.createElement('div');
		a.id = eventNode;
		a.style.display = "none";
		me.htmlNode.parentNode.appendChild(a);	
		var entryArray = new Array();
		var length;	
		for (var i=0; i<numberOfEntries; i++) {
			var parent = json.results.bindings[i].parent.value;
			var child = json.results.bindings[i].child.value;
			if (parent != child) {
				var parentlabel = json.results.bindings[i].parentlabel.value;
				var childlabel = json.results.bindings[i].childlabel.value;
				length = entryArray.push(parent, parentlabel, child, childlabel);
			}
		}
		for (var i=0; i<length; i=i+4) {
			var parent = entryArray[i];
			var child = entryArray[i+2];
			var x = getElementsByClass(a, parent, '*')[0];
			var y = getElementsByClass(a, child, '*')[0];
			if (x==null) {
				x = document.createElement('div');
				x.className = parent;
				var xText = document.createElement('p');
				xText.className = 'referenceTypeClass';
				xText.setAttribute("clicked", "false");
				xText.setAttribute("furthestChild", "false");
				xText.appendChild(document.createTextNode(entryArray[i+1]));
				x.appendChild(xText);
				if (y==null) {
					x.style.textIndent = 10;
					y = document.createElement('div');
					y.className = child;
					y.style.textIndent = 20;
					var yText = document.createElement('p');
					yText.className = 'referenceTypeClass';
					yText.setAttribute("clicked", "false");
					yText.setAttribute("furthestChild", "true");
					yText.appendChild(document.createTextNode(entryArray[i+3]));				
					y.appendChild(yText);
				}
				else {
					var yParentIndent = y.parentNode.style.textIndent;
					yParentIndent = parseInt(yParentIndent);
					x.style.textIndent = yParentIndent + 10;
					var xIndent = x.style.textIndent;
					xIndent = parseInt(xIndent);
					y.style.textIndent = xIndent + 10;
					var yClone = y.cloneNode(true);
					y.parentNode.removeChild(y);
					y = yClone;
				}
			}
			else if ((x!=null) && (y==null)) { 
				y = document.createElement('div');
				y.className = child;
				var xIndent = x.style.textIndent;
				xIndent = parseInt(xIndent);
				x.firstChild.setAttribute("furthestChild", "false");
				y.style.textIndent = xIndent + 10;
				var yText = document.createElement('p');
				yText.className = 'referenceTypeClass';
				yText.setAttribute("clicked", "false");
				yText.setAttribute("furthestChild", "true");
				yText.appendChild(document.createTextNode(entryArray[i+3]));
				y.appendChild(yText);
			}
			x.appendChild(y);
			a.appendChild(x);
		}
		var refs = getElementsByClass(a, 'referenceTypeClass', 'p');
		for (var i=0; i<refs.length; i++) {
			var ref = refs[i];
			var furthest = ref.attributes.getNamedItem("furthestChild").value;
			if (furthest=="true") {
				ref.style.cursor = "pointer";
				ref.onclick = function() {
					var clicked = this.attributes.getNamedItem("clicked").value;
					if (clicked=="false") {
						getRefTitles(this.parentNode.className, eventNode, this);
						this.setAttribute("clicked","true");	
					}
					else {
						if (this.nextSibling.style.display=="none") {
							this.nextSibling.style.display = "block";
						} else {
							this.nextSibling.style.display = "none";
						}
					}
				}
			}
		}
		a.style.display = "block";
	}	
	}
}	
	
	


var successfulCallbackModelForTitles = function(htmlNode) {
    //use '' for root
    this.htmlNode = htmlNode;
    var me = this;
    this.makeRefTitles = function(json) {
        var numberOfEntries = json.results.bindings.length;
		if (numberOfEntries == 0) {
			alert("No sources have been provided\nfor this category.");
		}
		else {
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
				y.setAttribute("clicked", "false");
				y.onclick = function() {
					var yAttributes = y.attributes;
					var clicked = yAttributes.getNamedItem("clicked").value;
					if (clicked=="false") {
						doXMLHttp(xslt, source, y);
						y.setAttribute("clicked","true");	
					}
					else {
						if (y.nextSibling!=null) {
							if (y.nextSibling.style.display=="none") {
								y.nextSibling.style.display = "block";
							} else {
								y.nextSibling.style.display = "none";
							}
						}
						else {
							alert("No sources have been provided\nfor this category.");
						}
					}
    	        }
    	        y.appendChild(document.createTextNode(refTitle));
    	        x.appendChild(y);
				a.appendChild(x)
    	    }
			me.htmlNode.parentNode.appendChild(a);
	    }
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
	if (clicked=="false"){	
		htmlNode.setAttribute("clicked", "true");
		myTry = new successfulCallbackModel(htmlNode, eventNode);
		hq = new Heml.SparqlQuery(endpoint, refQueryStart + eventNode + "> ?child ?reference. <" + eventNode + "> ?parent ?reference." + refQueryEnd, onHemlFailure, myTry.makeRefLinks);
		hq.performQuery();
		var theDiv = document.getElementById(eventNode);
		theDiv.style.display = "block";		
	}
	else {
		var theDiv = document.getElementById(eventNode);
		if (theDiv!=null) {
			if (theDiv.style.display == "none") {
				theDiv.style.display = "block";
			} else {
				theDiv.style.display = "none";
			}
		}
		else {
			alert("No sources are available.");
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
	parentNode.parentNode.appendChild(newFragment);
}

/*function doXMLHttp(xslURL, documentURL, parentNode) {
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
}*/

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


