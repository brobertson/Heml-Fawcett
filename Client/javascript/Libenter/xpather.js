/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XPather - a firefox extension.
 *
 * The Initial Developer of the Original Code is
 * Viktor Zigo <xpather@alephzarro.com>.
 * Portions created by the Initial Developer are Copyright (C) 2005-2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
 /* XPather,  Author: Viktor Zigo, http://xpath.alephzarro.com */
function walkUp(node, depth, maxDepth, aSentinel, aDefaultNS, kwds)
{
    //log(depth+" node:"+node.nodeName +" aSentinel:"+aSentinel.nodeName);
    var str = "";
    if(!node) return "";
    if(node==aSentinel) return ".";
    if((node.parentNode) && (depth < maxDepth)) {
        str += walkUp(node.parentNode, depth + 1, maxDepth, aSentinel, aDefaultNS, kwds);
    }
    //log(node+'  '+node.nodeName +'  type:'+node.nodeType+ ' exp:'+Node.ELEMENT_NODE);
    switch (node.nodeType) {
        case Node.ELEMENT_NODE:{
                var nname = node.localName;
                var conditions = [];
                var hasid = false;
                if (kwds['showClass'] && node.hasAttribute('class')) conditions.push("@class='"+node.getAttribute('class')+"'");
                if (kwds['showId'] && node.hasAttribute('id')) {
                    conditions.push("@id='"+node.getAttribute('id')+"'");
                    hasid = true;
                }
                    
                //not identified by id?
                if(!hasid){
                    var index = siblingIndex(node);
                    //more than one sibling?
                    if (index) {
                        //are there also other conditions?
                        if (conditions.length>0) conditions.push('position()='+index);
                        else conditions.push(index);
                    }
    
                }
                if (kwds['showNS']){
                    if(node.prefix) nname=node.prefix+":"+nname;
                    else if (aDefaultNS) nname="default:"+nname;
                }
                if (kwds['toLowercase']) nname=nname.toLowerCase();
                str += "/"+nname;
                
                if(conditions.length>0){
                    str+="[";
                    for(var i=0;i<conditions.length; i++){
                        if (i>0) str+=' and ';
                        str+=conditions[i];
                    }
                    str+="]";
                }
                break;
            }
        case Node.DOCUMENT_NODE:{
            break;
        }
        case Node.TEXT_NODE:{
            //str='string('+str+')';
            str+='/text()';
            var index = siblingIndex(node);
            if (index) str+="["+index+"]";
            break;
        }
        
    }
    return str;            
}

// gets index of aNode (relative to other same-tag siblings)
// first position = 1; returns null if the component is the only one 
function siblingIndex(aNode){
    var siblings = aNode.parentNode.childNodes;
    var allCount = 0;
    var position;

    if (aNode.nodeType==Node.ELEMENT_NODE){
        var name = aNode.nodeName;
        for (var i=0; i<siblings.length; i++){
            var node = siblings.item(i);
            if (node.nodeType==Node.ELEMENT_NODE){
                if (node.nodeName == name) allCount++;  //nodeName includes namespace
                if (node == aNode) position = allCount;
            }
        }
    }
    else if (aNode.nodeType==Node.TEXT_NODE){
        for (var i=0; i<siblings.length; i++){
            var node = siblings.item(i);
            if (node.nodeType==Node.TEXT_NODE){
                allCount++;
                if (node == aNode) position = allCount;
            }
        }
    }
    if (allCount>1) return position;
    return null
}



function generateXPath(aNode, aSentinel, aDefaultNS, kwds){
    //log('default:'+aDefaultNS);
    return walkUp(aNode,0,99, aSentinel, aDefaultNS, kwds);
}

var xpathEvaluator; //shared XPath evaluator

//validates given XPath, returns nsXPathExpression if valid, null otherwise
function getValidXpath(anXpath, aContextNode, aDefaultNS){
    if (!anXpath || anXpath=='/' || anXpath=='.') return;
    
    // if (!xpathEvaluator) 
    xpathEvaluator = new XPathEvaluator(); //lazy creation of global evaluator

    try {
        var nsResolver;
        if (aContextNode || aDefaultNS){
            var originalResolver = xpathEvaluator.createNSResolver(aContextNode);
            //nsResolver=originalResolver;
            //var defNs=findDefautNS(aContextNode);
            if (aDefaultNS){
                nsResolver = function lookupNamespaceURI(aPrefix) {
                        //log('prefix:'+aPrefix);
                        if (aPrefix=='default') {
                            return aDefaultNS;
                        }
                        return originalResolver.lookupNamespaceURI(aPrefix); 
                    }
            }
            else nsResolver = originalResolver;
            //log("foo:"+nsResolver.lookupNamespaceURI("foo"));
            //log("bar:"+nsResolver.lookupNamespaceURI("bar"));
            //log("alias:"+nsResolver.lookupNamespaceURI("alias"));
        }
        else log("no context node");
        //log('expression:'+anXpath+'   '+aContextNode+ '    res:'+nsResolver);
        return xpathEvaluator.createExpression(anXpath, nsResolver);
    }
    catch(ex) {
        //log(ex);  //swallow any exception
        return null
    }
}
/*
function NSResolver(prefix) {
    log("PREFIX:"+prefix);
  if(prefix == 'html') {
    return 'http://www.w3.org/1999/xhtml';
  }
  else if(prefix == 'xul') {
    return 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
  }
  else  {
  //this shouldn't ever happen
          return 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
    //return null;
  }
}
*/

