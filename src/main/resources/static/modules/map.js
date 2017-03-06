var ol = require('openlayers');
//var ol = require('../ol-debug.js');

var projection = new ol.proj.Projection({
    code: 'EPSG:3067',
    units: 'm'
 });
 
ol.proj.addProjection(projection);

var layers = require('./layers.js');

var map = (function(){
	
	var styleFunction1 = function(feature) {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#333333',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.2)'
        }),
        text: new ol.style.Text({
            font: '12px Verdana',
            text: feature.get('NAMEFIN'),
            fill: new ol.style.Fill({color: 'black'}),
            stroke: new ol.style.Stroke({color: 'white', width: 0.5})
        })
      })
	}
	
	var styleFunction2 = function() {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 255, 0, 0.1)'
        })
      })
	}
	
	var styleFunction3 = function() {
		return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'red',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.1)'
        })
      })
	}
	
	function stringDivider(str, width, spaceReplacer) {
	    if (str.length>width) {
	        var p=width
	        for (;p>0 && str[p]!=' ';p--) {
	        }
	        if (p>0) {
	            var left = str.substring(0, p);
	            var right = str.substring(p+1);
	            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
	        }
	    }
	    return str;
	}
	
	var vectorSource1 = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getAvi())
      });
	
	var vector = new ol.layer.Vector({
 		style: function (feature, resolution) {
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
        text:resolution >= 4000 ? stringDivider(feature.get('NAMEFIN'), 20, "\n") : feature.get('NAMEFIN'),
        font:resolution >= 4000 ? 'Normal 8px Arial' : 'Normal 10px Arial',
//        text:resolution < 100000 ? feature.get('NAMEFIN') : '' ,
        fill: new ol.style.Fill({ color: "#000000" }),
        stroke: new ol.style.Stroke({ color: "#FFFFFF", width: 2 })
        }),
        geometry: function(feature){   
        var retPoint;
        	if (feature.getGeometry().getType() === 'MultiPolygon') {
          retPoint =  getMaxPoly(feature.getGeometry().getPolygons()).getInteriorPoint();
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
    source: vectorSource1
        });
  
	
	function getMaxPoly(polys) {
		  var polyObj = [];
		  //now need to find which one is the greater and so label only this
		  for (var b = 0; b < polys.length; b++) {
		    polyObj.push({ poly: polys[b], area: polys[b].getArea() });
		  }
		  polyObj.sort(function (a, b) { return a.area - b.area });

		  return polyObj[polyObj.length - 1].poly;
		 }
	

	
	var vectorSource2 = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getMaakunnat())
      });
	
	var vectorSource3 = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(layers.getKunnat())
      });
	
	var vectorLayer1 = new ol.layer.Vector({
        source: vectorSource1,
        style: styleFunction1
      });
	
	var vectorLayer2 = new ol.layer.Vector({
        source: vectorSource2,
        style: styleFunction2
      });
	
	var vectorLayer3 = new ol.layer.Vector({
        source: vectorSource3,
        style: styleFunction3
      });

	var createMap = function() {
		var map = new ol.Map({
	    layers: [
	             vector
	    ],
	    target: 'map',
	    controls: ol.control.defaults({
	      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
	        collapsible: false
	      })
	    }),
	    view: new ol.View({
	    	resolutions: [4000,1000,400],
	    	center: [310000, 7200000],
	    	zoom: 0
	    })
	  });
//		map.getView().on('change:resolution', function(e) {console.info(map.getView().getZoom());});
	};
	

	return{
		createMap: createMap
	  };

	})();

	module.exports = map;