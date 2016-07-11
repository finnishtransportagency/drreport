var stomp = require('stompjs');

var sockjs = require('sockjs-client');
global.SockJS = global.sockjs = sockjs;

var noty = require('./notyController.js');


var stompController = {
		init: function(c3) {
		    // defined a connection to a new socket endpoint
		    var socket = new SockJS('/stomp');

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
		    });
		}
}

module.exports = stompController;