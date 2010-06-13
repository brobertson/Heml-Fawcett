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



var endpoint = "http://heml.mta.ca/sesame/openrdf-sesame/repositories/labels";

function onHemlFailure(reply) {
    alert("The Heml SPARQL query failed. Perhaps you do not have an Internet connection:\n" + reply);
    // do something more interesting, like putting an x through the map. or making
    // a popup
}

function labelFromJson(json, lang) {
	for (row in json.results.bindings) {
		//console.warn(json.results.bindings[row]);
		if (json.results.bindings[row].label["xml:lang"] == lang) return json.results.bindings[row].label["value"];
	}
	return null;
}
	
var successfulCallbackModelForTitles = function(className, htmlNode) {
    //use '' for root
    this.htmlNode = htmlNode;
    var me = this;
    this.makeRefTitles = function(json) {
		var numberOfEntries = json.results.bindings.length;
		if (numberOfEntries == 0) {
			alert("No labels have been provided for this entry.");
		} else {
			htmlNode.appendChild(document.createTextNode(labelFromJson(json, 'it')));
		}
	}
}

 $(document).ready(function () {
				   console.warn($("[data-ctsurn]"));
	  $("[data-ctsurn]").each(function(index) {
		urn = $(this).attr("data-ctsurn");
	//	myregexp =  /(\w+:cts:[A-Z]{4,}:([A-Z]{3}\d{4})\.([A-Z]{3}\d{3}))/i
			myregexp =  /(\w+:cts:[A-Z]{4,}:([A-Z]{3}\d{4})\.([A-Z]{3}\d{3}))(.*)/i
		mymatch = myregexp.exec(urn);
							  console.warn(mymatch);
		if(mymatch!=null){
				              bookLine1 = mymatch[4];
							console.warn("bookLine1: " + bookLine1);
							  bookline2 = bookLine1.replace(/:/g,'.').substring(1);
							  console.warn("bookline2: " + bookline2);
							  var x = document.createElement('span');
							  x.className = 'ctsurn_author';
							  var y = document.createElement('span');
							  y.className = 'ctsurn_title';

							  $(this).val('');
							  $(this).append(x);
							  $(this).append(' ');
							$(this).append(y);
							  if (bookline2 != '') {
							  var z = document.createElement('span');
							  z.className = 'ctsurn_ref';
								z.appendChild(document.createTextNode(bookline2));
							  
							  $(this).append(' ');
							  $(this).append(z);
							  }
							  
		var author ="<http://heml.mta.ca/text/urn/"+mymatch[2]+">"; // author URL
		var work = "<http://heml.mta.ca/text/urn/"+mymatch[2]+"/"+mymatch[3]+">"; // work URL
		var queryString2 = "select ?label where {"+author+" rdfs:label ?label. }"
		myTry = new successfulCallbackModelForTitles("author", x);
		hq2 = new Heml.SparqlQuery(endpoint, queryString2, onHemlFailure, myTry.makeRefTitles);
						
		hq2.performQuery();
        myTry = new successfulCallbackModelForTitles("title", y);
		var queryString = "select ?label where {"+work+" rdfs:label ?label. }"
		hq = new Heml.SparqlQuery(endpoint, queryString, onHemlFailure, myTry.makeRefTitles);
						hq.performQuery();
	}	
	});
	});
	
	


