var jqgrid = require('free-jqgrid');
var ajaxrequest = require('./ajaxrequest.js');

var gridController = {
		
	initUserDrid: function() {
		var me = this;
	    $("#grid1").jqGrid({
			colModel: [
			           { name: "username", label: "Käyttäjätunnus", width: 200, search: false },
			           { name: "configuration", label: "Käyttäjärooli", width: 200, formatter:me.parseRole, sortable: false,
			        	   stype: "select", searchoptions: { value: "all:Kaikki;premium:Muokkaaja;operator:Operaattori;busstop:Pysäkkikäyttäjä;other:Joku muu", defaultValue: "all" }
			           },
			           { name: "configuration", label: "Käyttäjän kunnat", width: 600, formatter:me.parseMunicipalities, sortable: false, search: false,
			        	   cellattr: function (rowId, val, rawObject, cm, rdata) { return ' data-template="' + me.getTemplate() + '" data-toggle="tooltip" title = "' + JSON.stringify(rawObject[1]) + '"'; }
			           }
			],
			url:'/koodistot/kayttajat',
			datatype: "json",
			//        loadonce: true,
			iconSet: "fontAwesome",
			guiStyle: "bootstrap",
			idPrefix: "g1_",
			//        rownumbers: true,
			sortname: "username",
			sortorder: "asc",
			caption: "DigiRoad käyttäjät tuotannossa",
			pager: true,
			rowNum: 15,
			viewrecords: true,
			onSortCol: function () {
	                var postpage = $("#grid1").getGridParam('postData');
	                $("#grid1").setGridParam({ page: postpage.page });
	           },
	           gridComplete: function() {$('[data-toggle="tooltip"]').tooltip({
			        	   container: 'body',
			        	   html: true
			           		});
	           },
	           refresh: true
//	        pginput: true
//	        pager : '#gridpager'
	    }).jqGrid("filterToolbar");
	},
	initValidationGrid: function() {
		var me = this;
		jQuery("#grid2").jqGrid({
			colModel:[ {name:'tietolaji', label:'Tietolaji', index:'id', width:200},
			           {name:'tyyppi', label:'Tyyppi', width:100},
			           {name:'arvot', label:'Arvot', width:100},
			           {name:'muiden_arvojen_vaikutus', label:'Muiden arvojen vaikutus', width:160},
			           {name:'huom', label:'Huomioitavaa', width:250},
			           {name: 'status', label: 'Status', width:100},
			           {name: 'action', label: 'Validointi', width:120}],
			           url:'/validate/rules',
			           datatype: "json",
			           iconSet: "fontAwesome",
			           guiStyle: "bootstrap",
			           rowNum:20,
			           sortname: 'id',
			           viewrecords: true,
			           sortorder: "desc",
			           loadonce: true,
			           caption: "Validointi",
			           beforeSelectRow: function (rowid, e) {
			        	    var $td = $(e.target).closest("td"),
			        	        iCol = $.jgrid.getCellIndex($td[0]),
			        	        onCellSelect = $(this).jqGrid("getGridParam", "onCellSelect");

			        	    if ($.isFunction(onCellSelect)) {
			        	        onCellSelect.call(this, rowid, iCol, $td.html(), e);
			        	    }

			        	    return false;
			        	},
			           onCellSelect: me.cellSelected});
	},
	getTemplate: function() {
		var me = this;
		return me.escapeHtml('<div class="tooltip userconftooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
	},
	escapeHtml: function(str) {
		return String(str).replace(/[&<>"'\/]/g, function (s) {
			var entityMap = {
				    "&": "&amp;",
				    "<": "&lt;",
				    ">": "&gt;",
				    '"': '&quot;',
				    "'": '&#39;',
				    "/": '&#x2F;'
			    	  };
			  return entityMap[s];
			});
	},
	parseRole: function(cellvalue, options, rowObject) {
    	var configurationJSON = JSON.parse(cellvalue);
    	switch(configurationJSON.roles[0]) {
        case undefined:
            return "Pysäkkikäyttäjä";
        case "premium":
        	return "Muokkaaja";
        case "operator":
            return "Operaattori";
        case "viewer":
        	return "Katselija (poistettu rooli)";
        default:
            return "n/a";
    	} 
    },
    parseMunicipalities: function(cellvalue, options, rowObject) {
    	var configurationJSON = JSON.parse(cellvalue);
    	return configurationJSON.authorizedMunicipalities;
    },
    cellSelected: function(rowId, iCell, cellcontent, e) {
    	if (iCell == 6) {
    		jQuery("#grid2").jqGrid('setCell', rowId, iCell, 'Validointi aloitettu..','validred');
    		ajaxrequest.get("/validate/test/" + rowId, "", gridController.updateStatus );
    	}
    },
    cutStringOnComma: function(str, cutcount) {// ei käytössä
		  for(var i = 0; i < str.length; i++) {
			  if (i > cutcount && str[i] == ',') return str.substring(0, i) + " " + str.substr(i + 1);
		  }
		  return str;
	},
	updateStatus: function(response) {
		jQuery("#grid2").jqGrid('setCell', response[1], 6, 'Validointi valmis!', 'validgreen');
		jQuery("#grid2").jqGrid('setCell', response[1], 5, response[0]);
	}
}

module.exports = gridController;