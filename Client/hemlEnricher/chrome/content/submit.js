submitClicked = function() {
	//alert('Grab content from "' +content.document.location.href+'"');
	//alert('Found "' + content.getSelection().toString()+'"');

	/*var event_yui = document.getElementById("event_yui");
	var event_yui_document = event_yui.contentWindow.document;
	var treeDiv = event_yui_document.getElementById('treeDiv1');*/
	var selectedEvent = 'http://heml.mta.ca/wiki/index.php/Special:URIResolver/Unification_of_Egypt';

	
	alert(selectedEvent);

	// FIXME - this is a temporary reference list (a simple XUL
	// document). It will eventually be of similar (or same) form to event
	// yui
	var ref_yui = document.getElementById("ref_yui");
	var selectedRef = ref_yui.contentWindow.document.getElementById("ref_list").selectedItem.label;
	alert(selectedRef);

	alert(getRange());
}
