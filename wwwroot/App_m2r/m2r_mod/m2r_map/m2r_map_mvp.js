﻿/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file starts Google Maps API
 * for MAP2REAL MVP REV2024.01
 *
 * @summary starts and set-up Google Maps API
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-06-20 00:00:00 
 * Revision         : 01/   2024-06-20  
 * Last modified    : 2024-06-20 11:00:00
 * 
 */

async function m2r_map_initMap() {
	const { Map } = await google.maps.importLibrary("maps");
	const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
	const { LatLngBounds } = await google.maps.importLibrary("core")

	var _center = _M2G.map.center;
	var _zoom = _M2G.map.zoom;

	 map = await new Map(document.getElementById("map"), {
		center: _center,
		 zoom: _zoom,
		 mapTypeId: 'terrain',
		mapId: 'a2d7bfee6f2e2a86'
	});


}


function m2r_centerDevice(device_imei, zoom) {
	//console.log(device_imei)
	if (!device_imei) {
		device_imei = _M2G.device_selected[0];
	}
	if (!_M2G.rendered_vehicles[device_imei]) { return false }
	var location = _M2G.rendered_vehicles[device_imei].latlngfinish;
	m2r_map_setMapCenter(location,zoom);
}

function m2r_map_getMapCenter(latlng) {
	//console.log(latlng);
	return {
		lat: latlng.lat,
		lng: latlng.lng
	}
}

function m2r_map_setMapCenter(latlng, zoom) {
	if (!map) { return false }
	map.setCenter({ lat: latlng.lat, lng: latlng.lng })
	if (zoom) {
		map.setZoom(zoom)
	}
}

function m2r_map_setNewPath(path, id) {
	var style = _M2G.map.styles;

	flightPath = new google.maps.Polyline({
		path: path,
		geodesic: true,
		title: id,
		strokeColor: style.strokeColor,
		strokeOpacity: style.strokeOpacity,
		strokeWeight: style.strokeWeight
	});

	flightPath.addListener("click", () => {
		//console.log(id)
	});

	return flightPath;
}

async function m2r_map_setVehicleMarker(device_imei) {

	//	console.log('set vehicle marker: ', device_imei);
	//	return false
	if (!device_imei) {
		//device_imei = _M2G.device_selected[0];
		device_imei = Object.keys(_M2G.rendered_trips)[0];
		if (!device_imei) {
			return false;
		}
	}

	var Vehicle = _M2G.rendered_vehicles[device_imei];
	var _shape = _M2G.rendered_shapes[device_imei];

	var _position = Vehicle.latlngfinish;
	var _heading = Vehicle.latlngheading;

	if (_shape) {
		//console.log("OK - already rendered")
		_shape.setMap(map);
	} else {
		//console.log("NOK ... let's render");
		const VehicleElement = await new google.maps.marker.AdvancedMarkerElement({
			map,
			content: m2r_map_buildVeicleContent(device_imei, _heading),
			position: _position,
			title: device_imei,
			zIndex:0,
		});

		_M2G.rendered_shapes[device_imei] = VehicleElement;

		VehicleElement.addListener("click", () => {
			toggleHighlight(VehicleElement);
			var _current_trip = _M2G.rendered_vehicles[device_imei];
			var trip_status = _current_trip.trip_type + "<br/>" + _current_trip.details.duration_str;
			_("trip_status_" + device_imei).innerHTML = trip_status
		});


	}

}

function toggleHighlight(markerView) {
	if (markerView.content.classList.contains("highlight")) {
		markerView.content.classList.remove("highlight");
		markerView.zIndex = null;
	} else {
		markerView.content.classList.add("highlight");
		markerView.zIndex = 1;
	}
}

