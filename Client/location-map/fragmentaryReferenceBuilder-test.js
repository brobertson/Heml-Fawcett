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
var allQueryStart = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX hemlRDF: <http://www.heml.org/rdf/2003-09-17/heml#> ";

/* var refQueryStart = allQueryStart + "SELECT ?node ?label   WHERE     { ?node rdfs:subPropertyOf <http://www.heml.org/rdf/2003-09-17/heml#referredToIn> . <"; */
var refQueryStart ="SELECT ?parent ?parentlabel ?child ?childlabel WHERE { ?child rdfs:subPropertyOf ?parent. <";
var refQueryEnd = " ?child rdfs:label ?childlabel. ?parent rdfs:label ?parentlabel. }";
/*var refQueryEnd = "> ?node ?reference . ?node rdfs:label ?label. }";*/

var refTitleStart ="SELECT ?evidence ?rdfstype ?fragmentUrl ?xslAddress ?label ?externalResource WHERE {";
var refTitleEnd = "?evidence . OPTIONAL {?evidence rdfs:type ?rdfstype.} OPTIONAL { {?evidence hemlRDF:url ?fragmentUrl . ?evidence hemlRDF:xhtmlRenderingXSLT ?render . ?render <http://www.heml.org/rdf/2003-09-17/heml#uri> ?xslAddress .  ?evidence rdfs:label ?label} UNION {?evidence hemlRDF:HasInstance ?externalResource} } . }";

//var refTitleEnd = "?evidence . ?evidence hemlRDF:url ?url . ?evidence hemlRDF:xhtmlRenderingXSLT ?render . ?render <http://www.heml.org/rdf/2003-09-17/heml#uri>   ?xslAddress .  ?evidence rdfs:label ?label . }";

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
		
			var a = document.createElement('div');
		a.id = eventNode;
		//a.style.display = "none";
		me.htmlNode.parentNode.appendChild(a);
		a.appendChild(document.createTextNode('[none]'));
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
				var xAttributes = new Array("clicked", "false", "furthestChild", "false");
				x = createRefNode('div', parent, 'p', 'referenceTypeClass', xAttributes, entryArray[i+1]);
				if (y==null) {
					yAttributes = new Array("clicked", "false", "furthestChild", "true");
					y = createRefNode('div', child, 'p', 'referenceTypeClass', yAttributes, entryArray[i+3]);
					x.style.textIndent = 10;
					y.style.textIndent = 20;
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
				x.firstChild.setAttribute("furthestChild", "false");
				yAttributes = new Array("clicked", "false", "furthestChild", "true");				
				y = createRefNode('div', child, 'p', 'referenceTypeClass', yAttributes, entryArray[i+3]);
				var xIndent = x.style.textIndent;
				xIndent = parseInt(xIndent);
				y.style.textIndent = xIndent + 10;
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
					cursor_wait();
					var clicked = this.attributes.getNamedItem("clicked").value;
					if (clicked=="false") {
						getRefTitles(this.parentNode.className, eventNode, this);
						this.setAttribute("clicked","true");	
					}
					else {
						var theDiv = this.nextSibling;
						displayBlock(theDiv, "No sources have been provided for this category.");
					}
				}
			}
			else {
				ref.removeAttribute("clicked");
			}
		}
		a.style.display = "block";
	}	
	}
}	
	
	
function createRefNode(nodeType, nodeClassName, textNodeType, textNodeClassName, attributes, textNodeText) {
	var node = document.createElement(nodeType);
	node.className = nodeClassName;
	var textNode = document.createElement('p');
	textNode.className = textNodeClassName;
	for (var n=0; n<attributes.length; n=n+2) {
		textNode.setAttribute(attributes[n], attributes[n+1]);
	}
	textNode.appendChild(document.createTextNode(textNodeText));
	node.appendChild(textNode);
	return node;
}


