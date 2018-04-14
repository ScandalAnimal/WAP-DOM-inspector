// DOM inspector 
// autor: Maros Vasilisin, xvasil02
// 2018


var domInspectorOutput = "";

// posporovane typy DOM uzlov
var NODE_ELEMENT     = 1;
var NODE_TEXT        = 3;
var NODE_DOCUMENT    = 9;

// funkcia urci css cestu k danemu DOM uzlu
function getCssPath(Node) {
	var path = [];

	while (Node !== document) {

		var name = Node.nodeName;
		if (Node.nodeType == NODE_TEXT) { // uzly typu NODE_TEXT sa v css ceste neoznacuju
			name = "";
		}
		var id = (Node.id) ? ('#' + Node.id) : false; // ak ma element id atribut, ten vlozime do css cesty
        var selector = "";

        if (id && (name != "")) {
            selector = name + id; // ak ma element id, rovno vlozime do css cesty
        } else if (name != "") { // ak nema id, musime pouzit nth-child na jednoznacnu identifikaciu 
            selector = name;

            if (Node.nextElementSibling) {

	            var nthchild = 1;

	            for (i = Node; (i !== null && i.previousElementSibling); nthchild++) {
	            	i = i.previousElementSibling;
	            };
	            
	            selector += ":nth-child(" + nthchild + ")";
	        }
        }

        if (selector != "") { // do cesty pridame len neprazdne selektory
	        path.unshift(selector); 
        }

		Node = Node.parentNode; // vynorime sa o jednu uroven vyssie v strome
	}
	return path.join(' > ');
}

var DumpNode = function(Node, Lev) {

	// filter vybranych typov uzlov a nezobrazujeme samotny vystup skriptu
	if (((Node.nodeType == NODE_ELEMENT) || (Node.nodeType == NODE_TEXT) || (Node.nodeType == NODE_DOCUMENT)) && (Node.id != "dom-inspector-output")) {
    	
    	// elementy <br> a <hr> su na stranke ale nezobrazujeme ich
		if (Node.nodeName == "BR" || Node.nodeName == "HR") {
			return;
		}

		// elementy typu NODE_TEXT ktore su len biele znaky tak nezobrazujeme
		if (Node.nodeType == NODE_TEXT) {
			var trimmed = Node.nodeValue.trim();
			if (trimmed == "" || trimmed == "\n") {
				return;
			}
		}

		// odsadenie pre danu uroven zanorenia, pridame medzery do vystupu podla levelu
    	for (var i=0;i<Lev * 3;i++) {
			domInspectorOutput += "&nbsp;&nbsp;";

       	}

       	// ziskame css cestu k damenu uzlu
	    var elementCssPath = getCssPath(Node);

	    // ak sa nejedna o NODE_TEXT a parent nie je <head> ani <html> a zaroven ani element nie je <html> alebo <script>
	   	if (Node.nodeType != NODE_TEXT && (Node.parentNode.nodeName != "HEAD" && Node.parentNode.nodeName != "HTML" && Node.nodeName != "HTML" && Node.nodeName != "SCRIPT")) {
		   	
		   	// ziskanie mena uzlu, zoznamu tried a id
		   	var name = (!Node.nodeName) ? "" : Node.nodeName; 
		   	var classes = (!Node.classList) ? "" : Node.classList; 
	   		var id = (!Node.id) ? "" : Node.id; 
	   		// pomocne oznacenie pre inputy do DOM stromu
	   		var domInspectorId1 = "cl";
	   		var domInspectorId2 = "id";

	   		// vytvorenie elementu ktory zobrazuje dany uzol, zobrazuje meno, zoznam tried a id uzlu
	   		domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + name + ": " + "classes: <input type='text' name='" 
	   				+ domInspectorId1 + "' value='" + classes + "'> id: <input type='text' name='" + domInspectorId2 + "' value='" + id + "'></div><br>";
	    	// rekurzivne zobrazime aj potomkov uzlu o level nizsie
	    	DumpNodes (Node.childNodes, Lev+1);

	   	}
	   	// ak sa jedna o potomka <head> alebo <html> ci konkretne o <html> alebo <script>, nezobrazujeme moznost editacie class ani id
	   	else if (Node.parentNode.nodeName == "HEAD" || Node.parentNode.nodeName == "HTML" || Node.nodeName == "HTML" || Node.nodeName == "SCRIPT") {
	   		var name = (Node.nodeName === undefined) ? "NAME" : Node.nodeName; 
	   		var elementCssPath = getCssPath(Node);
   			domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + name + "</div><br>";
    		DumpNodes (Node.childNodes, Lev+1);
				
	   	}
	   	// ak sa jedna o uzly typu NODE_TEXT
	   	else {
	   		var trimmed = Node.nodeValue.trim();
	   		if (Node.nodeValue && trimmed != "" && trimmed != "\n") { // zobrazujeme len neprazdne texty, tie prazdne aj tak nejde zobrazit
		   		var domInspectorId1 = "cl";
	   			var domInspectorId2 = "id";
		   		var name = (Node.nodeName === undefined) ? "NAME" : Node.nodeName; 
	   			domInspectorOutput += "<div class='dom-inspector-row'><span>" + elementCssPath + "</span>" + name + "</div><br>";
	    		DumpNodes (Node.childNodes, Lev+1);
				
			}   	

	   	}

    }
 }

