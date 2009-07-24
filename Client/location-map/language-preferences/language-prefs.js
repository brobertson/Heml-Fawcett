/*
 * Ext JS Library 3.0 RC2
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * An interface for the user to select language preferences. We store
 * preferences in ISO 639-2. 
 *
 * Note that a language can exist multiple times in the list. This is to allow
 * languages to be defined with different extensions (e.g. eng-us and ang-uk).
 * We let the empty extension match any extension. For example, 'eng-uk' will
 * not match 'eng-us', while both 'eng-us' and 'eng' will. If the user feels
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
			generatePopup1();
		}
	});
	//generatePopup1();
});

		//2D array with ISO 639-2 codes and languages
var ds = [
	['abk', 'Abkhazian'],
	['ace', 'Achinese'],
	['ach', 'Acoli'],
	['ada', 'Adangme'],
	['ady', 'Adyghe; Adygei'],
	['aar', 'Afar'],
	['afh', 'Afrihili'],
	['afr', 'Afrikaans'],
	['afa', 'Afro-Asiatic languages'],
	['ain', 'Ainu'],
	['aka', 'Akan'],
	['akk', 'Akkadian'],
	['alb/sqi', 'Albanian'],
	['ale', 'Aleut'],
	['alg', 'Algonquian languages'],
	['tut', 'Altaic languages'],
	['amh', 'Amharic'],
	['anp', 'Angika'],
	['apa', 'Apache languages'],
	['ara', 'Arabic'],
	['arg', 'Aragonese'],
	['arp', 'Arapaho'],
	['arw', 'Arawak'],
	['arm/hye', 'Armenian'],
	['rup', 'Aromanian; Arumanian; Macedo-Romanian'],
	['art', 'Artificial languages'],
	['asm', 'Assamese'],
	['ast', 'Asturian; Bable; Leonese; Asturleonese'],
	['ath', 'Athapascan languages'],
	['aus', 'Australian languages'],
	['map', 'Austronesian languages'],
	['ava', 'Avaric'],
	['ave', 'Avestan'],
	['awa', 'Awadhi'],
	['aym', 'Aymara'],
	['aze', 'Azerbaijani'],
	['ban', 'Balinese'],
	['bat', 'Baltic languages'],
	['bal', 'Baluchi'],
	['bam', 'Bambara'],
	['bai', 'Bamileke languages'],
	['bad', 'Banda languages'],
	['bnt', 'Bantu (Other)'],
	['bas', 'Basa'],
	['bak', 'Bashkir'],
	['baq/eus', 'Basque'],
	['btk', 'Batak languages'],
	['bej', 'Beja; Bedawiyet'],
	['bel', 'Belarusian'],
	['bem', 'Bemba'],
	['ben', 'Bengali'],
	['ber', 'Berber languages'],
	['bho', 'Bhojpuri'],
	['bih', 'Bihari'],
	['bik', 'Bikol'],
	['bin', 'Bini; Edo'],
	['bis', 'Bislama'],
	['byn', 'Blin; Bilin'],
	['zbl', 'Blissymbols; Blissymbolics; Bliss'],
	['nob', 'Bokmål, Norwegian; Norwegian Bokmål'],
	['bos', 'Bosnian'],
	['bra', 'Braj'],
	['bre', 'Breton'],
	['bug', 'Buginese'],
	['bul', 'Bulgarian'],
	['bua', 'Buriat'],
	['bur/mya', 'Burmese'],
	['cad', 'Caddo'],
	['cat', 'Catalan; Valencian'],
	['cau', 'Caucasian languages'],
	['ceb', 'Cebuano'],
	['cel', 'Celtic languages'],
	['cai', 'Central American Indian languages'],
	['khm', 'Central Khmer'],
	['chg', 'Chagatai'],
	['cmc', 'Chamic languages'],
	['cha', 'Chamorro'],
	['che', 'Chechen'],
	['chr', 'Cherokee'],
	['chy', 'Cheyenne'],
	['chb', 'Chibcha'],
	['nya', 'Chichewa; Chewa; Nyanja'],
	['chi/zho', 'Chinese'],
	['chn', 'Chinook jargon'],
	['chp', 'Chipewyan; Dene Suline'],
	['cho', 'Choctaw'],
	['chu', 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic'],
	['chk', 'Chuukese'],
	['chv', 'Chuvash'],
	['nwc', 'Classical Newari; Old Newari; Classical Nepal Bhasa'],
	['syc', 'Classical Syriac'],
	['cop', 'Coptic'],
	['cor', 'Cornish'],
	['cos', 'Corsican'],
	['cre', 'Cree'],
	['mus', 'Creek'],
	['crp', 'Creoles and pidgins '],
	['cpe', 'Creoles and pidgins, English based'],
	['cpf', 'Creoles and pidgins, French-based '],
	['cpp', 'Creoles and pidgins, Portuguese-based '],
	['crh', 'Crimean Tatar; Crimean Turkish'],
	['hrv', 'Croatian'],
	['cus', 'Cushitic languages'],
	['cze/ces', 'Czech'],
	['dak', 'Dakota'],
	['dan', 'Danish'],
	['dar', 'Dargwa'],
	['del', 'Delaware'],
	['din', 'Dinka'],
	['div', 'Divehi; Dhivehi; Maldivian'],
	['dgr', 'Dogrib'],
	['doi', 'Dogri'],
	['dra', 'Dravidian languages'],
	['dua', 'Duala'],
	['dut/nld', 'Dutch; Flemish'],
	['dum', 'Dutch, Middle (ca.1050-1350)'],
	['dyu', 'Dyula'],
	['dzo', 'Dzongkha'],
	['frs', 'Eastern Frisian'],
	['efi', 'Efik'],
	['egy', 'Egyptian (Ancient)'],
	['eka', 'Ekajuk'],
	['elx', 'Elamite'],
	['eng', 'English'],
	['enm', 'English, Middle (1100-1500)'],
	['ang', 'English, Old (ca.450-1100)'],
	['myv', 'Erzya'],
	['epo', 'Esperanto'],
	['est', 'Estonian'],
	['ewe', 'Ewe'],
	['ewo', 'Ewondo'],
	['fan', 'Fang'],
	['fat', 'Fanti'],
	['fao', 'Faroese'],
	['fij', 'Fijian'],
	['fil', 'Filipino; Pilipino'],
	['fin', 'Finnish'],
	['fiu', 'Finno-Ugrian languages'],
	['fon', 'Fon'],
	['fre/fra', 'French'],
	['frm', 'French, Middle (ca.1400-1600)'],
	['fro', 'French, Old (842-ca.1400)'],
	['fur', 'Friulian'],
	['ful', 'Fulah'],
	['gla', 'Gaelic; Scottish Gaelic'],
	['gaa', 'Ga'],
	['car', 'Galibi Carib'],
	['glg', 'Galician'],
	['lug', 'Ganda'],
	['gay', 'Gayo'],
	['gba', 'Gbaya'],
	['gez', 'Geez'],
	['geo/kat', 'Georgian'],
	['ger/deu', 'German'],
	['gem', 'Germanic languages'],
	['gmh', 'German, Middle High (ca.1050-1500)'],
	['goh', 'German, Old High (ca.750-1050)'],
	['gil', 'Gilbertese'],
	['gon', 'Gondi'],
	['gor', 'Gorontalo'],
	['got', 'Gothic'],
	['grb', 'Grebo'],
	['grc', 'Greek, Ancient (to 1453)'],
	['gre/ell', 'Greek, Modern (1453-)'],
	['grn', 'Guarani'],
	['guj', 'Gujarati'],
	['gwi', 'Gwich\'in'],
	['hai', 'Haida'],
	['hat', 'Haitian; Haitian Creole'],
	['hau', 'Hausa'],
	['haw', 'Hawaiian'],
	['heb', 'Hebrew'],
	['her', 'Herero'],
	['hil', 'Hiligaynon'],
	['him', 'Himachali'],
	['hin', 'Hindi'],
	['hmo', 'Hiri Motu'],
	['hit', 'Hittite'],
	['hmn', 'Hmong'],
	['hun', 'Hungarian'],
	['hup', 'Hupa'],
	['iba', 'Iban'],
	['ice/isl', 'Icelandic'],
	['ido', 'Ido'],
	['ibo', 'Igbo'],
	['ijo', 'Ijo languages'],
	['ilo', 'Iloko'],
	['smn', 'Inari Sami'],
	['inc', 'Indic languages'],
	['ine', 'Indo-European languages'],
	['ind', 'Indonesian'],
	['inh', 'Ingush'],
	['ina', 'Interlingua (International Auxiliary Language Association)'],
	['ile', 'Interlingue; Occidental'],
	['iku', 'Inuktitut'],
	['ipk', 'Inupiaq'],
	['ira', 'Iranian languages'],
	['gle', 'Irish'],
	['mga', 'Irish, Middle (900-1200)'],
	['sga', 'Irish, Old (to 900)'],
	['iro', 'Iroquoian languages'],
	['ita', 'Italian'],
	['jpn', 'Japanese'],
	['jav', 'Javanese'],
	['jrb', 'Judeo-Arabic'],
	['jpr', 'Judeo-Persian'],
	['kbd', 'Kabardian'],
	['kab', 'Kabyle'],
	['kac', 'Kachin; Jingpho'],
	['kal', 'Kalaallisut; Greenlandic'],
	['xal', 'Kalmyk; Oirat'],
	['kam', 'Kamba'],
	['kan', 'Kannada'],
	['kau', 'Kanuri'],
	['krc', 'Karachay-Balkar'],
	['kaa', 'Kara-Kalpak'],
	['krl', 'Karelian'],
	['kar', 'Karen languages'],
	['kas', 'Kashmiri'],
	['csb', 'Kashubian'],
	['kaw', 'Kawi'],
	['kaz', 'Kazakh'],
	['kha', 'Khasi'],
	['khi', 'Khoisan languages'],
	['kho', 'Khotanese; Sakan'],
	['kik', 'Kikuyu; Gikuyu'],
	['kmb', 'Kimbundu'],
	['kin', 'Kinyarwanda'],
	['kir', 'Kirghiz; Kyrgyz'],
	['tlh', 'Klingon; tlhIngan-Hol'],
	['kom', 'Komi'],
	['kon', 'Kongo'],
	['kok', 'Konkani'],
	['kor', 'Korean'],
	['kos', 'Kosraean'],
	['kpe', 'Kpelle'],
	['kro', 'Kru languages'],
	['kua', 'Kuanyama; Kwanyama'],
	['kum', 'Kumyk'],
	['kur', 'Kurdish'],
	['kru', 'Kurukh'],
	['kut', 'Kutenai'],
	['lad', 'Ladino'],
	['lah', 'Lahnda'],
	['lam', 'Lamba'],
	['day', 'Land Dayak languages'],
	['lao', 'Lao'],
	['lat', 'Latin'],
	['lav', 'Latvian'],
	['lez', 'Lezghian'],
	['lim', 'Limburgan; Limburger; Limburgish'],
	['lin', 'Lingala'],
	['lit', 'Lithuanian'],
	['jbo', 'Lojban'],
	['dsb', 'Lower Sorbian'],
	['nds', 'Low German; Low Saxon; German, Low; Saxon, Low'],
	['loz', 'Lozi'],
	['lub', 'Luba-Katanga'],
	['lua', 'Luba-Lulua'],
	['lui', 'Luiseno'],
	['smj', 'Lule Sami'],
	['lun', 'Lunda'],
	['luo', 'Luo (Kenya and Tanzania)'],
	['lus', 'Lushai'],
	['ltz', 'Luxembourgish; Letzeburgesch'],
	['mac/mkd', 'Macedonian'],
	['mad', 'Madurese'],
	['mag', 'Magahi'],
	['mai', 'Maithili'],
	['mak', 'Makasar'],
	['mlg', 'Malagasy'],
	['mal', 'Malayalam'],
	['may/msa', 'Malay'],
	['mlt', 'Maltese'],
	['mnc', 'Manchu'],
	['mdr', 'Mandar'],
	['man', 'Mandingo'],
	['mni', 'Manipuri'],
	['mno', 'Manobo languages'],
	['glv', 'Manx'],
	['mao/mri', 'Maori'],
	['arn', 'Mapudungun; Mapuche'],
	['mar', 'Marathi'],
	['chm', 'Mari'],
	['mah', 'Marshallese'],
	['mwr', 'Marwari'],
	['mas', 'Masai'],
	['myn', 'Mayan languages'],
	['men', 'Mende'],
	['mic', 'Mi\'kmaq; Micmac'],
	['min', 'Minangkabau'],
	['mwl', 'Mirandese'],
	['moh', 'Mohawk'],
	['mdf', 'Moksha'],
	['mon', 'Mongolian'],
	['lol', 'Mongo'],
	['mkh', 'Mon-Khmer languages'],
	['mos', 'Mossi'],
	['mul', 'Multiple languages'],
	['mun', 'Munda languages'],
	['nah', 'Nahuatl languages'],
	['nau', 'Nauru'],
	['nav', 'Navajo; Navaho'],
	['nde', 'Ndebele, North; North Ndebele'],
	['nbl', 'Ndebele, South; South Ndebele'],
	['ndo', 'Ndonga'],
	['nap', 'Neapolitan'],
	['new', 'Nepal Bhasa; Newari'],
	['nep', 'Nepali'],
	['nia', 'Nias'],
	['nic', 'Niger-Kordofanian languages'],
	['ssa', 'Nilo-Saharan languages'],
	['niu', 'Niuean'],
	['nqo', 'N\'Ko'],
	['nog', 'Nogai'],
	['zxx', 'No linguistic content; Not applicable'],
	['non', 'Norse, Old'],
	['nai', 'North American Indian languages'],
	['frr', 'Northern Frisian'],
	['sme', 'Northern Sami'],
	['nor', 'Norwegian'],
	['nno', 'Norwegian Nynorsk; Nynorsk, Norwegian'],
	['nub', 'Nubian languages'],
	['nym', 'Nyamwezi'],
	['nyn', 'Nyankole'],
	['nyo', 'Nyoro'],
	['nzi', 'Nzima'],
	['oci', 'Occitan (post 1500); Provençal'],
	['arc', 'Official Aramaic (700-300 BCE); Imperial Aramaic (700-300 BCE)'],
	['oji', 'Ojibwa'],
	['ori', 'Oriya'],
	['orm', 'Oromo'],
	['osa', 'Osage'],
	['oss', 'Ossetian; Ossetic'],
	['oto', 'Otomian languages'],
	['pal', 'Pahlavi'],
	['pau', 'Palauan'],
	['pli', 'Pali'],
	['pam', 'Pampanga; Kapampangan'],
	['pag', 'Pangasinan'],
	['pan', 'Panjabi; Punjabi'],
	['pap', 'Papiamento'],
	['paa', 'Papuan languages'],
	['nso', 'Pedi; Sepedi; Northern Sotho'],
	['peo', 'Persian, Old (ca.600-400 B.C.)'],
	['per/fas', 'Persian'],
	['phi', 'Philippine languages'],
	['phn', 'Phoenician'],
	['pon', 'Pohnpeian'],
	['pol', 'Polish'],
	['por', 'Portuguese'],
	['pra', 'Prakrit languages'],
	['pro', 'Provençal, Old (to 1500)'],
	['pus', 'Pushto; Pashto'],
	['que', 'Quechua'],
	['raj', 'Rajasthani'],
	['rap', 'Rapanui'],
	['rar', 'Rarotongan; Cook Islands Maori'],
	['qtz', 'Reserved for local use qaa'],
	['roa', 'Romance languages'],
	['rum/ron', 'Romanian; Moldavian; Moldovan'],
	['roh', 'Romansh'],
	['rom', 'Romany'],
	['run', 'Rundi'],
	['rus', 'Russian'],
	['sal', 'Salishan languages'],
	['sam', 'Samaritan Aramaic'],
	['smi', 'Sami languages'],
	['smo', 'Samoan'],
	['sad', 'Sandawe'],
	['sag', 'Sango'],
	['san', 'Sanskrit'],
	['sat', 'Santali'],
	['srd', 'Sardinian'],
	['sas', 'Sasak'],
	['sco', 'Scots'],
	['sel', 'Selkup'],
	['sem', 'Semitic languages'],
	['srp', 'Serbian'],
	['srr', 'Serer'],
	['shn', 'Shan'],
	['sna', 'Shona'],
	['iii', 'Sichuan Yi; Nuosu'],
	['scn', 'Sicilian'],
	['sid', 'Sidamo'],
	['sgn', 'Sign Languages'],
	['bla', 'Siksika'],
	['snd', 'Sindhi'],
	['sin', 'Sinhala; Sinhalese'],
	['sit', 'Sino-Tibetan languages'],
	['sio', 'Siouan languages'],
	['sms', 'Skolt Sami'],
	['den', 'Slave (Athapascan)'],
	['sla', 'Slavic languages'],
	['slo/slk', 'Slovak'],
	['slv', 'Slovenian'],
	['sog', 'Sogdian'],
	['som', 'Somali'],
	['son', 'Songhai languages'],
	['snk', 'Soninke'],
	['wen', 'Sorbian languages'],
	['sot', 'Sotho, Southern'],
	['sai', 'South American Indian (Other)'],
	['alt', 'Southern Altai'],
	['sma', 'Southern Sami'],
	['spa', 'Spanish; Castilian'],
	['srn', 'Sranan Tongo'],
	['suk', 'Sukuma'],
	['sux', 'Sumerian'],
	['sun', 'Sundanese'],
	['sus', 'Susu'],
	['swa', 'Swahili'],
	['ssw', 'Swati'],
	['swe', 'Swedish'],
	['gsw', 'Swiss German; Alemannic; Alsatian'],
	['syr', 'Syriac'],
	['tgl', 'Tagalog'],
	['tah', 'Tahitian'],
	['tai', 'Tai languages'],
	['tgk', 'Tajik'],
	['tmh', 'Tamashek'],
	['tam', 'Tamil'],
	['tat', 'Tatar'],
	['tel', 'Telugu'],
	['ter', 'Tereno'],
	['tet', 'Tetum'],
	['tha', 'Thai'],
	['tib/bod', 'Tibetan'],
	['tig', 'Tigre'],
	['tir', 'Tigrinya'],
	['tem', 'Timne'],
	['tiv', 'Tiv'],
	['tli', 'Tlingit'],
	['tkl', 'Tokelau'],
	['tpi', 'Tok Pisin'],
	['tog', 'Tonga (Nyasa)'],
	['ton', 'Tonga (Tonga Islands)'],
	['tsi', 'Tsimshian'],
	['tso', 'Tsonga'],
	['tsn', 'Tswana'],
	['tum', 'Tumbuka'],
	['tup', 'Tupi languages'],
	['ota', 'Turkish, Ottoman (1500-1928)'],
	['tur', 'Turkish'],
	['tuk', 'Turkmen'],
	['tvl', 'Tuvalu'],
	['tyv', 'Tuvinian'],
	['twi', 'Twi'],
	['udm', 'Udmurt'],
	['uga', 'Ugaritic'],
	['uig', 'Uighur; Uyghur'],
	['ukr', 'Ukrainian'],
	['umb', 'Umbundu'],
	['mis', 'Uncoded languages'],
	['und', 'Undetermined'],
	['hsb', 'Upper Sorbian'],
	['urd', 'Urdu'],
	['uzb', 'Uzbek'],
	['vai', 'Vai'],
	['ven', 'Venda'],
	['vie', 'Vietnamese'],
	['vol', 'Volapük'],
	['vot', 'Votic'],
	['wak', 'Wakashan languages'],
	['wal', 'Walamo'],
	['wln', 'Walloon'],
	['war', 'Waray'],
	['was', 'Washo'],
	['wel/cym', 'Welsh'],
	['fry', 'Western Frisian'],
	['wol', 'Wolof'],
	['xho', 'Xhosa'],
	['sah', 'Yakut'],
	['yao', 'Yao'],
	['yap', 'Yapese'],
	['yid', 'Yiddish'],
	['yor', 'Yoruba'],
	['ypk', 'Yupik languages'],
	['znd', 'Zande languages'],
	['zap', 'Zapotec'],
	['zza', 'Zaza; Dimili; Dimli; Kirdki; Kirmanjki; Zazaki'],
	['zen', 'Zenaga'],
	['zha', 'Zhuang; Chuang'],
	['zul', 'Zulu'],
	['zun', 'Zuni'] ]


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
		item.id = from.options[i].id;
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
				}else{
					newOption.value = stripTrailingDash(stripExtension(stripQuotes(toChange.value)));
					newOption.label = stripTrailingDash(stripExtension(stripQuotes(toChange.label)));
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

/*
 * My roots are too deep in procedural programming... generatePopup#() was the
 * best way I could think to handle only getting results from SPARQL queries
 * through callbacks
 */
