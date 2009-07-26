/*
 * Ext JS Library 3.0 RC2
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * An interface for the user to select language preferences. We store
 * preferences in ISO 639-1. 
 *
 * Note that a language can exist multiple times in the list. This is to allow
 * languages to be defined with different extensions (e.g. en-us and en-uk).
 * We let the empty extension match any extension. For example, 'en-uk' will
 * not match 'en-us', while both 'en-us' and 'en' will. If the user feels
 * it important to restrict their matching with a language extension, we trust
 * that they are aware of the standard extensions for their language. The only
 * varification we provide is that they have enter only alphabetic characters.
 *
 * TODO fix any scope issues there may be in here
 */

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';

	var displayButton = new Ext.Button({
		text: "Edit Preferred Languages",
		renderTo: 'popupTrigger',
		handler: function(){
			generatePopup();
		}
	});
});

//2D array with ISO 639-1 codes, ISO 639-2 codes, and languages
var ds = [
	['aa', 'aar', 'Afar'],
	['ab', 'abk', 'Abkhazian'],
	['af', 'afr', 'Afrikaans'],
	['ak', 'aka', 'Akan'],
	['sq', 'alb/sqi', 'Albanian'],
	['am', 'amh', 'Amharic'],
	['ar', 'ara', 'Arabic'],
	['an', 'arg', 'Aragonese'],
	['hy', 'arm/hye', 'Armenian'],
	['as', 'asm', 'Assamese'],
	['av', 'ava', 'Avaric'],
	['ae', 'ave', 'Avestan'],
	['ay', 'aym', 'Aymara'],
	['az', 'aze', 'Azerbaijani'],
	['ba', 'bak', 'Bashkir'],
	['bm', 'bam', 'Bambara'],
	['eu', 'baq/eus', 'Basque'],
	['be', 'bel', 'Belarusian'],
	['bn', 'ben', 'Bengali'],
	['bh', 'bih', 'Bihari'],
	['bi', 'bis', 'Bislama'],
	['bs', 'bos', 'Bosnian'],
	['br', 'bre', 'Breton'],
	['bg', 'bul', 'Bulgarian'],
	['my', 'bur/mya', 'Burmese'],
	['ca', 'cat', 'Catalan; Valencian'],
	['ch', 'cha', 'Chamorro'],
	['ce', 'che', 'Chechen'],
	['zh', 'chi/zho', 'Chinese'],
	['cu', 'chu', 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic'],
	['cv', 'chv', 'Chuvash'],
	['kw', 'cor', 'Cornish'],
	['co', 'cos', 'Corsican'],
	['cr', 'cre', 'Cree'],
	['cs', 'cze/ces', 'Czech'],
	['da', 'dan', 'Danish'],
	['dv', 'div', 'Divehi; Dhivehi; Maldivian'],
	['nl', 'dut/nld', 'Dutch; Flemish'],
	['dz', 'dzo', 'Dzongkha'],
	['en', 'eng', 'English'],
	['eo', 'epo', 'Esperanto'],
	['et', 'est', 'Estonian'],
	['ee', 'ewe', 'Ewe'],
	['fo', 'fao', 'Faroese'],
	['fj', 'fij', 'Fijian'],
	['fi', 'fin', 'Finnish'],
	['fr', 'fre/fra', 'French'],
	['fy', 'fry', 'Western Frisian'],
	['ff', 'ful', 'Fulah'],
	['ka', 'geo/kat', 'Georgian'],
	['de', 'ger/deu', 'German'],
	['gd', 'gla', 'Gaelic; Scottish Gaelic'],
	['ga', 'gle', 'Irish'],
	['gl', 'glg', 'Galician'],
	['gv', 'glv', 'Manx'],
	['el', 'gre/ell', 'Greek, Modern (1453-)'],
	['gn', 'grn', 'Guarani'],
	['gu', 'guj', 'Gujarati'],
	['ht', 'hat', 'Haitian; Haitian Creole'],
	['ha', 'hau', 'Hausa'],
	['he', 'heb', 'Hebrew'],
	['hz', 'her', 'Herero'],
	['hi', 'hin', 'Hindi'],
	['ho', 'hmo', 'Hiri Motu'],
	['hr', 'hrv', 'Croatian'],
	['hu', 'hun', 'Hungarian'],
	['ig', 'ibo', 'Igbo'],
	['is', 'ice/isl', 'Icelandic'],
	['io', 'ido', 'Ido'],
	['ii', 'iii', 'Sichuan Yi; Nuosu'],
	['iu', 'iku', 'Inuktitut'],
	['ie', 'ile', 'Interlingue; Occidental'],
	['ia', 'ina', 'Interlingua (International Auxiliary Language Association)'],
	['id', 'ind', 'Indonesian'],
	['ik', 'ipk', 'Inupiaq'],
	['it', 'ita', 'Italian'],
	['jv', 'jav', 'Javanese'],
	['ja', 'jpn', 'Japanese'],
	['kl', 'kal', 'Kalaallisut; Greenlandic'],
	['kn', 'kan', 'Kannada'],
	['ks', 'kas', 'Kashmiri'],
	['kr', 'kau', 'Kanuri'],
	['kk', 'kaz', 'Kazakh'],
	['km', 'khm', 'Central Khmer'],
	['ki', 'kik', 'Kikuyu; Gikuyu'],
	['rw', 'kin', 'Kinyarwanda'],
	['ky', 'kir', 'Kirghiz; Kyrgyz'],
	['kv', 'kom', 'Komi'],
	['kg', 'kon', 'Kongo'],
	['ko', 'kor', 'Korean'],
	['kj', 'kua', 'Kuanyama; Kwanyama'],
	['ku', 'kur', 'Kurdish'],
	['lo', 'lao', 'Lao'],
	['la', 'lat', 'Latin'],
	['lv', 'lav', 'Latvian'],
	['li', 'lim', 'Limburgan; Limburger; Limburgish'],
	['ln', 'lin', 'Lingala'],
	['lt', 'lit', 'Lithuanian'],
	['lb', 'ltz', 'Luxembourgish; Letzeburgesch'],
	['lu', 'lub', 'Luba-Katanga'],
	['lg', 'lug', 'Ganda'],
	['mk', 'mac/mkd', 'Macedonian'],
	['mh', 'mah', 'Marshallese'],
	['ml', 'mal', 'Malayalam'],
	['mi', 'mao/mri', 'Maori'],
	['mr', 'mar', 'Marathi'],
	['ms', 'may/msa', 'Malay'],
	['mg', 'mlg', 'Malagasy'],
	['mt', 'mlt', 'Maltese'],
	['mn', 'mon', 'Mongolian'],
	['na', 'nau', 'Nauru'],
	['nv', 'nav', 'Navajo; Navaho'],
	['nr', 'nbl', 'Ndebele, South; South Ndebele'],
	['nd', 'nde', 'Ndebele, North; North Ndebele'],
	['ng', 'ndo', 'Ndonga'],
	['ne', 'nep', 'Nepali'],
	['nn', 'nno', 'Norwegian Nynorsk; Nynorsk, Norwegian'],
	['nb', 'nob', 'Bokmål, Norwegian; Norwegian Bokmål'],
	['no', 'nor', 'Norwegian'],
	['ny', 'nya', 'Chichewa; Chewa; Nyanja'],
	['oc', 'oci', 'Occitan (post 1500); Provençal'],
	['oj', 'oji', 'Ojibwa'],
	['or', 'ori', 'Oriya'],
	['om', 'orm', 'Oromo'],
	['os', 'oss', 'Ossetian; Ossetic'],
	['pa', 'pan', 'Panjabi; Punjabi'],
	['fa', 'per/fas', 'Persian'],
	['pi', 'pli', 'Pali'],
	['pl', 'pol', 'Polish'],
	['pt', 'por', 'Portuguese'],
	['ps', 'pus', 'Pushto; Pashto'],
	['qu', 'que', 'Quechua'],
	['rm', 'roh', 'Romansh'],
	['ro', 'rum/ron', 'Romanian; Moldavian; Moldovan'],
	['rn', 'run', 'Rundi'],
	['ru', 'rus', 'Russian'],
	['sg', 'sag', 'Sango'],
	['sa', 'san', 'Sanskrit'],
	['si', 'sin', 'Sinhala; Sinhalese'],
	['sk', 'slo/slk', 'Slovak'],
	['sl', 'slv', 'Slovenian'],
	['se', 'sme', 'Northern Sami'],
	['sm', 'smo', 'Samoan'],
	['sn', 'sna', 'Shona'],
	['sd', 'snd', 'Sindhi'],
	['so', 'som', 'Somali'],
	['st', 'sot', 'Sotho, Southern'],
	['es', 'spa', 'Spanish; Castilian'],
	['sc', 'srd', 'Sardinian'],
	['sr', 'srp', 'Serbian'],
	['ss', 'ssw', 'Swati'],
	['su', 'sun', 'Sundanese'],
	['sw', 'swa', 'Swahili'],
	['sv', 'swe', 'Swedish'],
	['ty', 'tah', 'Tahitian'],
	['ta', 'tam', 'Tamil'],
	['tt', 'tat', 'Tatar'],
	['te', 'tel', 'Telugu'],
	['tg', 'tgk', 'Tajik'],
	['tl', 'tgl', 'Tagalog'],
	['th', 'tha', 'Thai'],
	['bo', 'tib/bod', 'Tibetan'],
	['ti', 'tir', 'Tigrinya'],
	['to', 'ton', 'Tonga (Tonga Islands)'],
	['tn', 'tsn', 'Tswana'],
	['ts', 'tso', 'Tsonga'],
	['tk', 'tuk', 'Turkmen'],
	['tr', 'tur', 'Turkish'],
	['tw', 'twi', 'Twi'],
	['ug', 'uig', 'Uighur; Uyghur'],
	['uk', 'ukr', 'Ukrainian'],
	['ur', 'urd', 'Urdu'],
	['uz', 'uzb', 'Uzbek'],
	['ve', 'ven', 'Venda'],
	['vi', 'vie', 'Vietnamese'],
	['vo', 'vol', 'Volapük'],
	['cy', 'wel/cym', 'Welsh'],
	['wa', 'wln', 'Walloon'],
	['wo', 'wol', 'Wolof'],
	['xh', 'xho', 'Xhosa'],
	['yi', 'yid', 'Yiddish'],
	['yo', 'yor', 'Yoruba'],
	['za', 'zha', 'Zhuang; Chuang'],
	['zu', 'zul', 'Zulu'] ]

/*
 * actions triggered by buttons in col2
 * =============================================
 */
var toTop = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex >= 0 ){
		var oldHead = list.options[0];
		var newHead = list.options[list.selectedIndex];
		//list.remove(i);
		try{ list.add(newHead, oldHead); } // doesn't work in IE
		catch(ex){ list.add(newHead, 0); }// should work in IE TODO test
	}
}
var up = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex > 0 ){
		var selected = list.options[list.selectedIndex];
		var old = list.options[list.selectedIndex - 1];
		//list.remove(list.selectedIndex);
		try { list.add(selected, old); } // doesn't work in IE
		catch(ex) { list.add(selected, list.selectedIndex - 1 ); }//for IE TODO test
	}
}
var down = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex >= 0 && list.selectedIndex < list.options.length - 1){
		var selected = list.options[list.selectedIndex];
		var after = list.options[list.selectedIndex + 2];
		//list.remove(list.selectedIndex);
		try { list.add(selected, after); } // doesn't work in IE
		catch(ex) { list.add(selected, list.selectedIndex + 2 ); }//for IE TODO test
	}
}
var toBottom = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex >= 0 ){
		//var oldLast = list.options[list.options.length-1];
		var newLast = list.options[list.selectedIndex];
		//list.remove(i);
		try{ list.add(newLast, null); } // doesn't work in IE
		catch(ex){ list.add(newLast); }// should work in IE TODO test
	}
}
var fromTo = function(){
	var from = document.getElementById('fromList');
	var to = document.getElementById('toList');
	if ( from.selectedIndex >= 0 ){
		var i = from.selectedIndex;
		var item = document.createElement('option');
		item.value = from.options[i].value;
		item.label = from.options[i].label;
		item.threeCode = from.options[i].threeCode;
		item.appendChild(document.createTextNode(item.label));
		to.appendChild(item);
	}
}
var remove = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex >= 0 ){
		list.remove(list.selectedIndex);
	}
}
 /* =========================================== */

 /* Action triggered by double click on toList */
