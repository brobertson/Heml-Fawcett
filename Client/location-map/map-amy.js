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

var map = null;
var maxBounds = new OpenLayers.Bounds(-180, -90, 180, 90);
var maxView = new OpenLayers.Bounds(-180, -90, 180, 90);

var DEBUG = false;
var endpoint = "http://heml.mta.ca/joseki3/sparql/read";
var locationArray = new Array();
OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '20';

/*
 * Layer style
 */
// we want opaque external graphics and non-opaque internal graphics

var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
layer_style.fillOpacity = 0.4;
layer_style.graphicOpacity = 1;

/*
 * Red style
 */

var style_red = OpenLayers.Util.extend({}, layer_style);
style_red.strokeColor = "red";
style_red.fillColor = "red";
style_red.graphicName = "circle";
style_red.pointRadius = 5;
style_red.strokeWidth = .7;
style_red.rotation = 45;
style_red.strokeLinecap = "butt";

/*
 * Blue style
 */

var style_blue = OpenLayers.Util.extend({}, layer_style);
style_blue.strokeColor = "blue";
style_blue.fillColor = "blue";
style_blue.graphicName = "circle";
style_blue.pointRadius = 5;
style_blue.strokeWidth = .7;
style_blue.rotation = 45;
style_blue.strokeLinecap = "butt";

var polygonLayer = new OpenLayers.Layer.Vector("Heml Locations");

var heySuccess = function(json) {
	alert("did it man! " + "ho man" + json);
}

var heyFailure = function() {
	alert("boo, failure");
}

var populateMapWithJson = function(json) {
	var numberOfEntries = json.results.bindings.length;
	for (var i = 0; i < numberOfEntries; i++) {
		var dotStyle = style_red;
		if (json.results.bindings[i].keyedLocation) {
			if (json.results.bindings[i].keyedLocation.value === "true") {
				dotStyle = style_blue;
			}
		}
		polygonLayer.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(json.results.bindings[i].longitude.value, json.results.bindings[i].latitude.value), {url: json.results.bindings[i].location.value, label: json.results.bindings[i].locationLabel.value}, dotStyle)]);
	}
}

function onHemlFailure(reply) {
	alert("The Heml SPARQL query failed. Perhaps you do not have an Internet connection:\n" + reply);
	// do something more interesting, like putting an x through the map. or making
	// a popup
}

function getNewOriginDocument(originUri) {
	hq = new Heml.SparqlQuery(endpoint, "SELECT DISTINCT ?location ?locationLabel ?latitude ?longitude ?keyedLocation WHERE {?event hemlRDF:LocationRef ?location. ?location rdfs:label ?locationLabel. ?location geo:lat ?latitude. ?location geo:long ?longitude.  OPTIONAL { ?event hemlRDF:Origin " + originUri + ". LET (?keyedLocation := 'true')} FILTER (hemlFunc:LangPrefsFilter(?locationLabel, 'jpn;ja,fre/fra;fr,eng;en'))}ORDER BY (hemlFunc:LangPrefsOrder(?locationLabel, 'jpn;ja,fre/fra;fr,eng;en'))", onHemlFailure, populateMapWithJson);
	if (true) {
		alert("query string: " + hq.getQueryString());
		alert("endpoint: " + hq.getEndpoint());
		alert("success function: " + hq.getSuccessFunction());
		alert("failure function: " + hq.getFailureFunction());
	}
	hq.performQuery();
}

// provide a onHemlSuccess function which handles the 'success' calback for the 
//and deals the with resulting json Object.

