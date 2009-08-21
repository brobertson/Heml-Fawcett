//global variable to allow console inspection of tree:
var tree;
var DEBUG = false;
var theModelChildQuery = "SELECT DISTINCT  ?event ?eventLabel ?comprises  ?et WHERE { ?event a hemlRDF:Event. ?event rdfs:label ?eventLabel. ?event hemlRDF:EarliestTime ?et. OPTIONAL {?event  hemlRDF:Origin ?origin.}  ?outer hemlRDF:comprisesEvent ?event.  OPTIONAL {?event hemlRDF:comprisesEvent ?inner. LET (?comprises := true)} } ORDER BY ?et"


var theRootQuery = "SELECT DISTINCT  ?event ?eventLabel ?comprises  ?et WHERE { ?event a hemlRDF:Event. ?event rdfs:label ?eventLabel. ?event hemlRDF:EarliestTime ?et. OPTIONAL {?event  hemlRDF:Origin ?origin.} OPTIONAL { ?outer hemlRDF:comprisesEvent ?event}  OPTIONAL {?event hemlRDF:comprisesEvent ?inner. LET (?comprises := true)} FILTER(!bound(?outer)) } ORDER BY ?et"

var theQueryPreamble =  "SELECT DISTINCT  ?event ?eventLabel ?comprises  WHERE { ?event a hemlRDF:Event. ?event rdfs:label ?eventLabel. OPTIONAL {?event  hemlRDF:Origin ?origin.";

var theTopLevelQueryMiddle = "OPTIONAL { ?outer hemlRDF:comprisesEvent ?event} "
    
var theQueryConclusion = "OPTIONAL {?event hemlRDF:comprisesEvent ?inner. LET (?comprises := true)} FILTER(!bound(?outer)) }"

//var theQuery = theNewQuery;

//anonymous function wraps the remainder of the logic:

var successfulCallbackModel =  function(node, finishedCallbackFunction) {//use '' for root
    this.node = node;
    this.atRoot = false;
    if (this.node === '') {this.atRoot = true;}
    //this.completedCallbackFunction = completedCallbackFunction;
    //this.nodeURL = node.data;
    this.finishedCallbackFunction = finishedCallbackFunction;
    var me=this;
   //console.log("building a scm with node " + node);
    this.populateNodeWithJson = function(json){
	
	//alert("nodeURL is: " + me.nodeURL);
	if (me.node === '') {//empty string is the magic value for root
	    me.node = tree.getRoot();
	}
	
	//console.log("calling pnwj");
	 for (var i = 0; i < json.results.bindings.length; i++) {
	text = json.results.bindings[i].eventLabel.value;
        url = json.results.bindings[i].event.value;	
	//Determine if the OPTIONAL field 'comprises' is set to 'true'
	//If it is, we record this in the boolean 'hasChildren'
	//Because it is OPTIONAL, it might not exist at all
	var hasChildren = false;
    if (json.results.bindings[i].comprises == undefined) 
	{hasChildren = false;}
	else if (json.results.bindings[i].comprises.value == "true") {
	//console.log(url, "has children");
	hasChildren = true;}
	
    treeNodeMaker(text, hasChildren, url, me.node);
    
    }
    if (me.atRoot) {//These functions need to be called the first time
	//The tree is drawn, but not later.
           // Expand and collapse happen prior to the actual expand/collapse,
       // and can be used to cancel the operation
       tree.subscribe("expand", function(node) {
         //     console.log(node.index + " was expanded", "info", "example");
              // return false; // return false to cancel the expand
           });

       tree.subscribe("collapse", function(node) {
           //   console.log(node.index + " was collapsed", "info", "example");
           });

       // Trees with TextNodes will fire an event for when the label is clicked:
       tree.subscribe("labelClick", function(node) {
             // console.log(node.index + " label was clicked", node.data, "example");
           });
       	tree.draw();
    }
    else {//this ensures that the 'wait' spinner continues spinning until the  last minute.
	finishedCallbackFunction();
    }

    }
    }




var onHemlFailure = function(message) {
alert("The Heml SPARQL query failed. Perhaps you do not have an Internet connection" + message);
}


function getResult(node, loadComplete) {
    var nodeURL = '';
    var appropriateQuery = theRootQuery;
    if (!(node === '')) {
	nodeURL = node.data;
appropriateQuery = theModelChildQuery.replace(/\?outer/,"<" + nodeURL + ">");
    }
    var myTry = new successfulCallbackModel(node, loadComplete);
// console.log("new query: " + appropriateQuery);
    hq = new Heml.SparqlQuery("http://heml.mta.ca/joseki3/sparql/read", appropriateQuery, onHemlFailure, myTry.populateNodeWithJson);
   if (DEBUG) {
    alert("query string: " + hq.getQueryString());
    alert("endpoint: " + hq.getEndpoint());
    alert("success function: " + hq.getSuccessFunction());
    alert("failure function: " + hq.getFailureFunction());
    }
    hq.performQuery();
}
	//function to initialize the tree:
    function treeInit() {
        buildTopTextNodeTree();
    }
    
    function treeNodeMaker(text, hasChildren, url, parent) {
	//alert(tree);
	var tmpNode = new YAHOO.widget.TextNode(text, parent, false);
	tmpNode.isLeaf = !hasChildren;
	tmpNode.data = url;
    }
	//Function  creates the tree and 
	//builds between 3 and 7 children of the root node:
    function buildTopTextNodeTree() {
		tree = new YAHOO.widget.TreeView("treeDiv1");
		tree.setDynamicLoad(loadNodeData, 0);

       getResult('');//empty string is magic code for root of tree

 
	}

	function loadNodeData(node, fnLoadComplete) {
	    getResult(node, fnLoadComplete);
	}


	//Add an onDOMReady handler to build the tree when the document is ready
    YAHOO.util.Event.onDOMReady(treeInit);
