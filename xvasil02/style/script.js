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
    	
		if (Node.nodeName == "BR" || Node.nodeName == "HR") {
			return;
		}

		if (Node.nodeType == NODE_TEXT) {
			var trimmed = Node.nodeValue.trim();
			if (trimmed == "" || trimmed == "\n") {
				return;
			}
		}
    	for (var i=0;i<Lev * 3;i++) {
			domInspectorOutput += "&nbsp;&nbsp;";

       	} // for

	    var elementCssPath = getCssPath(Node);   	
	    // console.log(Node);

	   	if (Node.nodeType != NODE_TEXT && (Node.parentNode.nodeName != "HEAD" && Node.parentNode.nodeName != "HTML" && Node.nodeName != "HTML" && Node.nodeName != "SCRIPT")) {
		   	var name = (!Node.nodeName) ? "" : Node.nodeName; 
		   	var classes = (!Node.classList) ? "" : Node.classList; 
	   		var id = (!Node.id) ? "" : Node.id; 
	   		var domInspectorId1 = "cl";
	   		var domInspectorId2 = "id";


	   		domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + name + ": " + "classes: <input type='text' name='" 
	   				+ domInspectorId1 + "' value='" + classes + "'> id: <input type='text' name='" + domInspectorId2 + "' value='" + id + "'></div><br>";
	    	DumpNodes (Node.childNodes, Lev+1);

	   	}
	   	else if (Node.parentNode.nodeName == "HEAD" || Node.parentNode.nodeName == "HTML" || Node.nodeName == "HTML" || Node.nodeName == "SCRIPT") {
	   		var name = (Node.nodeName === undefined) ? "NAME" : Node.nodeName; 
   			domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + name + "</div><br>";
    		DumpNodes (Node.childNodes, Lev+1);
				
	   	}
	   	else {
	   		var trimmed = Node.nodeValue.trim();
	   		// console.log(trimmed);
	   		if (Node.nodeValue && trimmed != "" && trimmed != "\n") {
		   		var domInspectorId1 = "cl";
	   			var domInspectorId2 = "id";
		   		var name = (Node.nodeName === undefined) ? "NAME" : Node.nodeName; 
	   			domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + name + "</div><br>";
	    		DumpNodes (Node.childNodes, Lev+1);
				
			}   	

	   	}

    } // if
 } // DumpNode

var DumpNodes = function (Nodes, Lev) {
	for(var i=0; i<Nodes.length; i++) {
    	DumpNode (Nodes[i], Lev);
 	} // for

} // DumpNodes

function unescapeHTML(escapedHTML) {
  return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

function showDOM() {

	var oldHtml = document.body.innerHTML;
	document.body.innerHTML = "<div id='dom-inspector-wrapper'>" + oldHtml + "</div><div id='dom-inspector-output'></div>";

 	domInspectorOutput="<h1>DOM tree</h1>";

 	var content = document.childNodes;
 	DumpNodes (content, 0);
 	document.getElementById('dom-inspector-output').innerHTML = domInspectorOutput;
 
	document.addEventListener('click', function(e){
    	if (e.target && (e.target.parentNode.id == 'dom-inspector-output' || e.target.parentNode.className == 'dom-inspector-row')) {
    		// console.log(e.target.firstChild);
    		var elems = document.querySelectorAll(".dom-inspector-selected");

			[].forEach.call(elems, function(el) {
			    el.classList.remove("dom-inspector-selected");
			});

			var elems2 = document.querySelectorAll(".dom-inspector-row > span");

 			[].forEach.call(elems2, function(el) {
 				el.classList.remove("dom-inspector-node-selected");
			});

			var path = e.target.innerHTML;
			if (e.target.firstChild) {
				path = e.target.firstChild.innerHTML;
			}
			var res = unescapeHTML(path); 
			// var res = path.replace(new RegExp("\{&gt;}", "g"), ">"); 
    		// console.log(path);
    		// console.log(res);
    		if (res) {
	    		var element = document.querySelector(res);
	    		if (element) {
					element.className += ' dom-inspector-selected';
					element.scrollIntoView();	
	    		}
	    		else {
	    			console.log("NULL");
	    		}
	    	}


    	}
    	else if (e.target && (e.target.parentNode.id != 'dom-inspector-output' && e.target.parentNode.className != 'dom-inspector-row')) {
 			var elems2 = document.querySelectorAll(".dom-inspector-selected");

 			[].forEach.call(elems2, function(el) {
 				el.classList.remove("dom-inspector-selected");
			});

 			var elems = document.querySelectorAll(".dom-inspector-row > span");

 			var elementToHighlight;
 			var i = 0;
 			[].forEach.call(elems, function(el) {
 				el.parentNode.classList.remove("dom-inspector-node-selected");
			    
			    if (el.textContent == getCssPath(e.target)) {
			    	i++;
			    	el.parentNode.className += ' dom-inspector-node-selected';
		    		if (i == 1) {
		    			el.parentNode.scrollIntoView();
		    		}	
			    	// if (el.nodeType != NODE_TEXT) {
				    	// elementToHighlight = el;
					// }
					// console.log(el);
			    }
			    // console.log(el.textContent);
			});

			if (elementToHighlight) {
		    	elementToHighlight.parentNode.className += ' dom-inspector-node-selected';
		    	elementToHighlight.parentNode.scrollIntoView();
			}
 		}
 	});
 	// document.addEventListener('change', function(e){
    	// if (e.target && (e.target.parentNode.className == 'dom-inspector-row')) {
 			// console.log(e.target);
 		// }
 	// });
 	document.addEventListener('keydown', function(e){
    	if (e.target && (e.target.parentNode.className == 'dom-inspector-row')) {
 			if (e.which == 13) {
 				var path = e.target.parentNode.firstChild.innerHTML;
 				var elems = document.querySelectorAll(unescapeHTML(path));
 				[].forEach.call(elems, function(el) {
 					console.log(el);
 					if (e.target.name == "cl") {
 						el.classList = e.target.value;
 					}
 					else if (e.target.name == "id") {
 						if (e.target.value.indexOf(" ") < 0) {
	 						el.id = e.target.value;
 						}
 						else {
 							console.log("INVALID ID");
 						}
 					}

 				});
 			}
 		}
 	});
 }

window.onload = showDOM;