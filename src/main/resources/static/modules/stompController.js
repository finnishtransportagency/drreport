var stomp = require('stompjs');

var sockjs = require('sockjs-client');
global.SockJS = global.sockjs = sockjs;

var noty = require('./notyController.js');


var stompController = {
		init: function(c3) {
		    // defined a connection to a new socket endpoint
		    var socket = new SockJS('/stomp');
console.log("sessio:" + this.getRandomId(1000000,2000000));
		    var stompClient = Stomp.over(socket);

		    stompClient.connect({ }, function(frame) {
		        stompClient.subscribe("/topic/message", function(data) {
		            var rawmessage = data.body;
		            var message = JSON.parse(rawmessage);
		            if (message.status == "start") {
		            	c3.nid = noty.createNoty(message.message, "warning");
		            } else {
		            	c3.nid.setText(message.message);
		            }
		            
		        });
		        stompClient.subscribe("/topic/testmessage", function(data) {
		        	var rawmessage = data.body;
		            var message = JSON.parse(rawmessage);
		            if (message.status != "stop") {
		            	jQuery("#grid2").jqGrid('setCell', message.id, 6, message.message);
		            }
		        });
		    });
		},
		getRandomId: function(min, max){
			return Math.floor(Math.random()*(max-min+1)+min);
		}
		
}

module.exports = stompController;