function generatePopup1(){
	var userLangs = getPreferencesFromCookie();
	if ( userLangs != null ) {
		findLanguagesFromCodes(userLangs, 
				function(){Ext.Msg.alert('Error', 'We were unable to retrieve language information. Another means should be implemented.');}, 
				generatePopup2);
	}else{
		generatePopup2(null);
	}
}

function generatePopup2(defaultLanguages){

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
		item.label = ds[i][1];
		item.id = item.value;
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

	// first, convert defaultLanguages from json -> 2D-array
	defaultsAsArray = new Array();
	if ( defaultLanguages != null && defaultLanguages.results.bindings.length > 0 ){
		for ( var i=0 ; i<defaultLanguages.results.bindings.length ; i++ ){
			defaultsAsArray[i] = [defaultLanguages.results.bindings[i].code.value, defaultLanguages.results.bindings[i].lang.value];
		}
		// used for getting toList in the proper order
		var cookie = getPreferencesFromCookie(); 
		userLangsFromCookie = cookie.split(',');
	}
	else{
		// we had no preferences stored in cookie
		userLangsFromCookie = '';
	}


	var toList = document.createElement('select');
	toList.size = '10';
	toList.id = 'toList';
	toList.ondblclick = editLanguage;

	// In getting the full language names, we lost the user's order preference
	// iterate over their preferences and compare with the code/language pairs
	// that we have.
	ordered_iteration:
	for ( var i=0; i<userLangsFromCookie.length; i++ ){
		var code = stripExtension(stripQuotes(userLangsFromCookie[i]));
		var extension = getExtension(stripQuotes(userLangsFromCookie[i]));
		for ( var j=0; j<defaultsAsArray.length; j++){

			if ( defaultsAsArray[j][0] == code ){
				var item = document.createElement('option');
				item.value = defaultsAsArray[j][0];
				item.label = defaultsAsArray[j][1];
				if ( extension != '' ){
					item.value += '-'+extension;
					item.label += '-'+extension;
				}
				item.id = item.label;
				item.appendChild(document.createTextNode(item.label));
				toList.appendChild(item);

				continue ordered_iteration;
			}
		}
		Ext.Msg.alert('Error: Couldn\'t find code \'' + code + "'");
	}

	col3.appendChild(toList);

    var form = new Ext.form.FormPanel({
        width:700,
        bodyStyle: 'padding:10px;',
		contentEl: table,
        
        buttons: [{
            text: 'Save',
            handler: function(){
						var cookieDeclare = 'languagePreferences='
						for( var i=0; i<toList.options.length; i++){
							cookieDeclare += "'" + toList.options[i].value + "',";
						}
						cookieDeclare = cookieDeclare.substring(0, cookieDeclare.length - 1);

						var cookieDate = new Date();
						// we will give this cookie a year
						cookieDate.setTime(cookieDate.getTime()+(365*24*60*60*1000));
						cookieDeclare += '; expires=' + cookieDate.toGMTString();

						document.cookie = cookieDeclare;
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
 * finds the languages for a given array language code - <code>values</code>
 */
function findLanguagesFromCodes(codes, onFail, onSuccess){
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