// prechadzame vsetky uzly a postupne ich zobrazujeme na spravnej urovni
var DumpNodes = function (Nodes, Lev) {
	for (var i = 0; i < Nodes.length; i++) {
    	DumpNode (Nodes[i], Lev);
 	}
}

// v stringu nahradime zastupne kodovane znaky &lt; &gt; &amp; za <, > a & pre korektne fungovanie css
function unescapeHTML(escapedHTML) {
  return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

// zmazanie oznacenia elementov, zo stranky aj z DOM stromu
function removeSelection() {
	var elems = document.querySelectorAll(".dom-inspector-selected");

	[].forEach.call(elems, function(el) {
	    el.classList.remove("dom-inspector-selected");
	});

	var elems2 = document.querySelectorAll(".dom-inspector-row > span");

	[].forEach.call(elems2, function(el) {
		el.parentNode.classList.remove("dom-inspector-node-selected");
	});
}

// samotne zobrazenie vystupu skriptu
function showDOM() {

	var oldHtml = document.body.innerHTML; // ulozime si body danej stranky
	document.body.innerHTML = "<div id='dom-inspector-wrapper'>" + oldHtml + "</div><div id='dom-inspector-output'></div>"; // obalime povodne body wrapperom a pridame output skriptu

 	domInspectorOutput="<h1>DOM tree</h1>";

 	var content = document.childNodes; // ziskame vsetky uzly na stranke
 	DumpNodes (content, 0);
 	document.getElementById('dom-inspector-output').innerHTML = domInspectorOutput; // naplnime output
 
	document.addEventListener('click', function(e){
		// akcia po kliknuti do DOM stromu na niektory zo zobrazenych DOM uzlov
    	if (e.target && (e.target.parentNode.id == 'dom-inspector-output' || e.target.parentNode.className == 'dom-inspector-row')) {
    		
    		// zmaze sa oznacenie toho co bolo vybrane predtym
    		removeSelection();

    		// ziska sa cesta ku uzlu na stranke, ktory ma byt oznaceny
			var path = e.target.innerHTML;
			if (e.target.firstChild) {
				path = e.target.firstChild.innerHTML;
			}
			var res = unescapeHTML(path); 
    		if (res) {
	    		var element = document.querySelector(res);
	    		if (element) {
					element.className += ' dom-inspector-selected'; // pridame class elementu, ktory bol oznaceny a scrollneme na stranke az k nemu
					element.scrollIntoView();	
	    		}
	    	}


    	}
    	// akcia po kliknuti na stranke na nejaky element a nie do DOM inspektora
    	else if (e.target && (e.target.parentNode.id != 'dom-inspector-output' && e.target.parentNode.className != 'dom-inspector-row')) {
 			
 			removeSelection();

 			var elems = document.querySelectorAll(".dom-inspector-row > span");

 			var elementToHighlight;
 			var i = 0;
 			[].forEach.call(elems, function(el) {
			    
			    if (el.textContent == getCssPath(e.target)) { // vyber spravneho elementu v DOM strome, oznacujeme aj jeho potomkov, ktori maju rovnaku css path, takze texty
			    	i++;
			    	el.parentNode.className += ' dom-inspector-node-selected';
		    		if (i == 1) {
		    			el.parentNode.scrollIntoView(); // scroll na prvy vybrany
		    		}	
			    }
			});

 		}
 	});
 	// ak bola zmenena nejaka class alebo id v DOM strome a bolo kliknute na ENTER
 	document.addEventListener('keydown', function(e){
    	if (e.target && (e.target.parentNode.className == 'dom-inspector-row')) {
 			if (e.which == 13) {

 				var path = e.target.parentNode.firstChild.innerHTML;
 				var elems = document.querySelectorAll(unescapeHTML(path));
 				[].forEach.call(elems, function(el) { // ak islo o input na class, zmeni sa class
 					if (e.target.name == "cl") {
 						el.className = '';
 						el.className = e.target.value;
 					}
 					else if (e.target.name == "id") { // ak islo o input na id, zmeni sa id
 						if (e.target.value.indexOf(" ") < 0) {
	 						el.id = e.target.value;
	 						e.target.parentNode.firstChild.innerHTML = getCssPath(el);
 						}
 					}

 				});
 			}
 		}
 	});
 }

window.onload = showDOM;