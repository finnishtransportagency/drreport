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
		size: {
			  height: 500
			},
	    data: {
	    	x: 'x',
	    	xFormat: '%d-%m-%Y',
	        columns: [
//	            ['x', '01-01-2016'],
//	            ['data1', '30']
//	            ['data2', '130', 100, 140, 200, 150, 50],
	        ],
   	        type: 'bar',
//	        groups: [
//	                 ['data1', 'data3'],
//	                 ['data2', 'data4'],
//	                 ['data5', 'data7'],
//	                 ['data6', 'data8']
//	                 ],
	        names: {
//	        	data1: 'Kaarina esterakennelma',
//	        	data2: 'Lieto esterakennelma'
	        },
	        labels: false
	    },
	    zoom: {
	        enabled: true
	    },
	    bar: {
	        width: {
	            ratio: 0.6 // this makes bar width 60% of length between ticks
	        }
	        // or
//	        width: 10 // this makes bar width 100px
	    },
	    axis: {
	        x: {
	            type: 'timeseries',
//	            type: 'category',
	            tick: {
//	                count: 12,
	                format: '%d-%m-%Y',
	                rotate: -90,
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


//	setTimeout(function () {
//		ajaxrequest.get('/raportit/graafi1/25-10-2015/31-01-2016/853,179,837/20,30,120,200,220,280', "", aa);
//	}, 2000);
	
	function updateChart(response) {
	    chart.load({
	        columns: response.columns,
	        names: response.names
	    });
	    chart.groups(response.groups);
	}
	
	$("#haeGraafiBtn").click(function(){
		startdate = $("#startdate").val() != "" ? $("#startdate").val().replace(/\./g, "-") : "01-01-1970";
		stopdate = $("#stopdate").val() != "" ? $("#stopdate").val().replace(/\./g, "-") : "01-01-1970";
		kunnat = $(".js-data-kunta-ajax").val() != null ? $(".js-data-kunta-ajax").val() : "0";
		tietolajit = $(".js-data-tietolaji-ajax").val() != null ? $(".js-data-tietolaji-ajax").val() : "0";
		ajaxrequest.get("/raportit/graafi1/" + startdate + "/" + stopdate + "/" + kunnat + "/" + tietolajit, "", updateChart);
//		console.log("/" + startdate + "/" + stopdate + "/" + kunnat + "/" + tietolajit);
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

