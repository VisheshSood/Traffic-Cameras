/*
    app.js
    main script file for this mapping application
    source data URL: https://data.seattle.gov/resource/65fc-btcc.json
*/
var WSDOTCount = 0;
var SDOTCount = 0;
var count = 0;
var counta = 0;
var dict = [];
var url = 'https://data.seattle.gov/resource/65fc-btcc.json'
var map;

$(function() {
    'use strict';
    
    //Everytime there is a key change in filter text box, redraw the map markers.
    $("#filter").keyup(function() {
 		var myResults = isLayer($("#filter").val().toLowerCase());
 		for(var result in dict) {
 			map.removeLayer(dict[result][1]); 
 			count++;
 		}
 		for(var result in myResults) {
 			map.addLayer(myResults[result][1]);
 		}
 		updateCounts(myResults);
 	});

    //Create Map method, that takes location and zoom level to create a map.
    function createMap(location, zoom) {
        map = L.map('map').setView(location, zoom);
		L.tileLayer("https://api.tiles.mapbox.com/v4/mapbox.comic/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidmlzaGVzaHNvb2QiLCJhIjoiY2lmdzE0eW10MmQ1bnV3bHl0M3QxdWlzeCJ9.A-yplMtoLRQVD_eccJG3Vw", {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        //Add markers to the map:
        addCircles(map);
    }
        
    //Method to draw circles.
    function addCircles() {
        var myData = $.getJSON(url).then(function(data) {
            parseData(data);
        })
    }

    //Function to run data query on JSON data.
    function parseData(data) {  	
    	$.each(data, function(index, obj) {
                var location = [obj.location.latitude, obj.location.longitude];
                var image = obj.imageurl.url;
                var cameralabel = obj.cameralabel;
            	var camera = obj.ownershipcd;
                var circle = L.circleMarker(location, {
               			color: (camera =='WSDOT')?'red':'blue',
               			fillOpacity: 0.3
               		})
                circle.bindPopup('<h2>' + cameralabel + '</h2><img src="' + image + '">');
               	map.addLayer(circle);
               	dict[location] = {"1":circle, "2":cameralabel.toLowerCase(), "3": '' + camera.toLowerCase()};				
               	if(camera == 'WSDOT') WSDOTCount++;
               	else SDOTCount++;
            })
        $("#WSDOT").html(WSDOTCount);
        $("#SDOT").html(SDOTCount);
    }

    //Method to update counts of each camera type when searched.
    function updateCounts(results) {
    	var wsdotC = 0, sdotC = 0;
    	for (var key in results) {
    		if(results[key][2] == 'wsdot') {
    			wsdotC++;
    		} else {
    			sdotC++;
            }
        }
    	$("#WSDOT").html(wsdotC);
        $("#SDOT").html(sdotC);
    }

    //Method to check if the search string is a marker.
    function isLayer(searchstring) {
    	var result = [];
    	for(var key in dict) {
    		if(dict[key][2].indexOf(searchstring) == 0) {
    			result.push({"1": dict[key][1], "2": dict[key][3]});
    		}
    	}
    	return result;
    }
    createMap([47.6097, -122.3331], 12)
});