function m2r_map_buildVeicleContent(device_imei, heading) {
	var status = _M2G.rendered_vehicles[device_imei]

	const content = document.createElement("div");

	content.classList.add("property");
	switch (status.ignition) {
		case 0:
			content.classList.add("vehicle_off");
			break;
		case 1:
			if (status.speed == 0) {
				content.classList.add("vehicle_idle");
			} else {
				content.classList.add("vehicle_run");
			}
			break;
	}

	content.innerHTML = `
    <div class="icon" id="device-${device_imei}" style="transform:rotate(${heading}deg)">

        <?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="50px" height="50px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">

<g>
	<path display="none" fill="#ECEFF0" d="M34.595,19.038v-5.591c0-3.542-2.871-6.413-6.412-6.413h-4.332
		c-3.541,0-6.412,2.871-6.412,6.413v5.591c-1.911,0.445-1.912,1.622-1.912,1.622s1.266-0.28,1.912-0.497v21.239
		c0,1.987,1.611,3.599,3.599,3.599h9.956c1.989,0,3.601-1.611,3.601-3.599V20.163c0.646,0.217,1.912,0.497,1.912,0.497
		S36.505,19.482,34.595,19.038z"/>
	<g>
		<path fill="#F9A31C" stroke="#A7A9AC" stroke-miterlimit="10" d="M29.519,42.967H18.447c-1.68,0-3.042-1.361-3.042-3.041V11.587
			C15.406,7.949,18.355,5,21.993,5h3.98c3.638,0,6.587,2.949,6.587,6.587v28.338C32.561,41.605,31.199,42.967,29.519,42.967z"/>
		<path fill="#FCDF4A" d="M26.079,41.258h-4.192c-3.377,0-5.068-0.567-5.068-3.943l1.231-15.483l-2.277-9.607
			c0-3.542,2.871-6.413,6.412-6.413h3.598c3.541,0,6.411,2.871,6.411,6.413l-2.276,9.607l1.231,15.483
			C31.148,40.69,29.457,41.258,26.079,41.258z"/>
		<path fill="#F9A31C" d="M15.729,16.938c0.474-0.08,0.323,0.844,0,1.055c-0.323,0.211-2.235,0.633-2.235,0.633
			S13.494,17.318,15.729,16.938z"/>
		<path fill="#46484B" d="M16.031,14.871c0,0,1.301,6.37,1.428,7.593c0.127,1.224,0.253,13.879,0,14.427
			c-0.253,0.549-0.64,0.423-0.64,0.423s-0.788-1.478-0.788-8.943C16.031,20.904,16.031,14.871,16.031,14.871z"/>
		<path fill="#F16268" d="M16.446,39.55c0.084,0.338,1.519,1.856,1.603,2.151c0.084,0.296-0.759,0.653-1.603-0.253
			S16.446,39.55,16.446,39.55z"/>
		<path fill="#FFCD05" d="M18.303,41.258c0,0,1.033,0.274,1.455,1.055C19.758,42.313,18.429,42.25,18.303,41.258z"/>
		<path fill="#FFFFFF" d="M16.362,10.021c0,0-0.231-2.911,2.668-3.628C19.03,6.392,18.26,9.092,16.362,10.021z"/>
		<path fill="#F9A31C" d="M32.237,16.938c-0.475-0.08-0.323,0.844,0,1.055c0.323,0.211,2.235,0.633,2.235,0.633
			S34.473,17.318,32.237,16.938z"/>
		<path fill="#46484B" d="M31.936,14.871c0,0-1.302,6.37-1.428,7.593c-0.127,1.224-0.253,13.879,0,14.427
			c0.253,0.549,0.641,0.423,0.641,0.423s0.787-1.478,0.787-8.943C31.936,20.904,31.936,14.871,31.936,14.871z"/>
		<path fill="#46484B" d="M18.049,21.832c0,0-1.493-6.412-1.231-7.592c0.261-1.182,3.542-2.068,7.165-2.068
			c3.622,0,6.903,0.886,7.164,2.068c0.263,1.181-1.23,7.592-1.23,7.592s-2.002-0.379-5.934-0.379
			C20.051,21.453,18.049,21.832,18.049,21.832z M23.983,40.646c-4.401,0-5.681-1.097-5.681-1.097l-0.886,0.675
			c2.615,1.899,6.567,1.688,6.567,1.688s3.951,0.212,6.566-1.688l-0.887-0.675C29.663,39.55,28.384,40.646,23.983,40.646z"/>
		<path fill="#F16268" d="M31.52,39.55c-0.084,0.338-1.519,1.856-1.603,2.151c-0.085,0.296,0.759,0.653,1.603-0.253
			C32.364,40.542,31.52,39.55,31.52,39.55z"/>
		<path fill="#FFCD05" d="M29.663,41.258c0,0-1.033,0.274-1.455,1.055C28.208,42.313,29.537,42.25,29.663,41.258z"/>
		<path fill="#FFFFFF" d="M31.604,10.021c0,0,0.231-2.911-2.668-3.628C28.937,6.392,29.706,9.092,31.604,10.021z"/>
	</g>
</g>



</svg>
    </div>
    <div class="details">
        <div class="price">${device_imei}</div>
        <div id="trip_status_${device_imei}" class="address">{{trip_status}}</div>
		<div class="features d-none">
        <div>
            <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
            <span class="fa-sr-only">bathroom</span>
            /*<span>${property.bath}</span>*/
        </div>
        <div>
            <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
            <span class="fa-sr-only">size</span>
            /*<span>${property.size} ft<sup>2</sup></span>*/
        </div>
        </div>
    </div>
    `;
	return content;

}