function findDefautNS(aContextNode){
    var element=aContextNode;
    while (element){
        if ((element.nodeType==Node.ELEMENT_NODE)
            &&(element.hasAttribute('xmlns'))) return element.getAttribute('xmlns');
        element=element.parentNode;
    }
    return null;
}

// get the best possible context node to be used as NameSpace Resolver
function getNSResolutionNode(){
    //var nsnode =  lastXPathGeneration.selectedNode;
    var nsnode =  expatState.getCurrentNode();
    if (nsnode.nodeType == Node.DOCUMENT_NODE) nsnode=nsnode.documentElement;
    //if not found, try its elementDocument
    if(!nsnode){
        var ctxtNode = expatState.getContextNode();
        nsnode = ctxtNode.ownerDocument == null 
                    ? ctxtNode.documentElement 
                    : ctxtNode.ownerDocument.documentElement;
    }
    return nsnode;
}

function onXPathTextChange(aTextBox){
    var text = aTextBox.value;
    var nsNode  = getNSResolutionNode();

    if (getValidXpath(text, nsNode, expatState.getDefaultNS()) )aTextBox.style.color = "black";
    else aTextBox.style.color = "red";
}

function evaluateXPath(aContextNode, aXPath) {
    try{
        var nsNode  = getNSResolutionNode();
        var expr = getValidXpath(aXPath, nsNode, expatState.getDefaultNS());
        if (expr){
            //log('EVAL:'+aContextNode);
            var res =  expr.evaluate(aContextNode, XPathResult.ANY_TYPE, null);
        }
        else return null;
        /*var nsResolver;
        xpathEvaluator = new XPathEvaluator();
        if (aContextNode){
            nsResolver = xpathEvaluator.createNSResolver(
                aContextNode.ownerDocument == null 
                    ? aContextNode.documentElement 
                    : aContextNode.ownerDocument.documentElement);
        }
        var res = xpathEvaluator.evaluate(aXPath, aContextNode, nsResolver, XPathResult.ANY_TYPE, null);*/
    }
    catch (e){
        alert( getBundle().getFormattedString("xpather.wrnRegexpSyntax2", [e.message]) );
        return null;
    }
    //dispatch type
    switch (res.resultType) {
        case XPathResult.STRING_TYPE:{
            window.alert(getBundle().getFormattedString("msgRetString", [res.stringValue]) );
            return null;
        }
        case XPathResult.NUMBER_TYPE:{
            window.alert(getBundle().getFormattedString("msgRetNumber", [res.numberValue]) );
            return null;
        }
        case XPathResult.BOOLEAN_TYPE:{
            window.alert(getBundle().getFormattedString("msgRetBoolean", [res.booleanValue]) );
             return null;
        }
    }
    //loadthem
    var foundNodes = new Array();
    var item = res.iterateNext()
    while (item){
        foundNodes.push(item);
        item = res.iterateNext()
    }
    return foundNodes;
}


   // evaluates anXPath in all frames of the aWindow (including aWindow)
   function evaluateXPathFrames(anXPath) {
       //log("CROSSFRAME:"+anXPath);
       var frames=expatState.getFrames();
       var docs = frames.getAllDocuments();
       //ilog("CROSSFRAME:"+docs);
       
       var foundNodes = new Array();
       for(var i=0; i<docs.length; i++){
           foundNodes=foundNodes.concat( evaluateXPath(docs[i], anXPath));
       }
       return foundNodes;
   } 

//frame association object
function Frame(aNode){
    this.frameNode=aNode;
    this.frameDoc=aNode.ownerDocument;
    this.frameContent=aNode.contentDocument;
    this.frameUri=aNode.src;
//    log("NEWFRAME:"+this.frameUri);
}
Frame.prototype = {
    getXPath: function(kwds){
        return generateXPath(this.frameNode, null, null, kwds);
    },
    toString: function(){
        return "frm:"+this.frameNode + " doc:"+this.frameDoc 
            + "cnt:"+this.frameContent+" xpath:"+this.getXPath()+ " uri:"+this.frameUri+"\n";
    }
}


