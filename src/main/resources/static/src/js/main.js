var $ = require('jquery');
global.jQuery = global.$ = $;
require('../../modules/move-top.js');
require('jquery-ui/custom');
require('select2');
require('moment/locale/fi');
require('bootstrap');
require('eonasdan-bootstrap-datetimepicker-custom');
var select2 = require('../../modules/select2controller.js');

global.jQuery(document).ready(function($) {
	$(".scroll").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top},1200);
	});
	select2.activate(".js-data-kunta-ajax", "/koodistot/kunnat");
	select2.activate(".js-data-tietolaji-ajax", "/koodistot/tietolajit");
	
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