const property = [
	{
		address: "215 Emily St, MountainView, CA",
		description: "Single family house with modern design",
		price: "$ 3,889,000",
		type: "home",
		bed: 5,
		bath: 4.5,
		size: 300,
		position: {
			lat: 37.50024109655184,
			lng: -122.28528451834352,
		},
	}

]

function m2r_map_setTripPathShape(device_imei, trip_nr, status) {
	//console.log('Set path shape for: ', device_imei, trip_nr, status);

	var trip_shape = device_imei + "-" + trip_nr;
	//console.log(trip_shape);
	var _path = _M2G.rendered_shapes[trip_shape];
	if (!_path) {
		return false;
	}
	if (status) {
		_path.setMap(map)
	} else {
		_path.setMap(null)
	}

}

function m2r_map_clearTripPathShape(device_imei, trip_nr) {

	var clearArr = [device_imei];
	if (!device_imei) {
		clearArr = Object.keys(_M2G.rendered_devices);
	}
	//console.log(clearArr);
	for (var i = 0; i < clearArr.length; i++) {

		var sl = 1;
		var device_imei = clearArr[i];
		if (!trip_nr) {
			var trips = _M2G.rendered_trips[device_imei];
			var sl = Object.keys(trips).length;
		}
		//console.log(trip_nr, sl);
		for (var j = 0; j < sl; j++) {

			m2r_map_setTripPathShape(device_imei, j, null);
		}
	}
}


function m2r_map_fitMapToBounds(device) {

	var vehicles = _M2G.rendered_vehicles;
	var o = Object.keys(vehicles);
	var ol = o.length;

	var mapbounds = new google.maps.LatLngBounds();

	if (!device) {
		for (var i = 0; i < ol; i++) {
			var b = vehicles[o[i]].bounds;
			mapbounds.extend(b.NE);
			mapbounds.extend(b.SW);
		}
	} else {
		var b = vehicles[device].bounds;
		mapbounds.extend(b.NE);
		mapbounds.extend(b.SW);
	}

	map.fitBounds(mapbounds);

}

function m2r_map_fitMaptoPathBounds(device) {
	//console.log(device_imei, trip_nr);
	//console.log(device)
	var path = _M2G.rendered_trips[device.id][device.trip_nr].path;
	//console.log(path);

	var mapbounds = new google.maps.LatLngBounds();

	for (var i = 0; i < path.length; i++) {
		mapbounds.extend(path[i]);
	}

	map.fitBounds(mapbounds);
	var zoom = map.getZoom();
	map.setZoom(zoom - 1);
}

function m2r_setShapeZindex(device0, device1) {

	if (!_M2G.rendered_shapes[device0] || !_M2G.rendered_shapes[device1]) {
		m2r_fetchmap()
		return false;
	}
	if (!_M2G.rendered_shapes[device0]) {
		return false;
	}

	if (device0) {
		_M2G.rendered_shapes[device0]["zIndex"] = 0;
	}
	if (device1) {
		_M2G.rendered_shapes[device1]["zIndex"] = 1;
	}
}

function m2r_map_highlightPath(pathid, status) {

	var _strokeColor = _M2G.map.styles.strokeColor;
	var _strokeOpacity = _M2G.map.styles.strokeOpacity;
	var _strokeWeight = _M2G.map.styles.strokeWeight;
	var _zIndex = 0;

	if (status) {
		_strokeColor = _M2G.map.styles.strokeColorHighLight;
		_strokeOpacity = _M2G.map.styles.strokeOpacityHighLigth;
		_strokeWeight = _M2G.map.styles.strokeWeightHighLight;
		_zIndex = 1;
	}

	if (_M2G.rendered_shapes[pathid]) {
		_M2G.rendered_shapes[pathid].strokeColor = _strokeColor;
		_M2G.rendered_shapes[pathid].strokeOpacity = _strokeOpacity;
		_M2G.rendered_shapes[pathid].strokeWeight = _strokeWeight;
	}

	//console.log(pathid, _strokeColor, _strokeWeight, _strokeOpacity);
	var shape = _M2G.rendered_shapes[pathid];
	if (!shape) {
		return false;
	}
	shape.setOptions({
		strokeColor: _strokeColor,
		strokeOpacity: _strokeOpacity,
		strokeWeight: _strokeWeight,
		zIndex: _zIndex
	});

	shape.setMap(map);
}