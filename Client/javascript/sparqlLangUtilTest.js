/*
 * Here we make calls to sparql utility function for illustration in
 * sparqlLangUtilTest.html
 */
function getLangsTEST(){
	getLangs(':s3',
		'rdfs:label',
		'http://localhost:2030/sparql/read',//FIXME http://heml.org/...
		function(){ alert('Failure executing SPARQL query!'); },
		function(json){
			var returnString='';
			for ( var i=0 ; i<json.results.bindings.length ; i++ ){
				returnString += json.results.bindings[i].lang.value+',';
			}
			returnString = returnString.substring(0,returnString.length-1);
			alert(returnString);
		});
}

function query_BestLanguageMatchTEST(){
	query_BestLanguageMatch(':s3', 
		'rdfs:label', 
		'http://localhost:2030/sparql/read',
		function(){ alert('Failure executing SPARQL function!') },
		function(json){
			if ( json.results.bindings.length == 0 ) { alert('No available langauges match your preferences'); }
			else{
				alert( json.results.bindings[0].aa.value );
			}
		});
}

function initTEST(){
	document.cookie="HEML_languagePreferences_codes='eng-us','fre/fra-ca','ger/deu','eng-uk','fre/fra','eng'; expires=Thu, 25 Aug 2010 19:04:12 GMT";
	document.cookie="HEML_languagePreferences_langs='English-us','French-ca','German','English-uk','French','English'; expires=Thu, 25 Aug 2010 19:04:12 GMT";
	document.cookie="HEML_languagePreferences_twoCodes='en-us','fr-ca','de','en-uk','fr','en'; expires=Thu, 25 Aug 2010 19:04:12 GMT";
}
