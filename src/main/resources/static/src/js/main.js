var $ = require('jquery');
require('jquery-ui');
global.jQuery = global.$ = $;
require('jquery-ui/custom');
require('select2');
require('moment/locale/fi');
require('bootstrap');
require('bootstrap-switch');
require('eonasdan-bootstrap-datetimepicker-custom');
var select2 = require('../../modules/select2controller.js');
var dateTime = require('../../modules/dateTimeController.js');
var c3 = require('../../modules/c3Controller.js');
var stomp = require('../../modules/stompController.js');
var map = require('../../modules/map.js');

global.jQuery(document).ready(function($) {	
	select2.activate(".js-data-kunta-ajax", "/koodistot/kunnat", true, 2, "Kunta");
	select2.activate(".js-data-tietolaji-ajax", "/koodistot/tietolajit", false, 0, "Valitse tietolaji");
	select2.activate(".js-data-hallinnollinenluokka-ajax", "/koodistot/hallinnollinenluokka", true, 0, "Valitse hallinnollinenluokka");
	dateTime.activatePicker1();
	dateTime.activatePicker2();
	c3.init();
	stomp.init(c3);
	$('input[name="sw-abs-rel"]').bootstrapSwitch('state', true, true);
	$('input[name="sw-cumul"]').bootstrapSwitch('state', true, true);
	$('input[name="sw-summary"]').bootstrapSwitch('state', false, true);
	map.createMap();
	map.registerKuntaListaValitsin();
	map.populateKevennettyKuntalista();
});

