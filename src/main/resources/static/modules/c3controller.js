//var moment = require('moment');
//var d3 = require('d3');
var c3 = require('c3');
var d3 = require('d3');
var noty = require('./notyController.js');
var ajaxrequest = require('./ajaxrequest.js');

var c3Controller = {

chart: null,
chartData: null,
relativeYAxis: true,
cumulativity: true,
init: function() {
	me = this;
	me.chart = c3.generate({
		size: {
			  height: 500
			},
	    data: {
	    	x: 'x',
	    	xFormat: '%d-%m-%Y',
	        columns: [
	        ],
   	        type: 'bar',
	        names: {
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
	        },
	        y : {
	            tick: {
//	                format: d3.format("$,")
	                format: function (d) { return c3Controller.relativeYAxis ? Math.round(10000*d) / 100 + " %" : d; }
	            }
	        }
	    }
	});
	me.registerClick();
	me.registerSwitch();
},
nid: null,
updateChart: function() {
	var me = this;
	var columns = null;
	if(me.relativeYAxis) {
		columns = me.cumulativity ? me.chartData.columnsCumulRel : me.chartData.columnsRel;
	} else {
		columns = me.cumulativity ? me.chartData.columnsCumul : me.chartData.columns;
	}
	c3Controller.chart.load({
		unload: true,
        columns: columns,
        names: me.chartData.names
    });
	c3Controller.chart.groups(me.chartData.groups);
    if (me.chartData.columnsCumulRel[0].length < 2) noty.createNoty("Ei tuloksia!", "alert");
    c3Controller.nid.close();
},
updateChartData: function(response) {
	c3Controller.chartData = response;
	c3Controller.updateChart();
},
registerClick: function() {
	var me = this;
	$("#haeGraafiBtn").click(function(e){
		e.preventDefault();
		var startdate = $("#startdate").val() != "" ? $("#startdate").val().replace(/\./g, "-") : "01-01-1970";
		var stopdate = $("#stopdate").val() != "" ? $("#stopdate").val().replace(/\./g, "-") : "01-01-1970";
		var kunnat = $(".js-data-kunta-ajax").val() != null ? $(".js-data-kunta-ajax").val() : "0";
		var tietolajit = $(".js-data-tietolaji-ajax").val() != null ? $(".js-data-tietolaji-ajax").val() : "0";
		var urli = "/raportit/graafi1/" + startdate + "/" + stopdate + "/" + kunnat + "/" + tietolajit;
		ajaxrequest.get(urli, "", c3Controller.updateChartData);
	});
},
registerSwitch: function() {
	var me = this;
	$('input[name="sw-abs-rel"]').on('switchChange.bootstrapSwitch', function(event, state) {
		me.relativeYAxis = state;
		me.updateChart();
	})
	$('input[name="sw-cumul"]').on('switchChange.bootstrapSwitch', function(event, state) {
		me.cumulativity = state;
		me.updateChart();
	})
},
trash: function() {
//	function toggle(id) {
//    chart.toggle(id);
//}

//d3.select('.chartcontainer').insert('div', '.chart').attr('class', 'legend').selectAll('span')
//    .data(['data1', 'data2','data3', 'data4', 'data5', 'data6','data7', 'data8'])
//  .enter().append('span')
//    .attr('data-id', function (id) { return id; })
//    .html(function (id) { return chart.data.names()[id]; })
//    .each(function (id) {
//        d3.select(this).style('background-color', chart.color(id));
//    })
//    .on('mouseover', function (id) {
//        chart.focus(id);
//    })
//    .on('mouseout', function (id) {
//        chart.revert();
//    })
//    .on('click', function (id) {
//        chart.toggle(id);
//    });

//chart.data.colors({data3: chart.data.colors().data1, data4: chart.data.colors().data2});
}

  
  
};

module.exports = c3Controller;