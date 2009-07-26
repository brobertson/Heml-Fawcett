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
	if ( langPrefs == null ){//TODO finish this thought
		getLangs(subject, predicate, endpoint, onFail, function(json){
				var msg = 'You have no language preferences. These are your options ';
				for ( var i=0; i<json.results.bindings.length; i++ ){
					msg += ' # ' + json.results.bindings[i].lang.value;
				}
				alert(msg);
				});

	}else{
		//get into form that will please SPARQL
		langPrefs = langPrefs.replace(/','/g,',');
		langPrefs = langPrefs.substring(1, langPrefs.length-1);

		var queryStr = 'PREFIX : <http://example/ns#> PREFIX hemlFunc: <java:org.heml.sparql.> SELECT ?aa WHERE { '+subject+' '+predicate+' ?aa . FILTER(hemlFunc:LangPrefsFilter(?aa, "' + langPrefs + '"))}ORDER BY(hemlFunc:LangPrefsOrder(?aa, "' + langPrefs + '")) LIMIT 1';

		alert(queryStr);
		var query = new Heml.SparqlQuery(endpoint, queryStr, onFail, onSuccess);
		query.performQuery();
	}
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
				var query = new Heml.SparqlQuery(endpoint, queryStr, onFail, onSuccess);
				query.performQuery();
			}
		});
}

/**
 * Retuns language preferences as stored in cookie. If none were found, returns
 * null.
 */
function getPreferencesFromCookie(){
	var cookies = document.cookie.split(';');
	var codes, langs, threeCodes;
	for(var i=0 ; i < cookies.length ; i++) {
		var c = cookies[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf('languagePreferences_codes=') == 0) {codes = c.substring(26,c.length).split(',') };
		if (c.indexOf('languagePreferences_langs=') == 0) {langs = c.substring(26,c.length).split(',') };
		if (c.indexOf('languagePreferences_threeCodes=') == 0) {threeCodes = c.substring(31,c.length).split(',') };
	}
	// We treat missing any of the three cookies as not having any cookie at all
	if ( codes == null || langs == null || threeCodes == null )
		return [];

	var returnArray = new Array();
	for ( var i=0; i<codes.length; i++ ){
		returnArray[i] = [codes[i], threeCodes[i], langs[i]];
	}
	return returnArray;
}

function init(){
//	document.cookie = "languagePreferences='dd','fd','sn','se','ls'";

//	getLangs(':s3', 'rdfs:label', 'http://localhost:2030/sparql/read', onHemlFailure, function(json){
//			console.dir(json);
//			});


//	getLangs(':s3', 'rdfs:label', 'http://localhost:2030/sparql/read', onHemlFailure, function(json){
//			alert('ok');
//			console.dir(json);
//		});
}
