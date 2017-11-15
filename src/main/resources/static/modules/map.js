var ol = require('openlayers');
//var ol = require('../ol-debug.js');

var projection = new ol.proj.Projection({
    code: 'EPSG:3067',
    units: 'm'
 });
 
ol.proj.addProjection(projection);

var layers = require('./layers.js');
var $ = require('jquery');

var kuntaValitsin = {
	map: null,
	oletusRajoitus: 10,
	kuntaRajoitus: 10,
	selectedKunnat: [],
	lisattavatKunnat: [],
	poistettavatKunnat: [],
	kevennettyKuntalista: [],
	allKunnatExist : function(testattavat){
	var me = this;
	for(var i = 0 , len = testattavat.length; i < len; i++){
		 if($.inArray(testattavat[i], me.selectedKunnat) == -1) return false;
	}
	return true;
	},
	removeKunnat : function(poistettavat) {
		var me = this;
		me.selectedKunnat = me.selectedKunnat.filter( function ( elem ) {
		    return poistettavat.indexOf( elem ) === -1;
		});
		me.poistettavatKunnat = me.poistettavatKunnat.concat(poistettavat);
	},
	addKunnat : function(lisattavat) {
		var me = this;
		//tarkista onko kuntien määrä rajoissa
		var koko = lisattavat.length + me.selectedKunnat.length;
		console.log('[PS]: KONAISKOKO: ', + koko);
		console.log('[PS]: rajoitus: ', + me.kuntaRajoitus);
		if(koko<me.kuntaRajoitus){
		    for(var i = 0 , len = lisattavat.length; i < len; i++){
			    if($.inArray(lisattavat[i], me.selectedKunnat) == -1) {
				    me.selectedKunnat.push(lisattavat[i]);
					}
				}
		    me.lisattavatKunnat = me.lisattavatKunnat.concat(lisattavat);
			}
	},
	createMap : function() {
		var me = this;
		me.map = new ol.Map({
	    layers: [me.kuntaLayer(), me.maakuntaLayer(), me.aviLayer()],
	    target: 'map',
	    controls: ol.control.defaults({
	      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
	        collapsible: false
	      })
	    }),
	    view: new ol.View({
	    	resolutions: [4000,2000,1000,400],
	    	center: [310000, 7200000],
	    	zoom: 0
	    })
		});
		me.map.getView().on('change:resolution', function(evt) {
			me.handleLayerVisibility(me.map.getView().getZoom());
			}
		);
		me.map.on('singleclick', function(evt) {
			//tarkistaako jokaisen layerin iteratiivisesti!?
			var feature = me.map.forEachFeatureAtPixel(evt.pixel, me.handleFeatureSelection);
			}); 
	},
	populateKevennettyKuntalista : function() {
		for(var i = 0 , len = layers.getKunnat().features.length; i < len; i++){
			this.kevennettyKuntalista.push({id:layers.getKunnat().features[i].properties.NATCODE, text:layers.getKunnat().features[i].properties.NAMEFIN});
		}
	},
	handleLayerVisibility : function(zoom) {
		var me = this;
		switch(zoom) {
		    case 0:
		    case 1:
		    	me.map.getLayers().item(2).setVisible(true);
		    	me.map.getLayers().item(1).setVisible(false);
		        break;
		    case 2:
		    	me.map.getLayers().item(1).setVisible(true);
		    	me.map.getLayers().item(2).setVisible(false);
		        break;
		    case 3:
		    	me.map.getLayers().item(1).setVisible(false);
		    	me.map.getLayers().item(2).setVisible(false);
		        break;
		    default:
		    	
		}
	},
	handleFeatureSelection : function(feature, layer) {
		var pituus = 0;
		pituus = kuntaValitsin.selectedKunnat.length;
		
		switch(layer.get('category')) {
		    case 'avi':
		    case 'maakunta':
			    kuntaValitsin.updateKuntaListat(feature.get('KUNNAT').split(','));
		        break;
		    case 'kunta':
		    	console.log('handleFeatureSelection, before update: lisättävät kunnat:' + kuntaValitsin.lisattavatKunnat);
		    	console.log('handleFeatureSelection, before update: poistettavat kunnat:' + kuntaValitsin.poistettavatKunnat);
		    	if (!kuntaValitsin.lisattavatKunnat.length && !kuntaValitsin.poistettavatKunnat.length) {
		    		console.log('handleFeatureSelection - tsekataan update-tarve');
			    	kuntaValitsin.updateKuntaListat(feature.get('NATCODE').split(','));
		    	}
		    	console.log('handleFeatureSelection, after update: lisättävät kunnat:' + kuntaValitsin.lisattavatKunnat);
		    	console.log('handleFeatureSelection, after update: poistettavat kunnat:' + kuntaValitsin.poistettavatKunnat);
		    	if (kuntaValitsin.lisattavatKunnat.length) {
		    		kuntaValitsin.handleKunnat2Select2(kuntaValitsin.lisattavatKunnat, true);
		    		kuntaValitsin.handleKuntaFeatureStyle(layer, kuntaValitsin.lisattavatKunnat, true);
		    	}
		    	if (kuntaValitsin.poistettavatKunnat.length) {
		    		kuntaValitsin.handleKunnat2Select2(kuntaValitsin.poistettavatKunnat, false);
		    		kuntaValitsin.handleKuntaFeatureStyle(layer, kuntaValitsin.poistettavatKunnat, false);
		    	}
		        break;
		    default:    	
		}
	},
	handleKunnat2Select2 : function(kunnat, lisaa) {
		console.log('select2: ' + kunnat + ' lisätään: ' + lisaa);
		//kunnat attribuuttia ei käytetä korjauksen jälkeen vaan luotetaan selectedKunnat listaan
		var data = [];
		var values = [];
		for(var i = 0 , len = kuntaValitsin.kevennettyKuntalista.length; i < len; i++) {
			for(var j = 0 , len2 = kuntaValitsin.selectedKunnat.length; j < len2; j++) {
				if(kuntaValitsin.selectedKunnat[j] == kuntaValitsin.kevennettyKuntalista[i].id) {
					data.push(kuntaValitsin.kevennettyKuntalista[i]);
					values.push(kuntaValitsin.selectedKunnat[j]);
				}
			}
		}
		if(lisaa) {
			//console.log('Lisätään: ' + JSON.stringify(data) + ' ja :'+ values);
			//selectedKunnat päivittyy oikein, mutta SELECT ei, data sisältää vain viimeisimmän klikkauksen. 
			$('.js-data-kunta-ajax').select2({data: data}).val(values).trigger('change');
		} else {
			//else haara turha
			//console.log('Poistetaan: ' + JSON.stringify(data));
			//$('.js-data-kunta-ajax').select2("trigger", "unselect", {data: data});//tämä pitää koijata!
			$('.js-data-kunta-ajax').select2({data: data}).val(values).trigger('change');
		}
		return true;
	},
	registerKuntaListaValitsin : function() {
		var me = this;
		$('.js-data-kunta-ajax').on('select2:unselecting', function (evt) {
			console.log('FROM SELECT. unselecting.. before updatekuntalistat');
			if (!kuntaValitsin.poistettavatKunnat.length) me.updateKuntaListat(['' + evt.params.args.data.id]);
			console.log('unselecting.. before handlekuntafeaturestyle');
			kuntaValitsin.handleKuntaFeatureStyle(me.map.getLayers().item(0), kuntaValitsin.poistettavatKunnat, false);
			});
		$('.js-data-kunta-ajax').on('select2:selecting', function (evt) {
			console.log('FROM-SELECT. selecting.. before updatekuntalistat, lisättävät kunnat:' + kuntaValitsin.lisattavatKunnat);
			if (!kuntaValitsin.lisattavatKunnat.length) me.updateKuntaListat(['' + evt.params.args.data.id]);
			console.log('selecting.. before handlekuntafeaturestyle, lisättävät kunnat:' + kuntaValitsin.lisattavatKunnat);
			kuntaValitsin.handleKuntaFeatureStyle(me.map.getLayers().item(0), kuntaValitsin.lisattavatKunnat, true);
			});
	},
	updateKuntaListat : function(kunnat) {
		console.log('updateKuntaListat:' + kunnat);
		if(kuntaValitsin.allKunnatExist(kunnat)) {
    		kuntaValitsin.removeKunnat(kunnat);
    	} else {
    		kuntaValitsin.addKunnat(kunnat);
    	}
		console.log('selectedKunnat:' + this.selectedKunnat);
	},
	handleKuntaFeatureStyle : function(layer, kunnat, selected) {
		console.log('handleKuntaFeatureStyle:' + kunnat + ', highlight:' + selected);
		for(var i = 0 , len = layer.getSource().getFeatures().length; i < len; i++){
			var natcode = layer.getSource().getFeatures()[i].get('NATCODE');
			if($.inArray(natcode, kunnat) != -1) {
				this.changeKuntaFeatureStyle(layer.getSource().getFeatures()[i], selected);
			}
		}
		selected ? kuntaValitsin.lisattavatKunnat.length = 0 : kuntaValitsin.poistettavatKunnat.length = 0;
	},
	changeKuntaFeatureStyle : function(feature, selected) {
		selected ? feature.setStyle(kuntaValitsin.kuntaStyleSelected()) : feature.setStyle(kuntaValitsin.kuntaStyleNormal());
	},
	aviStyleX : function(feature, resolution) {
        var polyStyleConfig = {
        		stroke: new ol.style.Stroke({
	        		color: 'rgba(255, 255, 255, 1)',
	        		width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 0, 0,0.3)'
                })
        }
        var textStyleConfig = {
	        text:new ol.style.Text({
		        text:resolution >= 4000 ? kuntaValitsin.stringDivider(feature.get('NAMEFIN'), 20, "\n") : feature.get('NAMEFIN'),
		        font:resolution >= 4000 ? 'Normal 8px Arial' : 'Normal 10px Arial',
		//        text:resolution < 100000 ? feature.get('NAMEFIN') : '' ,
		        fill: new ol.style.Fill({ color: "#000000" }),
		        stroke: new ol.style.Stroke({ color: "#FFFFFF", width: 2 })
	        }),
	        geometry: function(feature){
		        var retPoint;
		        if (feature.getGeometry().getType() === 'MultiPolygon') {
		        	retPoint =  kuntaValitsin.getMaxPoly(feature.getGeometry().getPolygons()).getInteriorPoint();
		        } else if (feature.getGeometry().getType() === 'Polygon') {
		        	retPoint = feature.getGeometry().getInteriorPoint();
		        }
		        return retPoint;
	        }
        }
        var textStyle = new ol.style.Style(textStyleConfig);
        var style = new ol.style.Style(polyStyleConfig);
        return [style,textStyle];
	},
	aviStyle : function(feature) {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#222222',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.5)'
        })