var editLanguage = function(){
	var list = document.getElementById('toList');
	var selectedIndex = list.selectedIndex;
	var toChange = list.options[selectedIndex];

	var panel = document.createElement('div');
	panel.appendChild(document.createTextNode('Language Extension'));
	var field = document.createElement('input');
	field.type = 'text';
	field.name = 'extension';
	field.value = getExtension(stripQuotes(toChange.value));
	panel.appendChild(field);

	var form = new Ext.form.FormPanel({
		width:350,
        bodyStyle: 'padding:10px;',
		contentEl: panel,
		buttons: [{
			text: 'Save',
			handler: function(){

				var nextOption = list.options[selectedIndex + 1];

				var newOption = document.createElement('option');
				if ( validCode(field.value) ){
					newOption.value = stripExtension(stripQuotes(toChange.value)) + '-' + field.value;
					newOption.label = stripExtension(stripQuotes(toChange.label)) + '-' + field.value;
					newOption.threeCode = stripExtension(stripQuotes(toChange.threeCode)) + '-' + field.value;
				}else{
					newOption.value = stripTrailingDash(stripExtension(stripQuotes(toChange.value)));
					newOption.label = stripTrailingDash(stripExtension(stripQuotes(toChange.label)));
					newOption.threeCode = stripTrailingDash(stripExtension(stripQuotes(toChange.threeCode)));
				}

				newOption.id = newOption.value;
				newOption.appendChild(document.createTextNode(newOption.label));

				list.remove(selectedIndex);
				try{ list.add(newOption, nextOption); } // doesn't work in IE
				catch(ex){ list.add(newOption, selectedIndex); }// should work in IE TODO test

				popup.close();
			}
		},{
			text: 'Cancel',
			handler: function(){
				popup.close();
			}
		}]
			});

	var popup = new Ext.Window({
		title	  : 'Heml - Edit Language',
		height    : 110,
		width     : 350,
		modal     : true,
		closable   : false,
		items     : [form]
			});

	popup.show();
}

