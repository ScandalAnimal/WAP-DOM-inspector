function Set() {
	var js_news='hidden';
	for (i in document.cookie.split('; '))
	{
		if (document.cookie.split('; ')[i].split('=')[0] == "NEW_1")
		{
			js_news = document.cookie.split('; ')[i].split('=')[1];
		}
	}

	if (js_news == "show")
	{
		document.getElementById("js_news").style.display = 'block';
	}   
	else
	{
		document.getElementById("js_news").style.display = 'none';
	}

}

function Show(element) {
	if (document.getElementById(element).style.display == 'none')    
	{
		document.getElementById(element).style.display = 'block';       
		if (element == "js_news")
		{
			document.cookie = "NEW_1=show";
		}
	}
	else
	{
		document.getElementById(element).style.display = 'none';
		if (element == "js_news")
		{
			document.cookie = "NEW_1=hidden";
		}
	}
}

// var options = {}; // See 'initialise' method for attributes.
// var inspector = new DomInspector(options);

var xmldoc; 
var msg="";

var NODE_ELEMENT     = 1;
// var NODE_ATTRIBUTE   = 2;
var NODE_TEXT        = 3;
// var NODE_CDATA       = 4;
// var NODE_ENTITYREF   = 5;
// var NODE_ENTITY      = 6;
// var NODE_PI          = 7;
// var NODE_COMMENT     = 8;
var NODE_DOCUMENT    = 9;
// var NODE_DOCTYPE     = 10;
// var NODE_DOCFRAG     = 11;
// var NODE_NOTATION    = 12;


// var final = "";
// function addRow(Node) {
    // var div = document.createElement('div');

    // div.className = 'row';

    // final += "5<br>";
   	// div.innerHTML = "<span>" + Node.nodeType + ": " + Node.nodeName + ": " + Node.classList + ": " + Node.id + "</span><br>"
   	// div.innerHTML = "<span>" + Node.nodeType + "</span><br>"

// }

var customPrefix = "did-";
var customId = 0;

function getNextId() {
    return customPrefix + customId++;
}

var DumpNode = function(Node, Lev) {
	if (((Node.nodeType == NODE_ELEMENT) || (Node.nodeType == NODE_TEXT) || (Node.nodeType == NODE_DOCUMENT)) && (Node.id != "dom-inspector-output")) {
	// if ((Node.nodeType == NODE_TEXT)) {
    	for (var i=1;i<(Lev-1)*3;i++) {
       		msg += "&nbsp;";
       	} // for
		// addRow(Node); 
   	// msg = msg + Node.nodeName + "<BR>";
   	if (Node.nodeType != NODE_TEXT) {
	   	var name = (Node.nodeName === undefined) ? "NAME" : Node.nodeName; 
	   	var classes = (Node.classList === undefined) ? "CLASSLIST" : Node.classList; 
   		var id = (Node.id === undefined) ? "DEFAULT_ID" : Node.id; 
   		var domInspectorId = ((Node.id === undefined) || Node.id === "") ? getNextId() : Node.id;
   		// var domInspectorId = getNextId();
   		var domInspectorId1 = domInspectorId + "-cl";
   		var domInspectorId2 = domInspectorId + "-id";


   		msg += "<div class='dom-inspector-row'>" + domInspectorId + ": <strong>" + name + "</strong>: " + "classes: <input type='text' name='" + 
   				+ domInspectorId1 + "' value='" + classes + "'> id: <input type='text' name='" + domInspectorId2 + "' value='" + id + "'></div><br>"
   	}
   	else {
   		var domInspectorId = (Node.id === undefined) ? getNextId() : Node.id;
   		var domInspectorId1 = domInspectorId + "-cl";
   		var domInspectorId2 = domInspectorId + "-id";
	   	var name = (Node.nodeName === undefined) ? "NAME" : Node.nodeName; 
   		msg += "<div class='dom-inspector-row'>" + domInspectorId + ": <strong>" + name + "</strong></div><br>"
   	}



   	// <input type="text" name="FirstName" value="Mickey">
   	// msg += Node.nodeType + ": " + name + ": " + classes + ": " + id + "<br>"

    	DumpNodes (Node.childNodes, Lev);
    } // if
 } // DumpNode

var DumpNodes = function (Nodes, Lev) {
	for(var i=0; i<Nodes.length; i++) {
    	DumpNode (Nodes[i], (Lev+1));
 	} // for
    // document.getElementById('dom-inspector-output').innerHTML = final;

} // DumpNodes

function showDOM() {

	var oldHtml = document.body.innerHTML;
	document.body.innerHTML = "<div id='dom-inspector-wrapper'>" + oldHtml + "</div><div id='dom-inspector-output'></div>";
 	msg="";
 // xmldoc=loadXMLDoc("weatherReport/weatherReport.xml");
 // xmldoc = document.getElementsByTagName("*");
 	xmldoc = document.childNodes;
	console.log("Dlzka: "  + xmldoc.length);
 	DumpNodes (xmldoc, 0);
 	msg = msg + "Konec";
 	document.getElementById('dom-inspector-output').innerHTML = msg;
 
	document.addEventListener('click', function(e){
    	if (e.target && e.target.parentNode.id == 'dom-inspector-output'){//do something
    		console.log("clicked" + e.target);
    	}
 		
 	});
 }

window.onload = showDOM;