//        text: new ol.style.Text({
//            font: '12px Verdana',
//            text: feature.get('NAMEFIN'),
//            fill: new ol.style.Fill({color: 'black'}),
//            stroke: new ol.style.Stroke({color: 'white', width: 0.5})
//        })
      })
	},	
	maakuntaStyle : function() {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 255, 0, 0.5)'
        })
      })
	},
	kuntaStyleNormal : function() {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(128, 128, 128, 1)',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 1)'
        })
      })
	},
	kuntaStyleSelected : function() {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 1)',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(128, 128, 128, 1)'
        })
      })
	},
	stringDivider : function stringDivider(str, width, spaceReplacer) {
        if (str.length > width) {
            var p = width;
            while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
              p--;
            }
            if (p > 0) {
              var left;
              if (str.substring(p, p + 1) == '-') {
                left = str.substring(0, p + 1);
              } else {
                left = str.substring(0, p);
              }
              var right = str.substring(p + 1);
              return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
            }
          }
          return str;
    },
	vector : function() {
		var me = this;
		return new ol.layer.Vector({
	 		style: me.aviStyle,
		    source: me.vectorSource1()
		});
	},
	getMaxPoly : function(polys) {
		  var polyObj = [];
		  //now need to find which one is the greater and so label only this
		  for (var b = 0; b < polys.length; b++) {
		    polyObj.push({ poly: polys[b], area: polys[b].getArea() });
		  }
		  polyObj.sort(function (a, b) { return a.area - b.area });

		  return polyObj[polyObj.length - 1].poly;
	},
	aviSource : function() {
		return new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getAvi())
      });
	},
	maakuntaSource : function() {return new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getMaakunnat())
      });
	},
	kuntaSource : function() {return new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getKunnat())
      });
	},
	aviLayer : function() {
		var me = this;
		return new ol.layer.Vector({
        source: me.aviSource(),
        style: me.aviStyle(),
        category: 'avi'
      });
	},
	maakuntaLayer : function() {
		var me = this;
		return new ol.layer.Vector({
        source: me.maakuntaSource(),
        style: me.maakuntaStyle(),
        visible: false,
        category: 'maakunta'
      });
	},
	kuntaLayer : function() {
		var me = this;
		return new ol.layer.Vector({
        source: me.kuntaSource(),
        style: me.kuntaStyleNormal(),
        category: 'kunta'
      });
	}
}

	module.exports = kuntaValitsin;