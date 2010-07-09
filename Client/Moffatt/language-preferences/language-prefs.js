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
		renderTo: 'languagePreferences',
		handler: function(){
			generatePopup();
		}
	});
/*
	var testButton = new Ext.Button({
		text: 'Perform test',
		renderTo: 'languagePreferences',
		handler: function(){
			query_BestLanguageMatch('<http://www.heml.org/docs/samples/heml/2002-05-29/hellenistic.xml#alexandria>', 'rdfs:label',
				'http://localhost:2020/sparql/read', 
				function(){
					alert('filed!!');
				}, 
				function(json){
					console.dir(json);
				}
			); 
		}
	});
*/
});

//2D array with ISO 639-1 codes, ISO 639-2 codes, and languages
var ds = [
['abk', 'ab', 'Abkhazian'],
['ace', '', 'Achinese'],
['ach', '', 'Acoli'],
['ada', '', 'Adangme'],
['ady', '', 'Adyghe; Adygei'],
['aar', 'aa', 'Afar'],
['afh', '', 'Afrihili'],
['afr', 'af', 'Afrikaans'],
['afa', '', 'Afro-Asiatic languages'],
['ain', '', 'Ainu'],
['aka', 'ak', 'Akan'],
['akk', '', 'Akkadian'],
['alb/sqi', 'sq', 'Albanian'],
['ale', '', 'Aleut'],
['alg', '', 'Algonquian languages'],
['tut', '', 'Altaic languages'],
['amh', 'am', 'Amharic'],
['anp', '', 'Angika'],
['apa', '', 'Apache languages'],
['ara', 'ar', 'Arabic'],
['arg', 'an', 'Aragonese'],
['arp', '', 'Arapaho'],
['arw', '', 'Arawak'],
['arm/hye', 'hy', 'Armenian'],
['rup', '', 'Aromanian; Arumanian; Macedo-Romanian'],
['art', '', 'Artificial languages'],
['asm', 'as', 'Assamese'],
['ast', '', 'Asturian; Bable; Leonese; Asturleonese'],
['ath', '', 'Athapascan languages'],
['aus', '', 'Australian languages'],
['map', '', 'Austronesian languages'],
['ava', 'av', 'Avaric'],
['ave', 'ae', 'Avestan'],
['awa', '', 'Awadhi'],
['aym', 'ay', 'Aymara'],
['aze', 'az', 'Azerbaijani'],
['ban', '', 'Balinese'],
['bat', '', 'Baltic languages'],
['bal', '', 'Baluchi'],
['bam', 'bm', 'Bambara'],
['bai', '', 'Bamileke languages'],
['bad', '', 'Banda languages'],
['bnt', '', 'Bantu (Other)'],
['bas', '', 'Basa'],
['bak', 'ba', 'Bashkir'],
['baq/eus', 'eu', 'Basque'],
['btk', '', 'Batak languages'],
['bej', '', 'Beja; Bedawiyet'],
['bel', 'be', 'Belarusian'],
['bem', '', 'Bemba'],
['ben', 'bn', 'Bengali'],
['ber', '', 'Berber languages'],
['bho', '', 'Bhojpuri'],
['bih', 'bh', 'Bihari'],
['bik', '', 'Bikol'],
['bin', '', 'Bini; Edo'],
['bis', 'bi', 'Bislama'],
['byn', '', 'Blin; Bilin'],
['zbl', '', 'Blissymbols; Blissymbolics; Bliss'],
['nob', 'nb', 'Bokmål, Norwegian; Norwegian Bokmål'],
['bos', 'bs', 'Bosnian'],
['bra', '', 'Braj'],
['bre', 'br', 'Breton'],
['bug', '', 'Buginese'],
['bul', 'bg', 'Bulgarian'],
['bua', '', 'Buriat'],
['bur/mya', 'my', 'Burmese'],
['cad', '', 'Caddo'],
['cat', 'ca', 'Catalan; Valencian'],
['cau', '', 'Caucasian languages'],
['ceb', '', 'Cebuano'],
['cel', '', 'Celtic languages'],
['cai', '', 'Central American Indian languages'],
['khm', 'km', 'Central Khmer'],
['chg', '', 'Chagatai'],
['cmc', '', 'Chamic languages'],
['cha', 'ch', 'Chamorro'],
['che', 'ce', 'Chechen'],
['chr', '', 'Cherokee'],
['chy', '', 'Cheyenne'],
['chb', '', 'Chibcha'],
['nya', 'ny', 'Chichewa; Chewa; Nyanja'],
['chi/zho', 'zh', 'Chinese'],
['chn', '', 'Chinook jargon'],
['chp', '', 'Chipewyan; Dene Suline'],
['cho', '', 'Choctaw'],
['chu', 'cu', 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic'],
['chk', '', 'Chuukese'],
['chv', 'cv', 'Chuvash'],
['nwc', '', 'Classical Newari; Old Newari; Classical Nepal Bhasa'],
['syc', '', 'Classical Syriac'],
['cop', '', 'Coptic'],
['cor', 'kw', 'Cornish'],
['cos', 'co', 'Corsican'],
['cre', 'cr', 'Cree'],
['mus', '', 'Creek'],
['crp', '', 'Creoles and pidgins '],
['cpe', '', 'Creoles and pidgins, English based'],
['cpf', '', 'Creoles and pidgins, French-based '],
['cpp', '', 'Creoles and pidgins, Portuguese-based '],
['crh', '', 'Crimean Tatar; Crimean Turkish'],
['hrv', 'hr', 'Croatian'],
['cus', '', 'Cushitic languages'],
['cze/ces', 'cs', 'Czech'],
['dak', '', 'Dakota'],
['dan', 'da', 'Danish'],
['dar', '', 'Dargwa'],
['del', '', 'Delaware'],
['din', '', 'Dinka'],
['div', 'dv', 'Divehi; Dhivehi; Maldivian'],
['dgr', '', 'Dogrib'],
['doi', '', 'Dogri'],
['dra', '', 'Dravidian languages'],
['dua', '', 'Duala'],
['dut/nld', 'nl', 'Dutch; Flemish'],
['dum', '', 'Dutch, Middle (ca.1050-1350)'],
['dyu', '', 'Dyula'],
['dzo', 'dz', 'Dzongkha'],
['frs', '', 'Eastern Frisian'],
['efi', '', 'Efik'],
['egy', '', 'Egyptian (Ancient)'],
['eka', '', 'Ekajuk'],
['elx', '', 'Elamite'],
['eng', 'en', 'English'],
['enm', '', 'English, Middle (1100-1500)'],
['ang', '', 'English, Old (ca.450-1100)'],
['myv', '', 'Erzya'],
['epo', 'eo', 'Esperanto'],
['est', 'et', 'Estonian'],
['ewe', 'ee', 'Ewe'],
['ewo', '', 'Ewondo'],
['fan', '', 'Fang'],
['fat', '', 'Fanti'],
['fao', 'fo', 'Faroese'],
['fij', 'fj', 'Fijian'],
['fil', '', 'Filipino; Pilipino'],
['fin', 'fi', 'Finnish'],
['fiu', '', 'Finno-Ugrian languages'],
['fon', '', 'Fon'],
['fre/fra', 'fr', 'French'],
['frm', '', 'French, Middle (ca.1400-1600)'],
['fro', '', 'French, Old (842-ca.1400)'],
['fur', '', 'Friulian'],
['ful', 'ff', 'Fulah'],
['gla', 'gd', 'Gaelic; Scottish Gaelic'],
['gaa', '', 'Ga'],
['car', '', 'Galibi Carib'],
['glg', 'gl', 'Galician'],
['lug', 'lg', 'Ganda'],
['gay', '', 'Gayo'],
['gba', '', 'Gbaya'],
['gez', '', 'Geez'],
['geo/kat', 'ka', 'Georgian'],
['ger/deu', 'de', 'German'],
['gem', '', 'Germanic languages'],
['gmh', '', 'German, Middle High (ca.1050-1500)'],
['goh', '', 'German, Old High (ca.750-1050)'],
['gil', '', 'Gilbertese'],
['gon', '', 'Gondi'],
['gor', '', 'Gorontalo'],
['got', '', 'Gothic'],
['grb', '', 'Grebo'],
['grc', '', 'Greek, Ancient (to 1453)'],
['gre/ell', 'el', 'Greek, Modern (1453-)'],
['grn', 'gn', 'Guarani'],
['guj', 'gu', 'Gujarati'],
['hai', '', 'Haida'],
['hat', 'ht', 'Haitian; Haitian Creole'],
['hau', 'ha', 'Hausa'],
['haw', '', 'Hawaiian'],
['heb', 'he', 'Hebrew'],
['her', 'hz', 'Herero'],
['hil', '', 'Hiligaynon'],
['him', '', 'Himachali'],
['hin', 'hi', 'Hindi'],
['hmo', 'ho', 'Hiri Motu'],
['hit', '', 'Hittite'],
['hmn', '', 'Hmong'],
['hun', 'hu', 'Hungarian'],
['hup', '', 'Hupa'],
['iba', '', 'Iban'],
['ice/isl', 'is', 'Icelandic'],
['ido', 'io', 'Ido'],
['ibo', 'ig', 'Igbo'],
['ijo', '', 'Ijo languages'],
['ilo', '', 'Iloko'],
['smn', '', 'Inari Sami'],
['inc', '', 'Indic languages'],
['ine', '', 'Indo-European languages'],
['ind', 'id', 'Indonesian'],
['inh', '', 'Ingush'],
['gwi', '', 'Gwich\'in'],
['ina', 'ia', 'Interlingua (International Auxiliary Language Association)'],
['ile', 'ie', 'Interlingue; Occidental'],
['iku', 'iu', 'Inuktitut'],
['ipk', 'ik', 'Inupiaq'],
['ira', '', 'Iranian languages'],
['gle', 'ga', 'Irish'],
['mga', '', 'Irish, Middle (900-1200)'],
['sga', '', 'Irish, Old (to 900)'],
['iro', '', 'Iroquoian languages'],
['ita', 'it', 'Italian'],
['jpn', 'ja', 'Japanese'],
['jav', 'jv', 'Javanese'],
['jrb', '', 'Judeo-Arabic'],
['jpr', '', 'Judeo-Persian'],
['kbd', '', 'Kabardian'],
['kab', '', 'Kabyle'],
['kac', '', 'Kachin; Jingpho'],
['kal', 'kl', 'Kalaallisut; Greenlandic'],
['xal', '', 'Kalmyk; Oirat'],
['kam', '', 'Kamba'],
['kan', 'kn', 'Kannada'],
['kau', 'kr', 'Kanuri'],
['krc', '', 'Karachay-Balkar'],
['kaa', '', 'Kara-Kalpak'],
['krl', '', 'Karelian'],
['kar', '', 'Karen languages'],
['kas', 'ks', 'Kashmiri'],
['csb', '', 'Kashubian'],
['kaw', '', 'Kawi'],
['kaz', 'kk', 'Kazakh'],
['kha', '', 'Khasi'],
['khi', '', 'Khoisan languages'],
['kho', '', 'Khotanese; Sakan'],
['kik', 'ki', 'Kikuyu; Gikuyu'],
['kmb', '', 'Kimbundu'],
['kin', 'rw', 'Kinyarwanda'],
['kir', 'ky', 'Kirghiz; Kyrgyz'],
['tlh', '', 'Klingon; tlhIngan-Hol'],
['mic', '', 'Mi\'kmaq; Micmac'],
['kom', 'kv', 'Komi'],
['kon', 'kg', 'Kongo'],
['kok', '', 'Konkani'],
['nqo', '', 'N\'Ko'],
['kor', 'ko', 'Korean'],
['kos', '', 'Kosraean'],
['kpe', '', 'Kpelle'],
['kro', '', 'Kru languages'],
['kua', 'kj', 'Kuanyama; Kwanyama'],
['kum', '', 'Kumyk'],
['kur', 'ku', 'Kurdish'],
['kru', '', 'Kurukh'],
['kut', '', 'Kutenai'],
['lad', '', 'Ladino'],
['lah', '', 'Lahnda'],
['lam', '', 'Lamba'],
['day', '', 'Land Dayak languages'],
['lao', 'lo', 'Lao'],
['lat', 'la', 'Latin'],
['lav', 'lv', 'Latvian'],
['lez', '', 'Lezghian'],
['lim', 'li', 'Limburgan; Limburger; Limburgish'],
['lin', 'ln', 'Lingala'],
['lit', 'lt', 'Lithuanian'],
['jbo', '', 'Lojban'],
['dsb', '', 'Lower Sorbian'],
['nds', '', 'Low German; Low Saxon; German, Low; Saxon, Low'],
['loz', '', 'Lozi'],
['lub', 'lu', 'Luba-Katanga'],
['lua', '', 'Luba-Lulua'],
['lui', '', 'Luiseno'],
['smj', '', 'Lule Sami'],
['lun', '', 'Lunda'],
['luo', '', 'Luo (Kenya and Tanzania)'],
['lus', '', 'Lushai'],
['ltz', 'lb', 'Luxembourgish; Letzeburgesch'],
['mac/mkd', 'mk', 'Macedonian'],
['mad', '', 'Madurese'],
['mag', '', 'Magahi'],
['mai', '', 'Maithili'],
['mak', '', 'Makasar'],
['mlg', 'mg', 'Malagasy'],
['mal', 'ml', 'Malayalam'],
['may/msa', 'ms', 'Malay'],
['mlt', 'mt', 'Maltese'],
['mnc', '', 'Manchu'],
['mdr', '', 'Mandar'],
['man', '', 'Mandingo'],
['mni', '', 'Manipuri'],
['mno', '', 'Manobo languages'],
['glv', 'gv', 'Manx'],
['mao/mri', 'mi', 'Maori'],
['arn', '', 'Mapudungun; Mapuche'],
['mar', 'mr', 'Marathi'],
['chm', '', 'Mari'],
['mah', 'mh', 'Marshallese'],
['mwr', '', 'Marwari'],
['mas', '', 'Masai'],
['myn', '', 'Mayan languages'],
['men', '', 'Mende'],
['min', '', 'Minangkabau'],
['mwl', '', 'Mirandese'],
['moh', '', 'Mohawk'],
['mdf', '', 'Moksha'],
['mon', 'mn', 'Mongolian'],
['lol', '', 'Mongo'],
['mkh', '', 'Mon-Khmer languages'],
['mos', '', 'Mossi'],
['mul', '', 'Multiple languages'],
['mun', '', 'Munda languages'],
['nah', '', 'Nahuatl languages'],
['nau', 'na', 'Nauru'],
['nav', 'nv', 'Navajo; Navaho'],
['nde', 'nd', 'Ndebele, North; North Ndebele'],
['nbl', 'nr', 'Ndebele, South; South Ndebele'],
['ndo', 'ng', 'Ndonga'],
['nap', '', 'Neapolitan'],
['new', '', 'Nepal Bhasa; Newari'],
['nep', 'ne', 'Nepali'],
['nia', '', 'Nias'],
['nic', '', 'Niger-Kordofanian languages'],
['ssa', '', 'Nilo-Saharan languages'],
['niu', '', 'Niuean'],
['nog', '', 'Nogai'],
['zxx', '', 'No linguistic content; Not applicable'],
['non', '', 'Norse, Old'],
['nai', '', 'North American Indian languages'],
['frr', '', 'Northern Frisian'],
['sme', 'se', 'Northern Sami'],
['nor', 'no', 'Norwegian'],
['nno', 'nn', 'Norwegian Nynorsk; Nynorsk, Norwegian'],
['nub', '', 'Nubian languages'],
['nym', '', 'Nyamwezi'],
['nyn', '', 'Nyankole'],
['nyo', '', 'Nyoro'],
['nzi', '', 'Nzima'],
['oci', 'oc', 'Occitan (post 1500); Provençal'],
['arc', '', 'Official Aramaic (700-300 BCE); Imperial Aramaic (700-300 BCE)'],
['oji', 'oj', 'Ojibwa'],
['ori', 'or', 'Oriya'],
['orm', 'om', 'Oromo'],
['osa', '', 'Osage'],
['oss', 'os', 'Ossetian; Ossetic'],
['oto', '', 'Otomian languages'],
['pal', '', 'Pahlavi'],
['pau', '', 'Palauan'],
['pli', 'pi', 'Pali'],
['pam', '', 'Pampanga; Kapampangan'],
['pag', '', 'Pangasinan'],
['pan', 'pa', 'Panjabi; Punjabi'],
['pap', '', 'Papiamento'],
['paa', '', 'Papuan languages'],
['nso', '', 'Pedi; Sepedi; Northern Sotho'],
['peo', '', 'Persian, Old (ca.600-400 B.C.)'],
['per/fas', 'fa', 'Persian'],
['phi', '', 'Philippine languages'],
['phn', '', 'Phoenician'],
['pon', '', 'Pohnpeian'],
['pol', 'pl', 'Polish'],
['por', 'pt', 'Portuguese'],
['pra', '', 'Prakrit languages'],
['pro', '', 'Provençal, Old (to 1500)'],
['pus', 'ps', 'Pushto; Pashto'],
['que', 'qu', 'Quechua'],
['raj', '', 'Rajasthani'],
['rap', '', 'Rapanui'],
['rar', '', 'Rarotongan; Cook Islands Maori'],
['qaa-qtz', '', 'Reserved for local use'],
['roa', '', 'Romance languages'],
['rum/ron', 'ro', 'Romanian; Moldavian; Moldovan'],
['roh', 'rm', 'Romansh'],
['rom', '', 'Romany'],
['run', 'rn', 'Rundi'],
['rus', 'ru', 'Russian'],
['sal', '', 'Salishan languages'],
['sam', '', 'Samaritan Aramaic'],
['smi', '', 'Sami languages'],
['smo', 'sm', 'Samoan'],
['sad', '', 'Sandawe'],
['sag', 'sg', 'Sango'],
['san', 'sa', 'Sanskrit'],
['sat', '', 'Santali'],
['srd', 'sc', 'Sardinian'],
['sas', '', 'Sasak'],
['sco', '', 'Scots'],
['sel', '', 'Selkup'],
['sem', '', 'Semitic languages'],
['srp', 'sr', 'Serbian'],
['srr', '', 'Serer'],
['shn', '', 'Shan'],
['sna', 'sn', 'Shona'],
['iii', 'ii', 'Sichuan Yi; Nuosu'],
['scn', '', 'Sicilian'],
['sid', '', 'Sidamo'],
['sgn', '', 'Sign Languages'],
['bla', '', 'Siksika'],
['snd', 'sd', 'Sindhi'],
['sin', 'si', 'Sinhala; Sinhalese'],
['sit', '', 'Sino-Tibetan languages'],
['sio', '', 'Siouan languages'],
['sms', '', 'Skolt Sami'],
['den', '', 'Slave (Athapascan)'],
['sla', '', 'Slavic languages'],
['slo/slk', 'sk', 'Slovak'],
['slv', 'sl', 'Slovenian'],
['sog', '', 'Sogdian'],
['som', 'so', 'Somali'],
['son', '', 'Songhai languages'],
['snk', '', 'Soninke'],
['wen', '', 'Sorbian languages'],
['sot', 'st', 'Sotho, Southern'],
['sai', '', 'South American Indian (Other)'],
['alt', '', 'Southern Altai'],
['sma', '', 'Southern Sami'],
['spa', 'es', 'Spanish; Castilian'],
['srn', '', 'Sranan Tongo'],
['suk', '', 'Sukuma'],
['sux', '', 'Sumerian'],
['sun', 'su', 'Sundanese'],
['sus', '', 'Susu'],
['swa', 'sw', 'Swahili'],
['ssw', 'ss', 'Swati'],
['swe', 'sv', 'Swedish'],
['gsw', '', 'Swiss German; Alemannic; Alsatian'],
['syr', '', 'Syriac'],
['tgl', 'tl', 'Tagalog'],
['tah', 'ty', 'Tahitian'],
['tai', '', 'Tai languages'],
['tgk', 'tg', 'Tajik'],
['tmh', '', 'Tamashek'],
['tam', 'ta', 'Tamil'],
['tat', 'tt', 'Tatar'],
['tel', 'te', 'Telugu'],
['ter', '', 'Tereno'],
['tet', '', 'Tetum'],
['tha', 'th', 'Thai'],
['tib/bod', 'bo', 'Tibetan'],
['tig', '', 'Tigre'],
['tir', 'ti', 'Tigrinya'],
['tem', '', 'Timne'],
['tiv', '', 'Tiv'],
['tli', '', 'Tlingit'],
['tkl', '', 'Tokelau'],
['tpi', '', 'Tok Pisin'],
['tog', '', 'Tonga (Nyasa)'],
['ton', 'to', 'Tonga (Tonga Islands)'],
['tsi', '', 'Tsimshian'],
['tso', 'ts', 'Tsonga'],
['tsn', 'tn', 'Tswana'],
['tum', '', 'Tumbuka'],
['tup', '', 'Tupi languages'],
['ota', '', 'Turkish, Ottoman (1500-1928)'],
['tur', 'tr', 'Turkish'],
['tuk', 'tk', 'Turkmen'],
['tvl', '', 'Tuvalu'],
['tyv', '', 'Tuvinian'],
['twi', 'tw', 'Twi'],
['udm', '', 'Udmurt'],
['uga', '', 'Ugaritic'],
['uig', 'ug', 'Uighur; Uyghur'],
['ukr', 'uk', 'Ukrainian'],
['umb', '', 'Umbundu'],
['mis', '', 'Uncoded languages'],
['und', '', 'Undetermined'],
['hsb', '', 'Upper Sorbian'],
['urd', 'ur', 'Urdu'],
['uzb', 'uz', 'Uzbek'],
['vai', '', 'Vai'],
['ven', 've', 'Venda'],
['vie', 'vi', 'Vietnamese'],
['vol', 'vo', 'Volapük'],
['vot', '', 'Votic'],
['wak', '', 'Wakashan languages'],
['wal', '', 'Walamo'],
['wln', 'wa', 'Walloon'],
['war', '', 'Waray'],
['was', '', 'Washo'],
['wel/cym', 'cy', 'Welsh'],
['fry', 'fy', 'Western Frisian'],
['wol', 'wo', 'Wolof'],
['xho', 'xh', 'Xhosa'],
['sah', '', 'Yakut'],
['yao', '', 'Yao'],
['yap', '', 'Yapese'],
['yid', 'yi', 'Yiddish'],
['yor', 'yo', 'Yoruba'],
['ypk', '', 'Yupik languages'],
['znd', '', 'Zande languages'],
['zap', '', 'Zapotec'],
['zza', '', 'Zaza; Dimili; Dimli; Kirdki; Kirmanjki; Zazaki'],
['zen', '', 'Zenaga'],
['zha', 'za', 'Zhuang; Chuang'],
['zul', 'zu', 'Zulu'],
['zun', '', 'Zuni'] ]

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
		try{ list.add(newHead, oldHead); } // shouldn't work in IE
		catch(ex){ list.add(newHead, 0); }// should work in IE TODO test
	}
}
var up = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex > 0 ){
		var selected = list.options[list.selectedIndex];
		var old = list.options[list.selectedIndex - 1];
		//list.remove(list.selectedIndex);
		try { list.add(selected, old); } // shouldn't work in IE
		catch(ex) { list.add(selected, list.selectedIndex - 1 ); }//for IE TODO test
	}
}
var down = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex >= 0 && list.selectedIndex < list.options.length - 1){
		var selected = list.options[list.selectedIndex];
		var after = list.options[list.selectedIndex + 2];
		//list.remove(list.selectedIndex);
		try { list.add(selected, after); } // shouldn't work in IE
		catch(ex) { list.add(selected, list.selectedIndex + 2 ); }//for IE TODO test
	}
}
var toBottom = function(){
	var list = document.getElementById('toList');
	if ( list.selectedIndex >= 0 ){
		//var oldLast = list.options[list.options.length-1];
		var newLast = list.options[list.selectedIndex];
		//list.remove(i);
		try{ list.add(newLast, null); } // shouldn't work in IE
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
		item.twoCode = from.options[i].twoCode;
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
					newOption.twoCode = stripExtension(stripQuotes(toChange.twoCode)) + '-' + field.value;
				}else{
					newOption.value = stripTrailingDash(stripExtension(stripQuotes(toChange.value)));
					newOption.label = stripTrailingDash(stripExtension(stripQuotes(toChange.label)));
					newOption.twoCode = stripTrailingDash(stripExtension(stripQuotes(toChange.twoCode)));
				}

				newOption.id = newOption.value;
				newOption.appendChild(document.createTextNode(newOption.label));

				list.remove(selectedIndex);
				try{ list.add(newOption, nextOption); } // shouldn't work in IE
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

	// --- Left list - all languages ---
	var fromList = document.createElement('select');
	fromList.size = '10';
	fromList.id = 'fromList';
	fromList.ondblclick = fromTo;
	
	for ( var i=0; i<ds.length; i++ ){
		var item = document.createElement('option');
		item.value = ds[i][0];
		item.twoCode = ds[i][1];
		item.label = ds[i][2];
		item.appendChild(document.createTextNode(item.label));
		fromList.appendChild(item);
	}

	col1.appendChild(fromList);

	// Center column of control buttons
	// ICON HELL!!! 
	var imagePath = 'language-preferences/images/';
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
	
	// --- Right list - user choices ---
	var toList = document.createElement('select');
	toList.size = '10';
	toList.id = 'toList';
	toList.ondblclick = editLanguage;

	var userLangs = getPreferencesFromCookie();

	for ( var i=0; i<userLangs.length; i++ ){
		var item = document.createElement('option');

		item.value = stripQuotes(userLangs[i][0]);
		item.twoCode = stripQuotes(userLangs[i][1]);
		item.label = stripQuotes(userLangs[i][2]);

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
						var codesCookie = 'HEML_languagePreferences_codes=';
						for( var i=0; i<toList.options.length; i++){
							codesCookie += "'" + stripQuotes(toList.options[i].value) + "',";
						}
						//codesCookie = encodeURIComponent(codesCookie.substring(0, codesCookie.length - 1));
						codesCookie = encodeToCookie(codesCookie.substring(0, codesCookie.length - 1));

						var langsCookie = 'HEML_languagePreferences_langs=';
						for( var i=0; i<toList.options.length; i++){
							langsCookie += "'" + stripQuotes(toList.options[i].label) + "',";
						}
						//langsCookie = encodeURIComponent(langsCookie.substring(0, langsCookie.length - 1));
						langsCookie = encodeToCookie(langsCookie.substring(0, langsCookie.length - 1));

						var twoCodesCookie = 'HEML_languagePreferences_twoCodes=';
						for( var i=0; i<toList.options.length; i++){
							twoCodesCookie += "'" + stripQuotes(toList.options[i].twoCode) + "',";
						}
						//twoCodesCookie = encodeURIComponent(twoCodesCookie.substring(0, twoCodesCookie.length - 1));
						twoCodesCookie = encodeToCookie(twoCodesCookie.substring(0, twoCodesCookie.length - 1));

						var cookieDate = new Date();
						// we will give the cookies a year
						cookieDate.setTime(cookieDate.getTime()+(365*24*60*60*1000));
						codesCookie += '; expires=' + cookieDate.toGMTString();
						langsCookie += '; expires=' + cookieDate.toGMTString();
						twoCodesCookie += '; expires=' + cookieDate.toGMTString();

						alert(twoCodesCookie);

						document.cookie = codesCookie;
						document.cookie = langsCookie;
						document.cookie = twoCodesCookie;
/*
						console.info(codesCookie);
						console.info(langsCookie);
						console.info(twoCodesCookie);
*/
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
 * We may wish to perform better checking (like that an extension is standard)
 * at some point.
 */
function validCode(code){
	return /^[a-zA-Z]+$/.test(code);
}

function stripTrailingDash(s){
	if ( s.charAt(s.length-1) == '-' ) { return s.substring(0, s.length-1); }
	else { return s; }
}