function Frames(aRootDoc){
    this.refresh(aRootDoc);
}

Frames.prototype = {
    rootDoc:null,
    frames:[],
    refresh:function(aRootDoc){
        this.rootDoc = aRootDoc;
        this.frames = [];
        //log('DBG: FRAMESING '+aRootDoc);
        this._collectFrames(this.rootDoc);        
//~         this._addAll( this.rootDoc.getElementsByTagName("frame"));
//~         this._addAll( this.rootDoc.getElementsByTagName("iframe"));
//~         this._addAll( this.rootDoc.getElementsByTagNameNS(XULNSURI, "browser"));
//~         this._addAll( this.rootDoc.getElementsByTagNameNS(XULNSURI, "tabbrowser"));
//~         this._addAll( this.rootDoc.getElementsByTagNameNS(XULNSURI, "editor"));
    },
    _collectFrames:function(aDocNode) {
        var immediateFrames = []
        var XULNSURI = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        this._concatCollection( aDocNode.getElementsByTagName("frame"), immediateFrames );
        this._concatCollection( aDocNode.getElementsByTagName("iframe"), immediateFrames );
        this._concatCollection( aDocNode.getElementsByTagNameNS(XULNSURI, "browser"), immediateFrames );
        this._concatCollection( aDocNode.getElementsByTagNameNS(XULNSURI, "tabbrowser"), immediateFrames );
        this._concatCollection( aDocNode.getElementsByTagNameNS(XULNSURI, "editor"), immediateFrames );
        
        this._addAll( immediateFrames );
        for (var i=0; i<immediateFrames.length; i++) {
            //log('DBG: RECURSING: '+immediateFrames[i]);
            var frameDocument = immediateFrames[i].contentDocument;
            if (frameDocument)
               this._collectFrames(frameDocument);
        }
    } ,
    _concatCollection:function(aCollection, anArray){
        for (var i=0; i<aCollection.length; i++) anArray.push( aCollection.item(i) );
        return anArray;
    },
    _addAll:function(nodelist){
        for (var i=0; i<nodelist.length; i++) this.frames.push( new Frame(nodelist[i]) )
    },
    getAllDocuments:function(){
        var alldoc = new Array(this.rootDoc);
        for (var i in this.frames) alldoc.push( this.frames[i].frameContent);
        return alldoc;
    },
    toString:function(){
        var str ="";
        for(var i in this.frames) {
            str+=this.frames[i].toString();
        }
        return str;
    }
}


//generates XPath if necessary;  aNode-can be omitted, the actual xpath is regenerated (change of preferences)
function displayXPath(aNode){
    var text = null;
    if (aNode){
        //change of a selected node
        text = generateXPath(aNode, expatState.getContextNodeNull(), expatState.getDefaultNS(), prepareKwds() );
        lastXPathGeneration.update(aNode, text);
    }
    else if (lastXPathGeneration.generatedXpath==document.getElementById('xpatherText').value)
    {
        //preferences changed, and the xpath text was not manually changed
        text = generateXPath(lastXPathGeneration.selectedNode, expatState.getContextNodeNull(), 
            expatState.getDefaultNS(), prepareKwds() );
        lastXPathGeneration.update(lastXPathGeneration.selectedNode, text);
    }
    else ;//alert("Preferences changed. However, the displayed XPath cannot be regenerated as it does not correspond to the selected node.");
    
    //update text in the text field
    if (text) setXPathText(text);
    //printObject(viewer);
}

function setXPathText(aText){
        var textBox = document.getElementById('xpatherText');
        textBox.value=aText;
        onXPathTextChange(textBox);    
}

function flashNode(aNode){
    if (!aNode) return;
    if (expatState.getDOMViewer())
        expatState.getDOMViewer().flashElement( aNode);
    else ; //TODO highlight in other way
}

function selectNodeInTree(aNode){
    if (!aNode) return;
    if (expatState.getDOMViewer())
    {
        var domViewer = expatState.getDOMViewer();
        domViewer.selectElementInTree(aNode);
    }
}

//needed for xpath text updates (to distinguish what was evaluated from what is the actual value)
var lastXPathGeneration = {
    selectedNode:null,
    generatedXpath:null,
    updateItself:function(){ //NOT USED!!
        this.generatedXpath = document.getElementById('xpatherText').value;
        var idx = viewer.mDOMTree.currentIndex;
        this.selectedNode = viewer.getNodeFromRowIndex(idx);
        //alert(evaluatedText+ "   node:"+selectedNode);
    },
    update:function(aNode,anXpath){
        this.generatedXpath = anXpath;
        this.selectedNode = aNode;
    }
}


function setAttrValue(anID, anAttrName, aValue){
    var node = document.getElementById(anID);
    if (node) node.setAttribute(anAttrName, aValue);
    else log("Element id:"+anID+" not found");
}

