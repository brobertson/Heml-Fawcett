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
 * Used to find the best matching triple when the object might exist in multiple
 * languages. We pass this function an array of languge codes (as strings).
 * Triples that match the given subject and predicate are then compared to the
 * language preferences. The best match is returned. If we do not find a
 * match, we return the empty result set.
 * @param {string} The subject of the triple for which we are searching.
 * @param {string} The predicate of the triple for which we are searching.
 * @param {string[]} The list of language codes for languages in which we prefer
 * to get a result. Information is more likely to get returned in languages
 * near the front of this array.
 * @param {string} Service ref used for queries.
 * @param {function()} The function that gets called on query failure
 * @param {function({json})} The function that gets called on query success.
 * The json object will have a single value stored in 
 * <code>json.results.bindings[0].aa.value</code> if a match is found. (Remember
 * if we did not find a match, <code>json.results.binding</code> will have
 * length 0. 
 */
function query_BestLanguageMatch(subject, predicate, userLangs, endpoint, onFail, onSuccess){
	if ( subject == null || predicate == null ){
		// subject and predicate must both be specified
		alert('Subject and predicate must be specified');
	}

	var queryStr = 'PREFIX : <http://example/ns#> PREFIX hemlFunc: <java:org.heml.sparql.> SELECT ?aa WHERE { '+subject+' '+predicate+' ?aa . FILTER(hemlFunc:LangPrefsFilter(?aa, "' + userLangs + '"))}ORDER BY(hemlFunc:LangPrefsOrder(?aa, "' + userLangs + '")) LIMIT 1';
	
	alert(queryStr);
	var query = new Heml.SparqlQuery(endpoint, queryStr, onFail, onSuccess);
	query.performQuery();
}

/**
 * Calls query_BestLanguageMatch with rdfs:label as the predicate. If we get a
 * match, return it. If we get the empty result set, we default to the original
 * language.
 */
function query_BestLabel(subject, userLangs, endpoint, onFail, onSuccess){
	if ( subject == null ){
		// subject be specified
		alert('Subject must be specified');
	}
	query_BestLanguageMatch(subject, 'rdfs:label', userLangs, endpoint, onFail, function(json){
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
