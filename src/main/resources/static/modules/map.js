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
	selectedAvis: [],
	selectedMaakunnat: [],
	selectedKunnat: [],
	ifAviSelected: function(code) {
		var me = this;
		return $.inArray(code, me.selectedAvis);
	},
	createMap : function() {
		var me = this;
		me.map = new ol.Map({
	    layers: [me.vectorLayer3(), me.vectorLayer2(), me.vectorLayer1()],
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
//		me.map.on('singleclick', function(evt) {
//			console.dir(evt.target);
//			}
//		);
//		var select = new ol.interaction.Select();
//		me.map.addInteraction(select);
//		console.dir(select.getFeatures());
		me.map.on('singleclick', function(evt) {
			var feature = me.map.forEachFeatureAtPixel(evt.pixel, me.handleFeatureSelection);
			}); 
	},
	handleLayerVisibility : function(zoom) {
		var me = this;
		switch(zoom) {
		    case 0 || 1:
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
		var me = this;
		switch(layer.get('category')) {
		    case 'avi':
				console.info(kuntaValitsin.ifAviSelected(feature.get('NATCODE')));
		    	feature.setStyle(kuntaValitsin.styleFunction3());
		        break;
		    case 'maakunta':
		    	console.info(feature.get('KUNNAT'));
		        break;
		    case 'kunta':
		    	console.info(feature.get('NATCODE'));
		        break;
		    default:
		    	
		}
	},
	aviStyle : function(feature, resolution) {
		var me = this;
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
	styleFunction1 : function(feature) {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#222222',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.8)'
        })
//        text: new ol.style.Text({
//            font: '12px Verdana',
//            text: feature.get('NAMEFIN'),
//            fill: new ol.style.Fill({color: 'black'}),
//            stroke: new ol.style.Stroke({color: 'white', width: 0.5})
//        })
      })
	},	
	styleFunction2 : function() {
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
	styleFunction3 : function() {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 1)',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 200, 200, 0.5)'
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
	vectorSource1 : function() {
		return new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getAvi())
      });
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
	vectorSource2 : function() {return new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getMaakunnat())
      });
	},
	vectorSource3 : function() {return new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getKunnat())
      });
	},
	vectorLayer1 : function() {
		var me = this;
		return new ol.layer.Vector({
        source: me.vectorSource1(),
        style: me.styleFunction1(),
        category: 'avi'
      });
	},
	vectorLayer2 : function() {
		var me = this;
		return new ol.layer.Vector({
        source: me.vectorSource2(),
        style: me.styleFunction2(),
        visible: false,
        category: 'maakunta'
      });
	},
	vectorLayer3 : function() {
		var me = this;
		return new ol.layer.Vector({
        source: me.vectorSource3(),
        style: me.styleFunction3(),
        category: 'kunta'
      });
	}
}

	module.exports = kuntaValitsin;