function init() {
	var mapOptions = {
		maxResolution: 'auto',
		maxExtent: maxView,
		restrictedExtent: maxBounds
	}
	map = new OpenLayers.Map('map', mapOptions);
	var ol_wms = new OpenLayers.Layer.WMS(
		"OpenLayers WMS", 
		"http://labs.metacarta.com/wms/vmap0", 
		{layers: 'basic'}
	);
	var jpl_wms = new OpenLayers.Layer.WMS(
		"NASA Global Mosaic", 
		"http://t1.hypercube.telascience.org/cgi-bin/landsat7", 
		{layers: "landsat7"}
	);
	map.addLayers([ol_wms, jpl_wms]);
	map.addControl(new OpenLayers.Control.LayerSwitcher());

	// create an overview map control with the default options
	var overview1 = new OpenLayers.Control.OverviewMap();
	map.addControl(overview1);
	var options = {
		hover: false,
		clickout: false,
		toggle: false,
		onSelect: onFeatureSelect,
		onUnselect: onFeatureUnselect
	};
	// polygonLayer.addFeatures(locationArray);
	map.addLayer(polygonLayer);
	var select = new OpenLayers.Control.SelectFeature(polygonLayer, options);
	map.addControl(select);
	select.activate();
	getNewOriginDocument("<http://www.heml.org/docs/samples/heml/2002-05-29/late_repub.xml>");
	//map.zoomToMaxExtent();
	map.zoomToExtent(new OpenLayers.Bounds(-130,-10,35,70)); 
}

function onFeatureSelect(feature) {
	//var popupCloseBox = false;
	selectedFeature = feature;
	var locationLabel = feature.attributes.label;
	var locationUrl = feature.attributes.url;
	popup = new OpenLayers.Popup(feature.attributes.url, feature.geometry.getBounds().getCenterLonLat(), new OpenLayers.Size(null, null), "<div style='font-size:12px; font-weight: bold; text-align: center; background: transparent; padding:0; margin:0'>" + locationLabel + "<!--br />URL:" + locationUrl + "</div -->", false);
	//popup = new OpenLayers.Popup.Anchored(feature.attributes.url, feature.geometry.getBounds().getCenterLonLat(), new OpenLayers.Size(null, 14), "<div style='font-size:12px; font-weight: bold; text-align: center'>" + locationLabel + "<!--br />URL:" + locationUrl + "</div -->", null, popupCloseBox, onPopupClose);
	feature.popup = popup;
	map.addPopup(popup);
	feature.autoDestroy = window.setTimeout(function() {
		map.removePopup(feature.popup);			
		}, 2000);
	listEventsForLocation(locationUrl, locationLabel);
}

//function onPopupClose(evt) {
//	selectControl.unselect(selectedFeature);
//}

function onFeatureUnselect(feature) {
	map.removePopup(feature.popup);
	feature.popup.destroy();
	feature.popup = null;
}

function listEventsForLocation(url, label) {
	var label = label;
	var listEventsFromJson = function(json) {
		var theHeader = document.getElementById("locationLabel");
		headerText = theHeader.childNodes[0];
		if (headerText != null) {
			theHeader.removeChild(headerText);
		}
		var theNewHeaderText = document.createTextNode(label);
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
		for (var i = 0; i < eventsLength; i++) {
			try {
				if (json.results.bindings[i].startDate.value != null) {
					var prettyDate = formatDate(json.results.bindings[i].startDate.value);
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

var queryString = "SELECT DISTINCT ?event ?eventLabel ?startDate ?keyed ?url ?refURI WHERE {?event hemlRDF:LocationRef <" + url + ">. ?event rdfs:label ?eventLabel. {?event hemlRDF:SimpleDate ?startDate. ?event hemlRDF:EarliestTime  ?et.} UNION {?event hemlRDF:DateRange ?dr. ?dr hemlRDF:StartingDate ?startDate. ?event hemlRDF:EarliestTime ?et.}  OPTIONAL { ?event hemlRDF:Origin <lccn://77484448#>. LET (?keyed := 'true')}  OPTIONAL {?event hemlRDF:Origin <lccn://77484448#>. ?event hemlRDF:Evidence ?refURI.} FILTER (hemlFunc:LangPrefsFilter(?eventLabel, 'jpn;ja,fre/fra;fr'))} ORDER BY ?et";
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
			for (var i = 1; i < match.length; i++) {
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
	//var dateElementArray = dateIn.split("-"); //make an array of bits of iso dates
	//dateElementArray[0];
}

//what does this belong to?
eventsQuery.performQuery();
}
