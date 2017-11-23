var $ = require('jquery');
require('jquery-ui');
global.jQuery = global.$ = $;
require('../../modules/move-top.js');
require('jquery-ui/custom');
require('select2');
require('moment/locale/fi');
require('bootstrap');
require('bootstrap-switch');
require('eonasdan-bootstrap-datetimepicker-custom');
var select2 = require('../../modules/select2controller.js');
var dateTime = require('../../modules/dateTimeController.js');
var c3 = require('../../modules/c3Controller.js');
//var grid = require('../../modules/gridController.js');
var stomp = require('../../modules/stompController.js');
require('../../modules/jquery.chocolat.js');
var map = require('../../modules/map.js');


global.jQuery(document).ready(function($) {
	$(".scroll").click(function(event){
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top},1200);
	});
	
	select2.activate(".js-data-kunta-ajax", "/koodistot/kunnat", true, 2, "Kunta");
	select2.activate(".js-data-tietolaji-ajax", "/koodistot/tietolajit", false, 0, "Valitse tietolaji");
	select2.activate(".js-data-hallinnollinenluokka-ajax", "/koodistot/hallinnollinenluokka", true, 0, "Valitse hallinnollinenluokka");
	dateTime.activatePicker1();
	dateTime.activatePicker2();
	c3.init();
	//grid.initUserDrid();
	//grid.initValidationGrid();
	stomp.init(c3);

	global.jQuery(function() {
		$('.moments-bottom a').Chocolat();
		$().UItoTop({ easingType: 'easeOutQuart' });
	});

	$("span.menu").click(function(){
		$(".top-menu ul").slideToggle("slow" , function(){
		});
	});

	$('input[name="sw-abs-rel"]').bootstrapSwitch('state', true, true);
	$('input[name="sw-cumul"]').bootstrapSwitch('state', true, true);
	$('input[name="sw-summary"]').bootstrapSwitch('state', false, true);

	map.createMap();
	map.registerKuntaListaValitsin();
	map.populateKevennettyKuntalista();
});

