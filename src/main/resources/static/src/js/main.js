var $ = require('jquery');
global.jQuery = global.$ = $;
require('../../modules/move-top.js');
require('jquery-ui/custom');

global.jQuery(document).ready(function($) {
	$(".scroll").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top},1200);
	});
});

//var bootstrap = require('bootstrap');
require('../../modules/jquery.chocolat.js');

global.jQuery(function() {
	$('.moments-bottom a').Chocolat();
	$().UItoTop({ easingType: 'easeOutQuart' });
});

$("span.menu").click(function(){
	$(".top-menu ul").slideToggle("slow" , function(){
	});
});

//var stomp = require('stompjs');

//var sockjs = require('sockjs-client');
//global.SockJS = global.sockjs = sockjs;
//
//$(document).ready(function() {
//	var messageList = $("#messages");
//    // defined a connection to a new socket endpoint
//    var socket = new SockJS('/stomp');
//
//    var stompClient = Stomp.over(socket);
//
//    stompClient.connect({ }, function(frame) {
//        // subscribe to the /topic/message endpoint
//        stompClient.subscribe("/topic/message", function(data) {
//            var message = data.body;
//            messageList.append("<li>" + message + "</li>");
//        });
//    });
//});

