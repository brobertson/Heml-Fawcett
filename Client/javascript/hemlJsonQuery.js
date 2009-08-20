/**********************************************************
  Copyright (c) 2008
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

/**
This function encapsulates much of the query process, and requires only two arguments: the service URL, and the query string.

You must create an onHemlSuccess(json) callback handler in your code to deal
with the result
**/

var Heml  = {}; // Heml namespace


//function generateQueryString(startDate, endDate, location, participant, keyword, freeStringSearchKeyinLabel) {
//}


Heml.SparqlQuery = function(endpoint, queryString, failureFunction, successFunction) {
	//---------------
	// private fields
	var _queryString = queryString;
	var _endpoint = endpoint;
	var _successFunction = successFunction;
	var _failureFunction = failureFunction;
	 sparqler = new SPARQL.Service(_endpoint);
sparqler.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
sparqler.setPrefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
sparqler.setPrefix("hemlRDF", "http://www.heml.org/rdf/2003-09-17/heml#");
sparqler.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
sparqler.setPrefix("geo", "http://www.w3.org/2003/01/geo/wgs84_pos#");
sparqler.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
sparqler.setMethod("GET");
var query = sparqler.createQuery();

	//----------
	// accessors
	this.getEndpoint = function() { return _endpoint; };
	this.getDefaultGraphs = function() { return _default_graphs; };
	this.getQueryString = function() { return _queryString; };
	this.getFailureFunction = function() { return _failureFunction; };
	this.getSuccessFunction = function() { return _successFunction; };
	// mutators	
	this.setEndpoint = function(e) { this._endpoint = e; };
	this.setQueryString = function(q) {this._queryString = q; };
	// functors
	this.performQuery = function() {
query.query(_queryString,
    {failure: _failureFunction, success:  function(json) {
	_successFunction(json);
	}
	
    }
		);
	}

	
	
}
/*
function getHemlQuery(service, sparqlQueryString) {
 sparqler = new SPARQL.Service(service);
sparqler.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
sparqler.setPrefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
sparqler.setPrefix("hemlRDF", "http://www.heml.org/rdf/2003-09-17/heml/");
sparqler.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
sparqler.setPrefix("geo", "http://www.w3.org/2003/01/geo/wgs84_pos#");
sparqler.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//sparqler.wantOutputAs("application/json"); // for now we only do JSON
//I'm not sure why, but 'POST' hangs when called from third-party machines
//It believes the content-type is not properly encoded
sparqler.setMethod("GET");
var query = sparqler.createQuery();
query.query(sparqlQueryString,
{failure: onHemlFailure, success:  onHemlSuccess(json)}
		);
}

function onHemlFailure() {
alert("The Heml SPARQL query failed");
}

function onHemlSuccess(json) {
    alert ("The Heml SPARQL query succeeded");
}
*/