function generatePopup(){
	var userLangs = getPreferencesFromCookie();


	// Create side-by-side lists of languages
	var table = document.createElement('table');
	table.border='0';
	table.width='100%';
	table.cellpadding='7';
	var tr = document.createElement('tr');
	table.appendChild(tr);

	var col1 = document.createElement('td');
	var col2 = document.createElement('td');
	var col3 = document.createElement('td');
	tr.appendChild(col1);
	tr.appendChild(col2);
	tr.appendChild(col3);

	// Left list - all languages
	var fromList = document.createElement('select');
	fromList.size = '10';
	fromList.id = 'fromList';
	fromList.ondblclick = fromTo;
	
	for ( var i=0; i<ds.length; i++ ){
		var item = document.createElement('option');
		item.value = ds[i][0];
		item.threeCode = ds[i][1];
		item.label = ds[i][2];
		item.appendChild(document.createTextNode(item.label));
		fromList.appendChild(item);
	}

	col1.appendChild(fromList);

	// Center column of control buttons
	// ICON HELL!!! 
	var imagePath = './images/';
	var iconUp = imagePath + 'up2.gif';
	var iconDown = imagePath + 'down2.gif';
	var iconLeft = imagePath + 'left2.gif';
	var iconRight = imagePath + 'right2.gif';
	var iconTop = imagePath + 'top2.gif';
	var iconBottom = imagePath + 'bottom2.gif';

	var toTopIcon = document.createElement('img');
	toTopIcon.src = iconTop;
	col2.appendChild(toTopIcon);
	col2.appendChild(document.createElement('br'));
	var upIcon = document.createElement('img');
	upIcon.src = iconUp;
	col2.appendChild(upIcon);
	col2.appendChild(document.createElement('br'));
	var addIcon = document.createElement('img');
	addIcon.src = iconRight;
	col2.appendChild(addIcon);
	col2.appendChild(document.createElement('br'));
	var removeIcon = document.createElement('img');
	removeIcon.src = iconLeft;
	col2.appendChild(removeIcon);
	col2.appendChild(document.createElement('br'));
	var downIcon = document.createElement('img');
	downIcon.src = iconDown;
	col2.appendChild(downIcon);
	col2.appendChild(document.createElement('br'));
	var toBottomIcon = document.createElement('img');
	toBottomIcon.src = iconBottom;
	col2.appendChild(toBottomIcon);

	toTopIcon.onclick = toTop;
	upIcon.onclick = up;
	downIcon.onclick = down;
	toBottomIcon.onclick = toBottom;
	addIcon.onclick = fromTo;
	removeIcon.onclick = remove;
	
	// Right list - user choices
	var toList = document.createElement('select');
	toList.size = '10';
	toList.id = 'toList';
	toList.ondblclick = editLanguage;

	for ( var i=0; i<userLangs.length; i++ ){
		var code = stripExtension(stripQuotes(userLangs[i][0]));
		//var extension = getExtension(stripQuotes(userLangs[i][0]));

		var item = document.createElement('option');
		item.value = stripQuotes(userLangs[i][1]);
		item.threeCode = stripQuotes(userLangs[i][0]);
		item.label = stripQuotes(userLangs[i][2]);
	//	if ( extension != '' ){
//			item.value += '-'+extension;
	//		item.threeCode += '-'+extension;
//			item.label += '-'+extension;
	//	}
		item.appendChild(document.createTextNode(item.label));
		toList.appendChild(item);
	}

	col3.appendChild(toList);

    var form = new Ext.form.FormPanel({
        width:700,
        bodyStyle: 'padding:10px;',
		contentEl: table,
        
        buttons: [{
            text: 'Save',
            handler: function(){
						var codesCookie = 'languagePreferences_codes=';
						for( var i=0; i<toList.options.length; i++){
							codesCookie += "'" + stripQuotes(toList.options[i].value) + "',";
						}
						codesCookie = codesCookie.substring(0, codesCookie.length - 1);

						var langsCookie = 'languagePreferences_langs=';
						for( var i=0; i<toList.options.length; i++){
							langsCookie += "'" + stripQuotes(toList.options[i].label) + "',";
						}
						langsCookie = langsCookie.substring(0, langsCookie.length - 1);

						var threeCodesCookie = 'languagePreferences_threeCodes=';
						for( var i=0; i<toList.options.length; i++){
							threeCodesCookie += "'" + stripQuotes(toList.options[i].threeCode) + "',";
						}
						threeCodesCookie = threeCodesCookie.substring(0, threeCodesCookie.length - 1);

						var cookieDate = new Date();
						// we will give the cookies a year
						cookieDate.setTime(cookieDate.getTime()+(365*24*60*60*1000));
						codesCookie += '; expires=' + cookieDate.toGMTString();
						langsCookie += '; expires=' + cookieDate.toGMTString();
						threeCodesCookie += '; expires=' + cookieDate.toGMTString();

						document.cookie = codesCookie;
						document.cookie = langsCookie;
						document.cookie = threeCodesCookie;

						popup.close();
            }
        }, {
            text: 'Cancel',
            handler: function(){
				popup.close();
			}
		}]
    });

	var popup = new Ext.Window({
		title      : 'Heml - Preferred Languages',
		height     : 300,
		width      : 900,
		closable   : false,
		modal      : true,
		layout     : 'fit',
		items      : [form]
	});

	popup.doLayout(false, true);

	popup.show();

}

