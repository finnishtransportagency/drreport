//var stomp = require('stompjs');
var noty = require('./notyController.js');


var stompController = {
		init: function(c3) {
			c3.nid = noty.createNoty("MORO!!", "warning");
		}		
}

module.exports = stompController;