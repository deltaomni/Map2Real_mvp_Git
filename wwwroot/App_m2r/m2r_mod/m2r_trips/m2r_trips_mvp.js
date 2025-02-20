/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file handles trips
 * for MAP2REAL MVP REV2024.01
 *
 * @summary Define, create, evaluate user trips
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-05-14 00:00:00 
 * Revision         : 01/   2024-05-14  
 * Last modified    : 2024-05-14 11:00:00
 * 
 */


let sortedPaths = null;
let map;

var _TRG = {
	//"device_imei": [ '867488060855003'], /*['122145', '862193026868968', '867488060855003', '867488060855136'], */
	//"device_selected": ['867488060855003'], 
	"user_selected": null,
	"vehicle_selected":null,
	"date_start": null,//'2024-07-05',
	"date_finish": null,
	"period": null,
	"heatmap": false,
	"paths": null,
	"paths_shapes": null,
	"sorted_paths": null,
	"rendered_paths": null,
	"rendered_shapes": null,
	"rendered_devices": null,
	"rendered_trips": null,
	"rendered_vehicle": {},
	"filters": [],
};



window.onload = function () {

	// Starts Filter Module
	m2r_setDateBounds()

	m2r_app_start('start')

	// Set Events on UIX
	m2r_uix_startPageUIX()

}

async function m2r_app_start(device, status) {
	var _selected = _M2G.device_selected[0];


	if (status != 'update') {


		// Start Google Map
		await m2r_map_initMap();
	}
	// Get Raw Path Data
	if (!device) {
		var JSONpaths = await m2r_getRawPathData();
	} else {
		JSONpaths = await m2r_getRawPathData(device);
	}

	if (!JSONpaths) { return false }

	var buildtrips = m2r_buildTripsPerDevice(JSONpaths);

	var o = Object.keys(_M2G.rendered_vehicles);
	var check = o.indexOf(_selected);

	if (check == -1 && o.length) {
		_M2G.device_selected = [o[0]]; // Select first device arbitrarily
	}

	// set selection buttons
	m2r_setSelectionButtons();

	//center on selected device
	m2r_setSelectedOption(_selected)

}

function m2r_setDateBounds() {
	console.log(_M2G.filters_selected);


	const todayDate = new Date();
	var date_start = m2r_getDateFormated(todayDate.toString());

	// Add 1 day
	//todayDate.setDate(todayDate.getDate() + 1);
	//var date_finish = m2r_getDateFormated(todayDate.toString());
	var date_finish = date_start;

	if (!_M2G.date_start) {
		_M2G.date_start = date_start;
	} else {
		date_start = _M2G.date_start;
	}

	if (!_M2G.date_finish) {
		_M2G.date_finish = date_finish;
	} else {
		date_finish = _M2G.date_finish;
	}
	var _uix_date_finish = _M2G.date_finish
	console.log(new Date(_uix_date_finish))

	_('m2r_date_from').value = date_start;
	_('m2r_date_to').value = _uix_date_finish;// date_finish;
}

function m2r_getDateFormated(dateStr) {

	if (dateStr) {
		var date = new Date(dateStr);
	} else {
		date = new Date();
	}

	var date_year = date.getFullYear();
	var date_mo = date.getMonth() + 1;
	if (date_mo < 10) {
		date_mo = '0' + date_mo;
	}

	var date_dd = date.getDate();

	if (date_dd < 10) {
		date_dd = '0' + date_dd;
	}
	var date_formated = [date_year, date_mo, date_dd].join('-');

	return date_formated;
}