/**
 * finds the languages for a given array of alpha-2 language codes
 */
function findLanguagesFrom2Codes(codes, onFail, onSuccess){
	asArray = codes.split(',');

	queryStr = 'PREFIX : <http://local-language-codes#> SELECT ?lang ?code WHERE {?b :language ?lang. ?b :code ?code.';
	for ( var i=0; i<asArray.length; i++){
		queryStr += '{?b :2code "' + stripExtension(stripQuotes(asArray[i])) + '".} UNION ';
	}
	queryStr = queryStr.substring(0, queryStr.length - 7) + '}';

	query = new Heml.SparqlQuery('http://localhost:2030/sparql/read', queryStr, onFail, onSuccess);
	query.performQuery();
}

/**
 * finds the languages for a given array of alpha-3 language codes
 */
function findLanguagesFrom3Codes(codes, onFail, onSuccess){
	asArray = codes.split(',');

	queryStr = 'PREFIX : <http://local-language-codes#> SELECT ?lang ?code WHERE {?b :language ?lang. ?b :code ?code.';
	for ( var i=0; i<asArray.length; i++){
		queryStr += '{?b :split "' + stripExtension(stripQuotes(asArray[i])) + '".} UNION ';
	}
	queryStr = queryStr.substring(0, queryStr.length - 7) + '}';

	query = new Heml.SparqlQuery('http://localhost:2030/sparql/read', queryStr, onFail, onSuccess);
	query.performQuery();
}