var successfulCallbackModelForTitles = function(htmlNode) {
    //use '' for root
    this.htmlNode = htmlNode;
    var me = this;
    this.makeRefTitles = function(json) {
		var numberOfEntries = json.results.bindings.length;
		if (numberOfEntries == 0) {
			alert("No sources have been provided for this category.");
		} else {
			var a = document.createElement('div'); 
			a.className = 'referenceTitles';       
			for (var i = 0; i < numberOfEntries; i++) {
				var resource = null;
				if(json.results.bindings[i].fragmentUrl) {
					resource = json.results.bindings[i].label.value;
					var source1 = json.results.bindings[i].fragmentUrl.value;
					var xslt = json.results.bindings[i].xslAddress.value;
					var x = document.createElement('div');
					x.className = 'referenceTitle';
					var y = document.createElement('p');
					y.className = 'referenceTitleClass';
					y.setAttribute("clicked", "false");
					y.onclick = function() {
						cursor_wait();
						var yAttributes = y.attributes;
						var clicked = yAttributes.getNamedItem("clicked").value;
						if (clicked=="false") {
							doXMLHttp(xslt, source1, y);
							y.setAttribute("clicked","true");	
						}
						else {
							var theDiv = y.nextSibling;
							displayBlock(theDiv, "The quotation cannot be rendered.");						
						}
	    	        }//end onclick function
				}//end if
                               else if (json.results.bindings[i].externalResource) {
					resource = json.results.bindings[i].externalResource.value;
					if (resource.indexOf("<db:bibliomixed")!=-1) {
					    /**
					    cursor_wait();
						var xmlhttp = new XMLHttpRequest();
                        xmlhttp.open("GET", json.results.bindings[i].xslAddress.value, false);
                        xmlhttp.send(null);
                        if (xmlhttp.status == 200) {
	                        var processor = new XSLTProcessor();
	                        processor.importStylesheet(xmlhttp.responseXML);
	                        resource = processor.transformToFragment(resource, document);
                        } else {
	                        cursor_default();
	                        alert("Error retrieving "+json.results.bindings[i].xslAddress.value);
                        }*/
                        resource = null;
					}//end if (resource
                                         else {
						var x = document.createElement('div');
						x.className = 'referenceTitle';
						var y = document.createElement('a');
						y.target = '_blank';
						y.href = resource;
						checkLink(y);
					}//end else
				}//end else if
				else if (json.results.bindings[i].rdfstype) {
                                    rdfstype = json.results.bindings[i].rdfstype.value;
			            if (rdfstype == "http://www.heml.org/rdf/2003-09-17/heml#tlgFragment") {
            var x = document.createElement('span');
            x.className = 'ctsurn_author';
            var y = document.createElement('span');
            y.className = 'ctsurn_title';
            var a = document.createElement('span');
            a.appendChild(x);
            a.appendChild(document.createTextNode(' '));
            a.appendChild(y);
			var langPrefs = getPreferencesFromCookie();
//alert(langPrefs);
                       var evidenceURL = json.results.bindings[i].evidence.value;
                        myregexp = /^(http:\/\/heml\.mta\.ca\/text\/urn\/[A-Z]*\d*\/[A-Z]*\d*)\/(.*)/i;
 			
       			 mymatch = myregexp.exec(evidenceURL);
//alert(mymatch);
			var work = "<" + mymatch[1] + ">";
//alert(work);
var queryString2 = "select DISTINCT ?label where {?creationEvent <http://cidoc.ics.forth.gr/rdfs/cidoc_v4.2.rdfs#P94>" + work + ". ?creationEvent <http://cidoc.ics.forth.gr/rdfs/cidoc_v4.2.rdfs#P14> ?author. ?author rdfs:label ?label. }"
            myTry = new Moffatt.successfulCallbackModelForTitlesorAuthors("author", x, langPrefs);
            hq2 = new Heml.SparqlQuery(endpoint, queryString2, onHemlFailure, myTry.makeRefTitles);
            hq2.performQuery();
			myTry = new Moffatt.successfulCallbackModelForTitlesorAuthors("title", y, langPrefs);
            var queryString = "select ?label where {" + work + " rdfs:label ?label. }"
            hq = new Heml.SparqlQuery(endpoint, queryString, onHemlFailure, myTry.makeRefTitles);
            hq.performQuery();
//alert(mymatch[2]);
splitBookline = mymatch[2].split('/');
var joinBookline = splitBookline.join('.');
//alert(joinBookline);
            queryString3 = "select ?perseusText  ?firstChunking ?secondChunking ?thirdChunking where {" + work + " \
                            <http://heml.mta.ca/cidoc_crm_texts#PerseusText> ?perseusText;\
                            <http://heml.mta.ca/cidoc_crm_texts#firstChunk> ?firstChunking.\
                   OPTIONAL {" + work + "        <http://heml.mta.ca/cidoc_crm_texts#secondChunk> ?secondChunking. }\
                   OPTIONAL {" + work + "       <http://heml.mta.ca/cidoc_crm_texts#thirdChunk> ?thirdChunking. } }";
            myTry = new Moffatt.callbackModelForTextLink(a,splitBookline);
            hq3 = new Heml.SparqlQuery(endpoint, queryString3, onHemlFailure, myTry.makeTextLink);
            hq3.performQuery();		
          //  if (joinBookline != '') {
                alert(joinBookline);
                var z = document.createElement('span');
                z.className = 'ctsurn_ref';
                z.appendChild(document.createTextNode(joinBookline));
               a.appendChild(document.createTextNode(' '));
                a.appendChild(z);

          //  }
                                }
}
				if(resource!=null) {
					y.appendChild(document.createTextNode(resource));
		 	        x.appendChild(y);
					a.appendChild(x);

			}// end if(resource!=
			}
			me.htmlNode.parentNode.appendChild(a);
		}//end else
	}// end this.makeRefTitles = function(json)
}//end function

