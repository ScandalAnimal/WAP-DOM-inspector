var xmldoc; 
var msg="";

var NODE_ELEMENT     = 1;
var NODE_ATTRIBUTE   = 2;
var NODE_TEXT        = 3;
var NODE_CDATA       = 4;
var NODE_ENTITYREF   = 5;
var NODE_ENTITY      = 6;
var NODE_PI          = 7;
var NODE_COMMENT     = 8;
var NODE_DOCUMENT    = 9;
var NODE_DOCTYPE     = 10;
var NODE_DOCFRAG     = 11;
var NODE_NOTATION    = 12;

var DumpNode = function(Node, Lev) {
   if (Node.nodeType == NODE_ELEMENT) {
      for (var i=1;i<(Lev-1)*3;i++) {
         msg = msg + " ";
         } // for
      msg = msg + Node.nodeName + "<BR>";
      DumpNodes (Node.childNodes, Lev);
      } // if
   } // DumpNode

var DumpNodes = function (Nodes, Lev) {
   for(var i=0; i<Nodes.length; i++) {
      DumpNode (Nodes[i], (Lev+1));
      } // for
   } // DumpNodes

var execut1= function() {
   msg="";
   xmldoc=loadXMLDoc("weatherReport/weatherReport.xml");
   DumpNodes (xmldoc.childNodes, 0);
   msg = msg + "Konec";
   $("#vysledek").html(msg);
   } // execut1   