function m2r_getTimeFromTimeStamp(timestamp, type) {

	var hours2 = Math.floor(timestamp / 3600);

	timestamp = timestamp - hours2 * 3600;
	minutes2 = Math.floor(timestamp / 60);

	timestamp = timestamp - minutes2 * 60;
	//var seconds = Math.floor(timestamp / 60);
	var seconds = timestamp;

	var _hours = "h";
	var _minutes = "min";
	var _seconds = "s";

	if (hours2 > 1) { _hours += "s" }
	if (minutes2 > 1) { _minutes += "s" }
	//if (seconds > 1) { _seconds += "s" }
	if (!type) {
		var timeformated = hours2 + _hours + " " + minutes2 + _minutes + " " + seconds + _seconds;
	} else {
		if (hours2 < 10) {
			hours2 = "0" + hours2;
		}
		if (minutes2 < 10) {
			minutes2 = "0" + minutes2;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		timeformated = hours2 + ":" + minutes2 + ":" + seconds;
	}

	return timeformated;
}

async function m2r_getRawPathData(device) {

	var JSONpaths = "";
	var rawPaths = await m2r_fetchmap(device);

	if (!rawPaths) { return false; }

	if (rawPaths.length) {
		JSONpaths = JSON.parse(rawPaths);

	} else {
		_TRG.sorted_paths = null;
		_TRG.paths = null;
		console.log('No data from:', _TRG.date_start, "to:", _TRG.date_finish);
	}
	return JSONpaths;
}



function m2r_sortpath(json) {
	var path = []
	for (var i = 0; i < json.length; i++) {
		var ji = json[i];
		var id = ji.id;
		var device_imei = ji.device_imei;
		var event_date = ji.event_date;

		var item = [event_date,{ ...json[i] }];
		path.push(item)
	}
	var sortedpath = path.sort(function (a, b) { return a[0] - b[0] })

	return sortedpath;
}

function m2r_buildPaths() {
	var _paths = {}
	var paths = _TRG.paths;
	var pl = paths.length;

	for (var i = 0; i < pl; i++) {
		var event_type = paths[i].event_type;
		if (event_type != "GTIGF2") { // handle log error type
			var lat = paths[i].lat;
			var lng = paths[i].lng;
		} else { // invert
			lat = paths[i].lng;
			lng = paths[i].lat;
		}
		var latlng = { "lat": Number(lat), "lng": Number(lng) };
		var trip_numbr = paths[i].trip_nr;
		// console.log(trip_numbr)
		var device_imei = paths[i].device_imei;
		if (!_paths[device_imei]) {
			_paths[device_imei] = {}
			_paths[device_imei][trip_numbr] = { "path": [latlng] }

		} else {
			if (!_paths[device_imei][trip_numbr]) {
				_paths[device_imei][trip_numbr] = { "path": [latlng] }
				//console.log(trip_nr,'new')
			} else {
				_paths[device_imei][trip_numbr]["path"].push(latlng);
			}
		}
	}
	return _paths;
}

function m2r_trips_getPathShapes() {
	var _paths = {}
	var paths = _TRG.paths;
	var pl = paths.length;

	for (var i = 0; i < pl; i++) {
		var p = paths[i]
		var date_short = p.date_short;
		var device_imei = p.device_imei;
		var event_date = p.event_date;
		var event_id = p.id;
		var trip_nr = p.trip_nr;
		var diff_time = p.diff_time;
		var diff_distance = p.diff_distance;

		var lat = p.lat;
		var lng = p.lng;
		var latlng = { "lat": Number(lat), "lng": Number(lng) };

		if (!_paths[trip_nr]) {
			var item = {
				"id": event_id,
				"date_short": date_short,
				"device_imei": device_imei,
				"event_date_start": event_date,
				"event_date_end": null,
				"ignition_on": false,
				"trip_tt": diff_time,
				"trip_dt": diff_distance,
				"path": [latlng]
			}

			item.date_short = date_short;
			item.device_imei = device_imei;

			_paths[trip_nr] = item;

		}
		_paths[trip_nr]["trip_tt"] += diff_time;
		_paths[trip_nr]["trip_dt"] += diff_distance;
		_paths[trip_nr]["path"].push(latlng);
	}

	return _paths;
}