function getRefTitles(refTypeResource, eventResource, htmlNode) {
	myTry = new successfulCallbackModelForTitles(htmlNode);
	hq = new Heml.SparqlQuery(endpoint, refTitleStart + " <" + eventResource + "> <" + refTypeResource + "> " + refTitleEnd, onHemlFailure, myTry.makeRefTitles);
	hq.performQuery();
	cursor_default();	
}

function getRefTypes(htmlNode, eventNode) {
	var linkAttributes = htmlNode.attributes;
	var clicked = linkAttributes.getNamedItem("clicked").value;	
	if (clicked=="false"){	
		htmlNode.setAttribute("clicked", "true");
		myTry = new successfulCallbackModel(htmlNode, eventNode);
		hq = new Heml.SparqlQuery(endpoint, refQueryStart + eventNode + "> ?child ?reference. <" + eventNode + "> ?parent ?reference." + refQueryEnd, onHemlFailure, myTry.makeRefLinks);
		hq.performQuery();
	}
	else {
		var theDiv = document.getElementById(eventNode);		
		displayBlock(theDiv, "No sources are available.");
	}
}

function displayBlock(theDiv, message){
    cursor_default();
	if (theDiv!=null) {
		if (theDiv.style.display == "none") {
			theDiv.style.display = "block";
		}
		else {
			theDiv.style.display = "none";
		}
	}
	else {
		alert(message);
	}
}

function doXMLHttp(xslURL, documentURL, parentNode) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", xslURL, false);
	xmlhttp.send(null);
	if (xmlhttp.status == 200) {
		var xmlhttpDoc = new XMLHttpRequest();
		xmlhttpDoc.open("Get", documentURL, false);
		xmlhttpDoc.send(null);
		cursor_default();
		if (xmlhttpDoc.status == 200) {
			alert (xmlhttpDoc.responseText);
			var processor = new XSLTProcessor();
			processor.importStylesheet(xmlhttp.responseXML);
			var newFragment = processor.transformToFragment(xmlhttpDoc.responseXML, document);
			parentNode.parentNode.appendChild(newFragment);
		} else {
			alert ("Error retrieving "+documentURL);
		}
	} else {
		cursor_default();
		alert("Error retrieving "+xslURL);
	}
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

function cursor_wait() {
	var loader = document.getElementById("loading");
	loader.style.visibility="visible";
}

function cursor_default() {
	var loader = document.getElementById("loading");
	loader.style.visibility="hidden";
}

function checkLink(link) {
    uri = link.href;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('get', 'check.php?uri=' + encodeURIComponent(uri), true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.responseText=="GOOD") {
			    link.className = "goodlink"
            } else {
                link.className = "badlink"
            }
		}
	}
	xmlhttp.send(null);
}


