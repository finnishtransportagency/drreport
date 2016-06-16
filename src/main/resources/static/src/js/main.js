var $ = require('jquery');
global.jQuery = global.$ = $;
require('../../modules/move-top.js');
require('jquery-ui/custom');
require('select2');
require('moment/locale/fi');
require('bootstrap');
require('eonasdan-bootstrap-datetimepicker-custom');
var select2 = require('../../modules/select2controller.js');
var dateTime = require('../../modules/dateTimeController.js');

var d3 = require('d3');
var c3 = require('c3');

var ajaxrequest = require('../../modules/ajaxrequest.js');


global.jQuery(document).ready(function($) {
	$(".scroll").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top},1200);
	});
	select2.activate(".js-data-kunta-ajax", "/koodistot/kunnat");
	select2.activate(".js-data-tietolaji-ajax", "/koodistot/tietolajit");
	dateTime.activatePicker1();
	dateTime.activatePicker2();
	

	var chart = c3.generate({
	    data: {
	    	x: 'x',
	        columns: [
	            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-02-06', '2013-01-07', '2013-01-08', '2013-01-09', '2013-01-10', '2013-01-11', '2013-01-12'],
	            ['data1', 30, 200, 100, 400, 150, 250, 310, 100, 200, 300, 190, 50],
	            ['data2', 130, 100, 140, 200, 150, 50, 30, 200, 100, 400, 150, 250],
	            ['data3', 310, 100, 200, 300, 190, 50, 130, 100, 140, 200, 150, 50],
	            ['data4', 13, 190, 110, 300, 50, 150, 30, 200, 100, 400, 150, 250],
	            ['data5', 30, 200, 100, 400, 150, 250, 30, 200, 100, 400, 150, 250],
	            ['data6', 130, 100, 140, 200, 150, 50, 13, 190, 110, 300, 50, 150],
	            ['data7', 310, 100, 200, 300, 190, 50, 30, 200, 100, 400, 150, 250],
	            ['data8', 13, 190, 110, 300, 50, 150, 30, 200, 100, 400, 150, 250]
	        ],
   	        type: 'bar',
	        groups: [
	                 ['data1', 'data3'],
	                 ['data2', 'data4'],
	                 ['data5', 'data7'],
	                 ['data6', 'data8']
	                 ],
	        names: {
	        	data1: 'Kaarina esterakennelma',
	        	data2: 'Lieto esterakennelma',
	        	data3: 'Kaarina Nopeusrajoitukset',
	        	data4: 'Lieto Nopeusrajoitukset',
	        	data5: 'Paimio esterakennelma',
	        	data6: 'Salo esterakennelma',
	        	data7: 'Paimio Nopeusrajoitukset',
	        	data8: 'Salo Nopeusrajoitukset'
	        },
	        labels: false
	    },
	    zoom: {
	        enabled: true
	    },
	    bar: {
	        width: {
	            ratio: 0.8 // this makes bar width 50% of length between ticks
	        }
	        // or
//	        width: 10 // this makes bar width 100px
	    },
	    axis: {
	        x: {
	            type: 'timeseries',
	            tick: {
//	                count: 12,
	                format: '%Y-%m-%d',
	                rotate: -45,
	                culling: false
	            },
	            height: 100
	        }
	    }
	});
	
//	function toggle(id) {
//	    chart.toggle(id);
//	}

//	d3.select('.chartcontainer').insert('div', '.chart').attr('class', 'legend').selectAll('span')
//	    .data(['data1', 'data2','data3', 'data4', 'data5', 'data6','data7', 'data8'])
//	  .enter().append('span')
//	    .attr('data-id', function (id) { return id; })
//	    .html(function (id) { return chart.data.names()[id]; })
//	    .each(function (id) {
//	        d3.select(this).style('background-color', chart.color(id));
//	    })
//	    .on('mouseover', function (id) {
//	        chart.focus(id);
//	    })
//	    .on('mouseout', function (id) {
//	        chart.revert();
//	    })
//	    .on('click', function (id) {
//	        chart.toggle(id);
//	    });
	
//chart.data.colors({data3: chart.data.colors().data1, data4: chart.data.colors().data2});


	setTimeout(function () {
		ajaxrequest.get('/testi', "", aa);
	}, 2000);
	
	function aa(response) {
	    chart.load({
	        columns: response.columns
    })
	}
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

