/**
 * These functions were taken from the xpather test page
 */


//
// since we always want our xpath to be relative to be absolute, this will
// do us just fine. The functions call ones in xpather.js
function simpleGenerateXPath(aNode) {
    prepareKwds();
    return generateXPath(aNode, null, null, prepareKwds());
}

function getResult(event) {
    //netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect'); 
    //var kwds;
    //prepareKwds();
    var path = simpleGenerateXPath(event.target);
    alert("my you're alert: " + path);
}

function getRange(event) {
	var event_yui = document.getElementById('event_yui');
	var content_document = event_yui.contentWindow.document;
	var content_window = event_yui.contentWindow.content.window;

    var userSelection;
    if (content_window.getSelection) {
	userSelection = content_window.getSelection();
        }
     else if (content_document.selection) { // should come last; Opera!
	userSelection = content_document.selection.createRange();
     }
     var startPath = simpleGenerateXPath(userSelection.anchorNode);
     var endPath = simpleGenerateXPath(userSelection.focusNode);

	 var returnArray = new Array();
	 returnArray[0] = startPath;
	 returnArray[1] = endPath;
	 return returnArray;
}