/**
 * Strips the first and last characters from a string object
 */
function stripQuotes(s){
	if ( (s.charAt(0) == "'" && s.charAt(s.length-1)) ||
			(s.charAt(0) == '"' && s.charAt(s.length-1) == '"')){
		return s.substring(1, s.length - 1);
	}
	else{
		return s;
	}
}

/**
 * Returns the string up to the character before the last occurrence of '-'. If
 * no occurrences, returns the input string. Note that a code string containing
 * a hyphen necessarily has an extension.

 */
function stripExtension(s){
	lastIndex = s.lastIndexOf('-');
	if ( lastIndex > 0 ){
		return s.substring(0, lastIndex);
	}else{
		return s;
	}
}

/**
 * Returns the string after the last occurrence of '-'. If no occurrences,
 * returns the empty string. Note that a code string containing a hyphen
 * necessarily has an extension.
 */
function getExtension(s){
	lastIndex = s.lastIndexOf('-');
	if ( lastIndex > 0 ){
		return s.substring(lastIndex + 1);
	}
	else{
		return "";
	}
}

/**
 * Verifies that <code>code</code> is only alpha characters and is not the
 * empty string.
 */
function validCode(code){
	return /[a-zA-Z]+/.test(code);
}

function stripTrailingDash(s){
	if ( s.charAt(s.length-1) == '-' ) { return s.substring(0, s.length-1); }
	else { return s; }
}
