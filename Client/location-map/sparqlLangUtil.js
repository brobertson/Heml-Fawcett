/**
 * Sparql utility methods used when the is a heavy language component in the
 * queried information.
 */

/**
 * Retrieves the language for which we have tags on the specified triple data.
 * @param {string} The subject of triples in which we are interested. If null,
 * will match any subject.
 * @param {string} The predicate of triples in which we are interested. If null,
 * will match any predeicate.
 * @param {string} Service ref used for queries
 * @param {function()} The function that gets called on query failure
 * @param {function({json})} The function that gets called on query success.
 * Languages are found in the <code>json.results.bindings[i].lang.value</code>
 */
function getLangs(subject, predicate, endpoint, onFail, onSuccess){

	if ( subject == null ){ subject = '?aa'; }
	if ( predicate == null ){ predicate = '?bb'; }

	// note that prefixes are handled in Heml.SparqlQuery
	var queryString = 'PREFIX : <http://example/ns#> SELECT DISTINCT ?lang WHERE { ' + subject + ' ' + predicate + ' ?cc . LET ( ?lang := LANG(?cc) ) }';

	var langQuery = new Heml.SparqlQuery(endpoint, queryString, onFail, onSuccess);
	langQuery.performQuery();
}

/**
 * Alias for getLangs(subject, 'rdfs:label', endpoint, onFail, onSuccess)
 */
function getLabelLangs(subject, endpoint, onFail, onSuccess)
	{ getLangs(subject, 'rdfs:label', endpoint, onFail, onSuccess); }

function onHemlFailure() 
	{ alert("The Heml SPARQL query failed."); }

/**
 * <p> Used to find the best matching triple when the object might exist in
 * multiple languages. </p>
 *
 * <p> We read our preferred languages from a cookie. If no language preferences
 * can be found, we find what languages are available and have to user select
 * one. </p>
 *
 * <p> If we have language preferences, we get all triples that match our search
 * and select the best match. </p>
 *
 * @param {string} The subject of the triple for which we are searching.
 * @param {string} The predicate of the triple for which we are searching.
 * @param {string} Service ref used for queries.
 * @param {function()} The function that gets called on query failure
 * @param {function({json})} The function that gets called on query success.
 * The json object will have a single value stored in 
 * <code>json.results.bindings[0].aa.value</code> if a match is found. (Remember
 * if we did not find a match, <code>json.results.binding</code> will have
 * length 0. 
 */
function query_BestLanguageMatch(subject, predicate, endpoint, onFail, onSuccess){
	if ( subject == null || predicate == null ){
		// subject and predicate must both be specified
		alert('Subject and predicate must be specified');
	}

	var langPrefs = getPreferencesFromCookie();
	if ( langPrefs == null ){
		Ext.Msg.alert('Warning!', 'You have no language preferences. Using default list of some common lanugages.');
		langPrefs = defaultLanguages();
	}

	var queryStr = 'PREFIX : <http://example/ns#> PREFIX hemlFunc: <java:org.heml.sparql.> SELECT ?aa WHERE { '+subject+' '+predicate+' ?aa . FILTER(hemlFunc:LangPrefsFilter(?aa, "';

	for ( var i=0; i<langPrefs.length; i++ ){
		queryStr += langPrefs[i][0] + ';' + langPrefs[i][1] + ',';
	}
	// get rid of trailing comma
	queryStr = queryStr.substring(0, queryStr.length - 1);

	queryStr += '"))}ORDER BY(hemlFunc:LangPrefsOrder(?aa, "' 

	for ( var i=0; i<langPrefs.length; i++ ){
		queryStr += langPrefs[i][0] + ';' + langPrefs[i][1] + ',';
	}
	// get rid of trailing comma
	queryStr = queryStr.substring(0, queryStr.length - 1);
		
	queryStr += '")) LIMIT 1';

	console.info(queryStr);

	alert(queryStr);

	var query = new Heml.SparqlQuery(endpoint, queryStr, onFail, onSuccess);
	query.performQuery();
}

/**
 * Calls query_BestLanguageMatch with rdfs:label as the predicate. If we get a
 * match, return it. If we get the empty result set, we default to the original
 * language.
 */
