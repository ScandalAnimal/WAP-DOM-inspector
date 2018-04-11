var domInspectorOutput = "";

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


var customPrefix = "did-";
var customId = 0;

function getNextId() {
    return customPrefix + customId++;
}

function getCssPath(Node) {
	var element = Node;
	var path = [];

	while (Node) {

		var name = Node.nodeName;
		if (Node.nodeType == NODE_TEXT) {
			name = "";
		}
		var id = (Node.id) ? ('#' + Node.id) : false; // Get node's ID attribute, adding a '#'.
        var selector = "";

        if (id && (name != "")) {
            selector = name + id; // Matched by ID.
        // } else if (cssClass) {
            // selector = name + cssClass; // Matched by class (will be checked for multiples afterwards).
        } else if (name != "") {
            selector = name;

            var nth = 1;
            for (nth = 1,
                c = Node;
                c !== null && c.previousElementSibling;
                c = c.previousElementSibling,
                nth++);
            	selector += ":nth-child(" + nth + ")";
        }

        // selector = selector.replace(/\.+$/, ''); // Ensure selector doesn't end with a '.'.
        if (selector != "") {
	        path.unshift(selector); // Add this full tag selector to the path array.
        }

		Node = (Node.parentNode !== document) ? Node.parentNode : false; // Go up to the next parent node.
	}

	return path.join(' > ');



}

var DumpNode = function(Node, Lev) {
	if (((Node.nodeType == NODE_ELEMENT) || (Node.nodeType == NODE_TEXT) || (Node.nodeType == NODE_DOCUMENT)) && (Node.id != "dom-inspector-output")) {
    	for (var i=1;i<(Lev-1)*3;i++) {
       		domInspectorOutput += "&nbsp;";
       	} // for

    var elementCssPath = getCssPath(Node);   	
    console.log(elementCssPath);
   	if (Node.nodeType != NODE_TEXT) {
	   	var name = (!Node.nodeName) ? "" : Node.nodeName; 
	   	var classes = (!Node.classList) ? "" : Node.classList; 
   		var id = (!Node.id) ? "" : Node.id; 
   		var domInspectorId = ((!Node.id) || Node.id === "") ? getNextId() : Node.id;
   		var domInspectorId1 = domInspectorId + "-cl";
   		var domInspectorId2 = domInspectorId + "-id";


   		domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + domInspectorId + ": " + name + ": " + "classes: <input type='text' name='" + 
   				+ domInspectorId1 + "' value='" + classes + "'> id: <input type='text' name='" + domInspectorId2 + "' value='" + id + "'></div><br>"
   	}
   	else {
   		var domInspectorId = (Node.id === undefined) ? getNextId() : Node.id;
   		var domInspectorId1 = domInspectorId + "-cl";
   		var domInspectorId2 = domInspectorId + "-id";
	   	var name = (Node.nodeName === undefined) ? "NAME" : Node.nodeName; 
   		domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + domInspectorId + ": " + name + "</div><br>"
   	}

    	DumpNodes (Node.childNodes, Lev);
    } // if
 } // DumpNode

var DumpNodes = function (Nodes, Lev) {
	for(var i=0; i<Nodes.length; i++) {
    	DumpNode (Nodes[i], (Lev+1));
 	} // for

} // DumpNodes

function unescapeHTML(escapedHTML) {
  return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

function showDOM() {

	var oldHtml = document.body.innerHTML;
	document.body.innerHTML = "<div id='dom-inspector-wrapper'>" + oldHtml + "</div><div id='dom-inspector-output'></div>";

 	domInspectorOutput="";

 	var content = document.childNodes;
 	DumpNodes (content, 0);
 	document.getElementById('dom-inspector-output').innerHTML = domInspectorOutput;
 
	document.addEventListener('click', function(e){
    	if (e.target && (e.target.parentNode.id == 'dom-inspector-output' || e.target.parentNode.className == 'dom-inspector-row')) {
    		// console.log(e.target.firstChild.innerHTML);
    		var elems = document.querySelectorAll(".dom-inspector-selected");

			[].forEach.call(elems, function(el) {
			    el.classList.remove("dom-inspector-selected");
			});

			var path = e.target.firstChild.innerHTML;
			var res = unescapeHTML(path); 
			// var res = path.replace(new RegExp("\{&gt;}", "g"), ">"); 
    		console.log(path);
    		console.log(res);
    		var element = document.querySelector(res);
    		if (element) {
				element.className += ' dom-inspector-selected';	
    		}
    		else {
    			console.log("NULL");
    		}


    	}
 		
 	});
 }

window.onload = showDOM;