function getAttrValue(anID, anAttrName){
    var node = document.getElementById(anID);
    if (node) return node.getAttribute(anAttrName);
    else log("Element id:"+anID+" not found");
    return null
} 

function toggle(anElement){
    var id = anElement.observes;
    var old = 'true'==getAttrValue(id,"checked");
    setAttrValue(id,"checked", !old);
    //update the xpath
    onSettingChanged();
    //window.alert(id +"=" +getAttrValue(id,"checked") + "   "+ (id=="cmd:toggleExpToLowercase") );
}


// hack needed to fix persistent radios
function toggleRadio(anElement){
   //alert( getAttrValue("idResultHiddenHack","checked") ); 
    setAttrValue("idResultHiddenHack","checked", (anElement.id=="idResultsSelect"));    
}

// hack needed to fix persistent radios
function setRadioHack(){
    var hack = 'true'==getAttrValue("idResultHiddenHack","checked");
    setAttrValue("idResultsSelect","checked", hack);
    setAttrValue("idResultsBrowse","checked", !hack);
}

      
function prepareKwds(){
    var kwds = new Array();
    kwds['toLowercase']=getAttrValue("cmd:toggleExpToLowercase","checked")=='true';
    kwds['showId']=getAttrValue("cmd:toggleExpShowId","checked")=='true';
    kwds['showClass']=getAttrValue("cmd:toggleExpShowClass","checked")=='true';
    kwds['showNS']=getAttrValue("cmd:toggleExpShowNS","checked")=='true';
    kwds['crossFrame']=isCrossFrame();
    kwds['parentView']=isParentView();
    kwds['regexpView']=isRegexpView();
    //printObject(kwds);
    return kwds;
}

function isParentView(){
    return getAttrValue("cmd:toggleExpParentView","checked")=='true';
}

function isRegexpView(){
    return getAttrValue("cmd:toggleExpRegexpView","checked")=='true';
}

function isCrossFrame(){
    return getAttrValue("cmd:toggleCrossFrame","checked")=='true';
}

function showResultsInBrowser(){
    return getAttrValue("idResultsBrowse","checked")=='true';
}
function showResultsSelected(){
    return getAttrValue("idResultsSelect","checked")=='true';
}

function openCheatsheet(){
    window.open("chrome://xpather/content/cheatwin.xul","xpath_cheat","chrome,centerscreen,resizable");
}
    
//sets the "parent node"  (used for relative xpaths)
function setParentNode(aNode, aText){
    document.getElementById('parentText').value=aText;
    expatState.contextNode = aNode;
    expatState.defaultNsUri=findDefautNS(aNode);
    setXPathText("./."); // return self
}

//clears the "parent node" (used for relative xpaths)
function clearParentNode(){
    document.getElementById('parentText').value = "";
    expatState.contextNode = null;
    expatState.defaultNsUri=null;
    //regenerate the path in the xpathText (it may turn from relative to absolute) (makes no sense for xpathBrowser.xul)
    displayXPath(null);
}

function setDefaultRegexp(){
        document.getElementById('regexpText').value = "/(.*)/";
}

function setDefaultSubst(){
    var regexp = document.getElementById('regexpText').value;
    var count = regexp.split(/[^\\]\(/).length-1; //search for parentheses (not escaped)
    if (count>0){
        var s='';
        for(var i=1; i<=count; i++ ) s+='$'+i+' ';
        document.getElementById('substText').value = s;
    }
}

function getClipboard(){
    return XPC.getService("@mozilla.org/widget/clipboardhelper;1", "nsIClipboardHelper");
}

var xpatherWindow;
//opens or update the xpatherBowser window
function openXPatherWindow(){
    if (!xpatherWindow || xpatherWindow.closed){
        //window opens asynchronously... so you cannot call methods immediately
        xpatherWindow = window.open("chrome://xpather/content/xpathBrowser.xul","xpather_results","chrome,centerscreen,alwaysRaised=true,resizable");
    }
    else xpatherWindow.updateWindow(expatState, isCrossFrame());
}

function getBundle(){
    return document.getElementById("xpathStrings");
}

var XPC = {
    getService: function(aCID, anInterface){
        try {
            return Components.classes[aCID].getService(Components.interfaces[anInterface]);
        } catch (ex) {
            log("Error getting service: "+ aCID +" iface:" + anInterface + "\n" + ex);
            return null;
        }
    }
}


function printObject(obj){
    var str = obj + "\n";
    for (a in obj) {
        str += a + ": " + obj[a] + "\n";
    }
    window.alert(str);
}

function log(msg){
 // var csClass = Components.classes['@mozilla.org/consoleservice;1'];
 // var cs = csClass.getService(Components.interfaces.nsIConsoleService);
 // cs.logStringMessage(msg);
}