function query_BestLabel(subject, endpoint, onFail, onSuccess){
	if ( subject == null ){
		// subject be specified
		alert('Subject must be specified');
	}
	query_BestLanguageMatch(subject, 'rdfs:label', endpoint, onFail, function(json){
			if( json.results.bindings.length == 1 ){
				onSuccess(json);
			}
			else{
				var queryStr = 'PREFIX : <http://example/ns#> PREFIX hemlRDF: <http://www.heml.org/rdf/2003-09-17/heml#> SELECT ?aa WHERE { :s3 hemlRDF:originalLanguage ?aa }';
				var query = new Heml.SparqlQuery(endpoint, queryStr, onFail, function(json){
					if ( json.results.bindings.length == 1 ){
						onSuccess(json);
					}
					else{
						Ext.msg.alert("Could not find a result matching language preferences.");
					}
					});
				query.performQuery();
			}
		});
}

/**
 * Retuns language preferences as stored in cookie. If none were found, returns
 * null.<br/>
 * We get preferences in the form of an array. Languages are more preferred as
 * they approach the front of the array. Each element of the array is of the
 * form "<alpha-3 code>[/<alpha-2 code>], <alpha-2 code>, <English name for
 * language>"
 */
function getPreferencesFromCookie(){
	var cookies = document.cookie.split(';');
	var codes, langs, twoCodes;
	for(var i=0 ; i < cookies.length ; i++) {
		//var c = decodeURIComponent(cookies[i]);
		var c = encodeFromCookie(cookies[i]);
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf('HEML_languagePreferences_codes=') == 0) {
			codes = c.substring(31,c.length).split("','") 
		};
		if (c.indexOf('HEML_languagePreferences_langs=') == 0) {
			langs = c.substring(31,c.length).split("','") 
		};
		// We might have an empty alpha-2 code
		if (c.indexOf('HEML_languagePreferences_twoCodes=') == 0) {
			twoCodes = c.substring(34,c.length).split("','") 
		};
	}

	
	// We treat missing any of the three crumbs as not having any cookie at all
	if ( codes == null || langs == null || twoCodes == null )
		return [];

	var returnArray = new Array();
	for ( var i=0; i<codes.length; i++ ){
		returnArray[i] = [codes[i], twoCodes[i], langs[i]];
	}
	// fist elements have a leading "'"
	returnArray[0][0] = returnArray[0][0].substring(1);
	returnArray[0][1] = returnArray[0][1].substring(1);
	returnArray[0][2] = returnArray[0][2].substring(1);

	// last elements have a trailing "'"
	var last = returnArray.length - 1; 
	returnArray[last][0] = returnArray[last][0].substring(0,returnArray[last][0].length - 1);
	returnArray[last][1] = returnArray[last][1].substring(0,returnArray[last][1].length - 1);
	returnArray[last][2] = returnArray[last][2].substring(0,returnArray[last][2].length - 1);

	return returnArray;
}

function mySuccess(json){
	console.dir(json);
}

/**
 * The semi-colon is a pain
 */
function encodeToCookie(s){ return s.replace( /;/g, '%3B' ); }
function encodeFromCookie(s){ return s.replace( /%3B/g, ';' ); }

function defaultLanguages(){
	return new Array([
			['eng', 'en', 'English'],
			['fre/fra', 'fr', 'French'],
			['spa', 'es', 'Spanish%3B Castilian'],
			['ger/deu', 'de', 'German'],
			['ita', 'it', 'Italian']
			]);
}

function init(){
	document.cookie="HEML_languagePreferences_codes='eng-us','lat','fre/fra'; expires=Thu, 05 Aug 2010 19:04:12 GMT";
	document.cookie="HEML_languagePreferences_langs='English-us','Latin','French'; expires=Thu, 05 Aug 2010 19:04:12 GMT";
	document.cookie="HEML_languagePreferences_twoCodes='en-us','la','fr'; expires=Thu, 05 Aug 2010 19:04:12 GMT";
	query_BestLanguageMatch(':s3', 'rdfs:label', 'http://localhost:2030/sparql/read', onHemlFailure, mySuccess);
}
