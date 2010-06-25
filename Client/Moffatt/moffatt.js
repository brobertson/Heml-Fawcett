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



var endpoint = "http://heml.mta.ca/openrdf-sesame/repositories/labels-horst";

function toConsole(text) {
	var DEBUG = false;
	if (DEBUG) {
		console.log(text);
	}
}

function onHemlFailure(reply) {
    alert("The Heml SPARQL query failed. Perhaps you do not have an Internet connection:n" + reply);
    // do something more interesting, like putting an x through the map. or making
    // a popup
}

function labelFromJson(bindings, langPrefs) {
	toConsole(langPrefs);
	var lang;
	for (languageArrayRow in langPrefs) {
		toConsole(langPrefs[languageArrayRow]);
		lang = langPrefs[languageArrayRow][1]; 
		toConsole("trying " + lang);
        for (row in bindings) {
	        if (row != 'remove') {
            //toConsole(json.results.bindings[row]);
            if (bindings[row].label["xml:lang"] == lang) return bindings[row].label["value"];
}
        }
    }
    return null;
}

var successfulCallbackModelForTitles = function(className, htmlNode, langPrefs) {
    //use '' for root
    this.htmlNode = htmlNode;
    this.langPrefs = langPrefs;
    var me = this;
    this.makeRefTitles = function(json) {
	    var bindings = new Array();
	    bindings = json.results.bindings;
	    toConsole(bindings);
        var numberOfEntries = json.results.bindings.length;
        if (numberOfEntries == 0) {
            alert("No labels have been provided for this entry.");
        } else {
            htmlNode.appendChild(document.createTextNode(labelFromJson(bindings, langPrefs)));
        }
    }
}

var callbackModelForTextLink = function(htmlNode) {
    //use '' for root
    this.htmlNode = htmlNode;
    var me = this;
    this.makeTextLink = function(json) {
	//give me 1) Perseus text 2) first Chunk, etc.
           // var urlBase = json.results.bindings[i].label.value;
            var source = 'http://heml.mta.ca/hopper/xmlchunk.jsp?doc=Perseus%3Atext%3A2009.01.0001%3Apage%3D5a';
            var xslt = 'http://heml.mta.ca/crossmantest/xslt/tei-fragment-to-xhtml-quotation.xsl';//json.results.bindings[i].xslAddress.value;
            htmlNode.className = 'referenceTitleClass';
          //  alert("mode it here");
			htmlNode.onclick = function() {
				doXMLHttp(xslt, source, htmlNode);
            }
       
    }
}

$(document).ready(function() {
    toConsole($("[data-ctsurn]"));
    $("[data-ctsurn]").each(function(index) {
        urn = $(this).attr("data-ctsurn");
        toConsole(urn);

         myregexp = /cts:greekLit:([A-Z]*\d*):([A-Z]*\d*)(.*)/i
        mymatch = myregexp.exec(urn);
        toConsole(mymatch);
        if (mymatch != null) {
            bookLine1 = mymatch[3];
            toConsole("bookLine1: " + bookLine1);
            bookline2 = bookLine1.replace(/:/g, '.').substring(1);
            toConsole("bookline2: " + bookline2);
            var x = document.createElement('span');
            x.className = 'ctsurn_author';
            var y = document.createElement('span');
            y.className = 'ctsurn_title';
            var a = document.createElement('span');
         //   a.className = 'klink';
            $(this).val('');
            $(this).append(a);
            a.appendChild(x);
            a.appendChild(document.createTextNode(' '));
            a.appendChild(y);
            
            if (bookline2 != '') {
                var z = document.createElement('span');
                z.className = 'ctsurn_ref';
                z.appendChild(document.createTextNode(bookline2));
               a.appendChild(document.createTextNode(' '));
                a.appendChild(z);
               
            }
            var author = "<http://heml.mta.ca/text/urn/" + mymatch[1] + ">";
            // author URL
            var work = "<http://heml.mta.ca/text/urn/" + mymatch[1] + "/" + mymatch[2] + ">";
            // work URL
            var queryString2 = "select ?label where {" + author + " rdfs:label ?label. }"
            var langPrefs = getPreferencesFromCookie();

            myTry = new successfulCallbackModelForTitles("author", x, langPrefs);
            hq2 = new Heml.SparqlQuery(endpoint, queryString2, onHemlFailure, myTry.makeRefTitles);
            hq2.performQuery();
            myTry = new successfulCallbackModelForTitles("title", y, langPrefs);
            var queryString = "select ?label where {" + work + " rdfs:label ?label. }"
            hq = new Heml.SparqlQuery(endpoint, queryString, onHemlFailure, myTry.makeRefTitles);
            hq.performQuery();
            queryString3 = "select ?perseusText  where {" + work + " rdfs:label ?perseusText. }";
            myTry = new callbackModelForTextLink(a);
            hq3 = new Heml.SparqlQuery(endpoint, queryString3, onHemlFailure, myTry.makeTextLink);
            hq3.performQuery();
        }
    });
});

function doXMLHttp(xslURL, documentURL, parentNode) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", xslURL, false);
    xmlhttp.send(null);
    if (xmlhttp.status == 200)
    alert(xmlhttp.responseText);  
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


