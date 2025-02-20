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
 * Created on       : 2024-05-30 00:00:00 
 * Revision         : 01/   2024-06-30  
 * Last modified    : 2024-06-30 11:00:00
 * 
 */

var _M2G = {
	"app_uri": { "prefix": "https://map2real.azurewebsites.net/", "uri": 'api/events/ms/' },
	"device_default": '867488060842019', 
	"device_imei": [
		'867488060855003',
		'862193026868968',
		'867488060842019',
		'867488060828356',
		'867488060847315',
		'867488060827689',
		'867488060821138',
		'867488060855136'
	],

	"device_selected": ['867488060842019'],//['867488060855003'],
	"filters_defaults": {
		date_range: ['today'],
		details_operator: ['UNIVAR'],
		details_profile: ['all'],
		device_imei: ['all'],
		harsh_behavior: ['all'],
		time_range: ['all'],
		trip_category: ['all'],
	},
	"filters_selected": {},
	"user_selected": null,
	"vehicle_selected": null,
	"date_start": null, //"2024-09-20"
	"date_finish": null, //"2024-09-27" 
	"devices_templates": _devices_templates,
	"event_types": {
		"hbDPA36": { id: 36, type: "DPA", desc: "Freio e Curva", ini: "36-F&C" },
		"hbDPA37": { id: 37, type: "DPA", desc: "Acelerador e Curva", ini: "37-A&C" },
		"hbDPA38": { id: 38, type: "DPA", desc: "Desconhecido", ini: "38-?" },
		"hbDPA46": { id: 46, type: "DPA", desc: "Aceleração Brusca", ini: "46-AB" },
		"hbDPA47": { id: 47, type: "DPA", desc: "Freada Brusca", ini: "47-FB" },
		"hbDPA48": { id: 48, type: "DPA", desc: "Curva Brusca", ini: "48-CB" },
		"hbDPA10": { id: 10, type: "DPA", desc: "Uso do pedal", ini: "10-Ped" },
		"hbGTERI10": { id: 10, type: "GTERI", desc: "Sistema", ini: "10-Reg" },
		"hbGTIGN0": { id: 0, type: "GTIGN", desc: "Ignição", ini: "0-Ign" },
	},
	"fetch_uri": {
		"prefix": "m2r_uix_",
		"uri": "/App_m2r/m2r_html/", //**NEVER EVER REMOVE FIRST SLASH**
		"suffix": ".html",
		"files": {
			"offcanvas_trip": "offcanvas_trip",
			"report_trip": "m2r_report_trip"
		}
	},
	locale: { app_locale: navigator.languages[0] },
	rendered_devices: null,
	rendered_trips: null,
	rendered_trips_rows: null,
	rendered_trips_filtered: null,
	rendered_shapes: {},
	rendered_vehicles: {},
	"map": {
		"center": { "lat": -19.977187, "lng": -43.975428 },
		// "center": { "lat": 0.00, "lng": 0.00 },
		"zoom": 15,
		"view_bounds": [],
		"shapes": null,
		"styles": {
			strokeColor: 'blue', //"#FF0000",
			strokeOpacity: 0.2, //0.40,
			strokeWeight: 4,
			strokeColorHighLight: 'yellow', //"#FF0000",
			strokeOpacityHighLigth: 1, //0.40,
			strokeWeightHighLight: 5,
		}
	},
	"user_setup": {
		"utc": -3,
		"time": {
			"short": [null, "Curta"], "medium": [null, "Média"], "long": [null, "Longa"], "newtrip": 300
		},
		"TrafficZones": [ // D in meters, Avg in km/h
			{ id: "Z1", Dmin: 0, Dmax: 20000, Vavgmin: 0, Vavgmax: 20 },
			{ id: "Z2", Dmin: 0, Dmax: 20000, Vavgmin: 20, Vavgmax: 500 },
			{ id: "Z3", Dmin: 20000, Dmax: 70000, Vavgmin: 0, Vavgmax: 50 },
			{ id: "Z4", Dmin: 20000, Dmax: 70000, Vavgmin: 50, Vavgmax: 500 },
			{ id: "Z5", Dmin: 70000, Dmax: 400000, Vavgmin: 0, Vavgmax: 70 },
			{ id: "Z6", Dmin: 70000, Dmax: 400000, Vavgmin: 70, Vavgmax: 500 },
			{ id: "trip400", Dmin: 400000, Dmax: 50000000, Vavgmin: 0, Vavgmax: 500 },
		],
		"distance": {
			"short": [null, "Curta"], "medium": [null, "Média"], "long": [null, "Longa"], "newtrip": 300
		},
		"day_period": {
			"day": 500, "night": 1900, "critical": 2300
		},
		"units": { "time": "s", "distance": "km", speed: "km/h" }
	},
	"trip_setup": {
		"status": { "idle": "Estacionado", "off": "Ignição Off", "run": "Em Movimento", "default": "idle" },
		"class": { "idle": "text-info", "off": "text-primary", "run": "text-warning", "default": "idle" }
	}
}

function m2r_buildTripsPerDevice(JSONpaths) {

    // sort events by device
    _M2G.rendered_devices = m2r_getDevicesSortedEvents(JSONpaths);

    // set event parameters required to define trips
	var devices_events_parameters = m2r_setEventParameters();
	var trip_params = m2r_setTripParameters(devices_events_parameters)

    // define trips 
    _M2G.rendered_trips = m2r_getTripsByDevice();

    // set trip parameters
	m2r_getTripParameters();
}

function m2r_getDevicesSortedEvents(json) {
	var devices = {}
	for (var i = 0; i < json.length; i++) {
		var device_imei = json[i].device_imei;
		var event_date = json[i].event_date;

		var event = { ...json[i] };
		if (devices[device_imei]) {
			devices[device_imei].push(event)
		} else {
			devices[device_imei] = [event]
		}
	}

	// sort Paths
	var sorted_devices = {};
	var o = Object.keys(devices);

	for (var j = 0; j < o.length; j++) {
		var sorted = devices[o[j]].sort(function (a, b) { return a.event_date - b.event_date })
		sorted_devices[o[j]] = sorted;
	}

	return sorted_devices;

}


function m2r_setEventParameters(device) {

	if (!device) {
		var devices = Object.keys(_M2G.rendered_devices)
	} else {
		devices = [device]
	}

	if (!devices) { return false }

	for (var i = 0; i < devices.length; i++) {
		var device = devices[i];
		var device_events = _M2G.rendered_devices[device];

		var trip_nr = 0;
		var trip_nr_m2 = device_events[0].id;
		var diff_time_sum = 0;
	
		for (var j = 0; j < device_events.length; j++) {
			var _EVENT01_TRIP_TYPE = null;

			var event = device_events[j];

			var ignition = Number(event["ignition"]);

			var check_run = false;
			var check_stop = false;

			var device_imei = event["device_imei"];
			var _distance_sum = [0, 0, 0];

			if (j < 3) {
				var diff_time = 0;
				var diff_distance = 0;
			} else {
				var pevent = device_events[j - 1];
				var prev_diff_time = pevent["diff_time"];

				diff_time = Math.abs(event.event_date - pevent.event_date);
					diff_distance = Math.abs(Number(event.odometer) - Number(pevent.odometer));
				_distance_sum = [diff_distance, pevent.diff_distance, pevent.diff_distance_sum[2] ];

				if (i < device_events[j].length - 1) {
				} else {
					next_diff_time = 0;
				}

				var trip_nr = pevent["trip_nr"];
				var time_new_trip = _M2G.user_setup.time.newtrip;
				switch (device_imei) {
					case "122145":
						check_run = ignition == 1 && diff_time > time_new_trip;
						check_stop = ignition == 0 && diff_distance == 0 && diff_time < 1800;

						if (check_run || check_stop) {
							trip_nr++
							trip_nr_m2 = pevent.id;
							diff_time_sum = 0;
						}

						break;
					 default:

						// _EVENT01_TRIP_TYPE
						var check01 = prev_diff_time <= time_new_trip && diff_time <= time_new_trip;

						if (check01) {
							_EVENT01_TRIP_TYPE = "RUN"
						} else {
							_EVENT01_TRIP_TYPE = "IDLE"
						}

						var check2 = check01 && pevent["EVENT01_TRIP_TYPE"] == "IDLE";
						var check3 = !check01 && pevent["EVENT01_TRIP_TYPE"] == "RUN";

						if (check2 || check3) {
							trip_nr++;
							trip_nr_m2 = event.id;
							diff_time_sum = 0;
						}

						break;

				}
			}

			// time difference between events
			event["diff_time"] = diff_time;
			diff_time_sum += diff_time;
			event["diff_time_sum"] = diff_time_sum;
			event["diff_time_sum_str"] = m2r_getTimeFromTimeStamp(diff_time_sum)

			// distance difference between events
			event["diff_distance"] = diff_distance;
			event["diff_distance_sum"] = _distance_sum;

			var _app_locale = _M2G.locale.app_locale;
			var date_time = new Date(event.date_bsb).toLocaleTimeString(_app_locale)
			event["date_time"] = date_time;

			var dd = event["date"];
			var date_short = m2r_getDateFormated(dd)
			event["date_short"] = date_short;
			event["trip_nr"] = trip_nr;
			event["trip_nr_m2"] = trip_nr_m2;

			event["EVENT01_TRIP_TYPE"] = _EVENT01_TRIP_TYPE;
			event["EVENT02_RUN_START"] = null;
			event["EVENT03_RUN_STATE"] = null;
			event["EVENT04_RUN_FINISH"] = null;
			event["EVENT05_IDLE_START"] = null;
			event["EVENT06_IDLE_STATE"] = null;
			event["EVENT07_IDLE_FINISH"] = null;
			event["EVENT08_IGNITION_STATE"] = null;
			event["EVENT09_10_PEDAL"] = null;
			event["EVENT10_46_ACCELERATION"] = null;
			event["EVENT11_47_BRAKE"] = null;
			event["EVENT12_48_TURN"] = null;
			event["EVENT13_36_BRAKE_AND_TURN"] = null;
			event["EVENT14_37_ACCELERATION_AND_TURN"] = null;
			event["EVENT15_38_UNKNOWN"] = null;
			event["EVENT16_SUMMARY"] = null;
			event["EVENT17_REGISTRO"] = null;
		}
	}
	return devices;
}

function m2r_setTripParameters(_device) {
	if (!device) {
		var devices = Object.keys(_M2G.rendered_devices)
	} else {
		devices = [_devices]
	}

	if (!devices) { return false }

	for (var i = 0; i < devices.length; i++) {
		var device = devices[i];
		var device_events = _M2G.rendered_devices[device];

		for (var j = 1; j < device_events.length-1; j++) {
			//var _EVENT01_TRIP_TYPE = null;
			var _EVENT02_RUN_START = null;
			var _EVENT03_RUN_STATE = null;
			var _EVENT04_RUN_FINISH = null;
			var _EVENT05_IDLE_START = null;
			var _EVENT06_IDLE_STATE = null;
			var _EVENT07_IDLE_FINISH = null;
			var _EVENT08_IGNITION_STATE = null;
			var _EVENT09_10_PEDAL = null;
			var _EVENT10_46_ACCELERATION = null;
			var _EVENT11_47_BRAKE = null;
			var _EVENT12_48_TURN = null;

			var _EVENT13_36_BRAKE_AND_TURN = null;
			var _EVENT14_37_ACCELERATION_AND_TURN = null;

			var _EVENT15_38_UNKNOWN = null;
			var _EVENT16_SUMMARY = [];

			var event = device_events[j];
			var pevent = device_events[j - 1];
			var nevent = device_events[j + 1];

			var event_type = event["event_type"];

			// _EVENT02_RUN_START
			var check02 = pevent["EVENT01_TRIP_TYPE"] == "IDLE" && event["EVENT01_TRIP_TYPE"] == "RUN";

			if (check02) {
				_EVENT02_RUN_START = "RUN_START"
				_EVENT16_SUMMARY.push(_EVENT02_RUN_START)
			}

			// EVENT03_RUN_STATE
			var check03 = pevent["EVENT01_TRIP_TYPE"] == "RUN" && event["EVENT01_TRIP_TYPE"] == "RUN";
			var check03b = event["EVENT01_TRIP_TYPE"] == "RUN" && nevent["EVENT01_TRIP_TYPE"] == "IDLE";

			if (check03) {
				_EVENT03_RUN_STATE = "RUN";
				_EVENT16_SUMMARY.push(_EVENT03_RUN_STATE)
			}
			if (check03b) {
				_EVENT03_RUN_STATE = null;
			}

			// _EVENT04_RUN_FINISH
			if (check03b) {
				_EVENT04_RUN_FINISH = "RUN_FINISH";
				_EVENT16_SUMMARY.push(_EVENT04_RUN_FINISH)
			}

			//_EVENT05_IDLE_START
			var check05 = pevent["EVENT01_TRIP_TYPE"] == "RUN" && event["EVENT01_TRIP_TYPE"] == "IDLE";
			if (check05) {
				_EVENT05_IDLE_START = "IDLE_START";
				_EVENT16_SUMMARY.push(_EVENT05_IDLE_START)
			}

			//_EVENT06_IDLE_STATE
			var check06 = event["EVENT01_TRIP_TYPE"] == "IDLE" && nevent["EVENT01_TRIP_TYPE"] == "IDLE";

			if (check06) {
				_EVENT06_IDLE_STATE = "IDLE";
				_EVENT16_SUMMARY.push(_EVENT06_IDLE_STATE)
			}
			if (check05) {
				_EVENT06_IDLE_STATE = null;
			}

			//_EVENT07_IDLE_FINISH
			var check07 = event["EVENT01_TRIP_TYPE"] == "IDLE" && nevent["EVENT01_TRIP_TYPE"] == "RUN";
			if (check07) {
				_EVENT07_IDLE_FINISH = "IDLE_FINISH";
				_EVENT16_SUMMARY.push(_EVENT07_IDLE_FINISH)
			}

			//_EVENT08_IGNITION_STATE
			var check_GTIGN = event_type == "GTIGN";
			if (check_GTIGN) {
				_EVENT08_IGNITION_STATE = "IGNITION_ON";
				_EVENT16_SUMMARY.push(_EVENT08_IGNITION_STATE)
			}

			var check_events = event["EVENT01_TRIP_TYPE"] == "RUN"
			if (check_events) {
				var type_id = event["type_id"];
				var check_DPA = event_type == "DPA";
				var check_GTERI = event_type == "GTERI"
				var _SUMMARY = null;
				switch (type_id) {
					case 0:
						if (check_GTIGN) {
							_SUMMARY = "Pedal IGN"
						}
						break;
					case 1:
							_SUMMARY = "Registro"
						break;
					case 10:
						if (check_DPA) {
							// adjust [ignition], [hourmeter], [odometer]
							event["ignition"] = pevent["ignition"];
							event["hourmeter"] = pevent["hourmeter"];
							event["odometer"] = pevent["odometer"];
							_EVENT09_10_PEDAL = "Pedal 10";
							_SUMMARY = _EVENT09_10_PEDAL;
						}
						if (check_GTERI) {
							_SUMMARY = "Registro"
						}
						break;
					case 46:
						if (check_DPA) {
							_EVENT10_46_ACCELERATION = "Aceleração Brusca";
							_SUMMARY = _EVENT10_46_ACCELERATION;
						}
						break;
					case 47:
						if (check_DPA) {
							_EVENT11_47_BRAKE = "Freada Brusca";
							_SUMMARY = _EVENT11_47_BRAKE;
						}
						break;
					case 48:
						if (check_DPA) {
							_EVENT12_48_TURN = "Curva Brusca";
							_SUMMARY = _EVENT12_48_TURN;
						}
						break;
					case 36:
						if (check_DPA) {
							_EVENT13_36_BRAKE_AND_TURN = "Freada e Curva";
							_SUMMARY = _EVENT13_36_BRAKE_AND_TURN;
						}
						break;
					case 37:
						if (check_DPA) {
							_EVENT14_37_ACCELERATION_AND_TURN = "Aceleração e Curva";
							_SUMMARY = _EVENT14_37_ACCELERATION_AND_TURN;
						}
						break;
					case 38:
						if (check_DPA) {
							_EVENT15_38_UNKNOWN = "Desconhecido";
							_SUMMARY = _EVENT15_38_UNKNOWN
						}
						break;
					default:
						break;
				}
				if (_SUMMARY) {
					_EVENT16_SUMMARY.push(_SUMMARY)
				}
			}

			//event["EVENT01_TRIP_TYPE"] = _EVENT01_TRIP_TYPE;
			event["EVENT02_RUN_START"] = _EVENT02_RUN_START;
			event["EVENT03_RUN_STATE"] = _EVENT03_RUN_STATE;
			event["EVENT04_RUN_FINISH"] = _EVENT04_RUN_FINISH;
			event["EVENT05_IDLE_START"] = _EVENT05_IDLE_START;
			event["EVENT06_IDLE_STATE"] = _EVENT06_IDLE_STATE;
			event["EVENT07_IDLE_FINISH"] = _EVENT07_IDLE_FINISH;
			event["EVENT08_IGNITION_STATE"] = _EVENT08_IGNITION_STATE;
			event["EVENT09_10_PEDAL"] = _EVENT09_10_PEDAL;
			event["EVENT10_46_ACCELERATION"] = _EVENT10_46_ACCELERATION;
			event["EVENT11_47_BRAKE"] = _EVENT11_47_BRAKE;
			event["EVENT12_48_TURN"] = _EVENT12_48_TURN;
			event["EVENT13_36_BRAKE_AND_TURN"] = _EVENT13_36_BRAKE_AND_TURN;
			event["EVENT14_37_ACCELERATION_AND_TURN"] = _EVENT14_37_ACCELERATION_AND_TURN;
			event["EVENT15_38_UNKNOWN"] = _EVENT15_38_UNKNOWN;
			event["EVENT16_SUMMARY"] = _EVENT16_SUMMARY;
		}
	}
}

function m2r_getTripsByDevice() {

	var devices = Object.keys(_M2G.rendered_devices)
	var trips = [];

	for (var i = 0; i < devices.length; i++) {
		var device = devices[i];

		var events = m2r_buildTripsByDevice(device);
		trips[device] = events;
	}

	return trips;
}

function m2r_buildTripsByDevice(_device) {
	var paths = {};
	var events = _M2G.rendered_devices[_device]
	for (var i = 0; i < events.length; i++) {
		var trip_nr = events[i].trip_nr;
		if (paths[trip_nr]) {
			paths[trip_nr]["events"].push(events[i])
		} else {
			paths[trip_nr] = { events: [events[i]] }
		}
	}
	return paths;
}


function m2r_getTripParameters(device) {
	if (!device) {
		var devices = Object.keys(_M2G.rendered_trips)
	} else {
		devices = [device];
	}

	var vehicle_last_event = null;
	var _rowArray = [];

	for (var i = 0; i < devices.length; i++) {
		var device = devices[i];

		var trips = _M2G.rendered_trips[device];
		// console.log(device, trips)

		var keys = Object.keys(trips);

		for (var j = 0; j < keys.length; j++) {
			var trip = trips[keys[j]].events;

			var tripCompute = m2r_computeTripDetails(trip);
	
			var tripDetails = tripCompute[0];
			var tripRow = tripCompute[1];
			if (tripRow.details_distance !== 0) {
				_rowArray.push(tripRow);
			}

			trips[keys[j]]["details"] = tripDetails;
			var _path = m2r_buildTripPaths(trip)
			trips[keys[j]]["path"] = _path;
			var shpid = device + "-" + j;
			var _shapePath = m2r_map_setNewPath(_path, shpid);

			_shapePath.id = shpid;
			/*trips[keys[j]]["shape"] = _shapePath;*/
			tripDetails["trip_nr"] = j;

			if (tripDetails.distance.total > 0) {
				//console.log(tripDetails.distance.total);
				_shapePath.setMap(map);
			}
			vehicle_last_event = tripDetails;
			_M2G.rendered_shapes[shpid] = _shapePath;
		}
		_M2G.rendered_vehicles[device] = vehicle_last_event;
		if (_M2G.device_selected[0] == device) {
			_M2G.map.center = vehicle_last_event.latlngfinish;
		}
		m2r_map_setVehicleMarker(device)
	}

	_M2G.rendered_trips_rows = _rowArray
}

function m2r_computeTripDetails(trip) {
	var _app_locale = _M2G.locale.app_locale;
	// console.log(trip);

	var _device_imei = trip[0].device_imei;
	var _template = m2r_templates_find_by_device(_device_imei)

	var tl = trip.length;
	var _ddstart = trip[0].event_date;
	var _ddend = trip[tl - 1].event_date;

	// DateTime
	var _ddstartlocal = trip[0].date_bsb;
	var _ddendlocal = trip[tl - 1].date_bsb;
	var _ddstartlocalshort = new Date(_ddstartlocal).toLocaleDateString(_app_locale);
	var _time_ini = new Date(_ddstartlocal).toLocaleTimeString(_app_locale);
	var _time_end = new Date(_ddendlocal).toLocaleTimeString(_app_locale);

	var _time_total = Math.abs(_ddend - _ddstart);
	var _idstart = trip[0].id;
	var _idend = trip[tl - 1].id;

	var _NE = { lat: Math.max(trip[0].lat, trip[tl - 1].lat), lng: Math.max(trip[0].lng, trip[tl - 1].lng) }
	var _SW = { lat: Math.min(trip[0].lat, trip[tl - 1].lat), lng: Math.min(trip[0].lng, trip[tl - 1].lng) }

	var _odostart = 0; // Number(trip[0].odometer);
	var _odofinish = _odostart; // Number(trip[tl - 1].odometer);
	var _distance = 0;
	var _distance_total = _odostart;

	var _idle = 0;
	var _move = 0;
	var _path = [];

	//speed
	var speedlat = null;
	var speedlng = null;
	var _speedUnit = _M2G.user_setup.units.speed;
	var _speed0 = 0;
	var _speed30 = 0;
	var _speed60 = 0;
	var _speed90 = 0;
	var _speed120 = 0;

	var _elfinish = Number(trip[0].altitude)
	var _elmax = -10000
	var _elmin = 10000
	var _elstart = Number(trip[tl - 1].altitude);
	var _eldiff = _elfinish - _elstart;

	var _max = 0;

	// Day Period
	var _daydistance = 0;
	var _dayduration = 0;
	var _nightdistance = 0;
	var _nightduration = 0;
	var _criticaldistance = 0;
	var _criticalduration = 0;
	var _dayperiod_day = _M2G.user_setup.day_period.day * 36;
	var _dayperiod_night = _M2G.user_setup.day_period.night * 36;
	var _dayperiod_critical = _M2G.user_setup.day_period.critical * 36;


	//harsh behavior
	var _hbselected = Object.keys(_M2G.event_types);

	var _hb = {}

	for (var i = 0; i < trip.length; i++) {
	

		var type_id = trip[i].type_id;
		var event_type = trip[i].event_type;
		var _trip_nr = trip[i].trip_nr;
		var _trip_nr_m2 = trip[i].trip_nr_m2;
		var _speed = trip[i].speed;

		var node = { lat: trip[i].lat, lng: trip[i].lng }
		_path.push(node);

		if (i == 0) {
			var _latlngstart = { ...node };
		}

		if (i > 0) {
			_NE = { lat: Math.max(trip[1].lat, _NE.lat), lng: Math.max(trip[1].lng, _NE.lng) }
			_SW = { lat: Math.min(trip[1].lat, _SW.lat), lng: Math.min(trip[1].lng, _SW.lng) }

			var _time = trip[i].event_date - trip[i - 1].event_date;
			// Diff time in seconds between events
			var _t1 = new Date(trip[i].date_bsb).getTime();
			var _t2 = new Date(trip[i - 1].date_bsb).getTime();
			var _time2 = Math.floor(_t1 - _t2) / 1000;

			_distance = Number(trip[i].odometer) - Number(trip[i - 1].odometer);

			var _speed_diff = _speed;

			if (trip[i].ignition == 1 && _speed_diff ==0 ) {
				_idle = _idle + _time2;
			} else {
				_move = _move + _time2;
			}

			// new day?
			var _newday = new Date(_ddstartlocal).getDate() != new Date(trip[i - 1].date_bsb).getDate();

			//Total distance
			if (!_odostart) {
				_odostart = Number(trip[i].odometer);
				_odofinish = _odostart;
			}

			// Speed Ranges
			if (_speed <= 30) {
				_speed0 += _time2;
			}
			if (30 < _speed && _speed <= 60) {
				_speed30 += _time2;
			}
			if (60 < _speed && _speed <= 90) {
				_speed60 += _time2;
			}
			if (90 < _speed && _speed <= 120) {
				_speed90 += _time2;
			}
			if (120 < _speed) {
				_speed120 += _time2;
			}


			_odofinish = Math.max(_odofinish, Number(trip[i].odometer))		
			_distance_total = _odofinish - _odostart;

		}

		if (i == trip.length - 1) {
			var _latlngfinish = { ...node };
			var _latlngheading = Number(trip[i].heading);
			var _EVENT01_TRIP_TYPE = trip[i]["EVENT01_TRIP_TYPE"];
			var _EVENT16_SUMMARY = trip[i]["EVENT16_SUMMARY"];
			var _ignition = trip[i].ignition;

			if (_EVENT01_TRIP_TYPE == 'RUN' && _ignition == 1) {
				_EVENT01_TRIP_TYPE == 'OFF'
			}
		}

		//harsh behavior
		var ttype = "hb" + event_type + type_id;
		var check_dpa = _hbselected.indexOf(ttype) > -1;
		//console.log(check_dpa,type_id,ttype)
		if (check_dpa) {
			if (_hb[ttype]) {
				_hb[ttype].push(trip[i].id)
			} else {
				_hb[ttype] = [trip[i].id]
			}
		}

		//Distance literal
		// Current trip total distance
		var _ddunit = _M2G.user_setup.units.distance;
		var _distance_str = (_distance_total / 1000).toFixed(2) + " " + _ddunit;
		if (_distance_str > 0) { _distance_str += "s" }
		
		// Speed
		if (trip[i].speed > _max) {
			_max = trip[i].speed;
			speedlat = node.lat;
			speedlng = node.lng;
		};
		var _maxspeedlatlng = { lat: speedlat, lng: speedlng };


		// Altitude
		if (Number(trip[i].altitude) > _elmax) {
			_elmax = Number(trip[i].altitude);
			var _elmaxlatlng = { ...node };
		}

		if (Number(trip[i].altitude) < _elmin) {
			_elmin = Number(trip[i].altitude);
			var _elminlatlng = { ...node };
		}

		// Day Range
		var _ddtrip = new Date(trip[i].date_bsb);
		var _triphour = _ddtrip.getHours();
		var _tripminute = _ddtrip.getMinutes();
		var _tripsecond = _ddtrip.getSeconds();
		var _ddhours = _triphour * 3600 + _tripminute * 60 + _tripsecond;

		var checkday = _ddhours > _dayperiod_day && _ddhours <= _dayperiod_night;
		var checknight = _ddhours > _dayperiod_night && _ddhours <= _dayperiod_critical;

		var checkcritical = !checkday && !checknight;

		if (checkday && i > 0) {
			_daydistance += _distance
			_dayduration += _time;
		}
		if (checknight && i > 0) {
			_nightdistance += _distance
			_nightduration += _time;
		}
		if (checkcritical && i > 0) {
			_criticaldistance += _distance
			_criticalduration += _time;
		}

	}

	// Veloc. Média
	var _vaverage = ((_distance_total * 3600) / _time_total) / 1000; //km/h

	// Perfil de Viagem
	var _perfil = m2r_getTripProfile(_distance_total, _vaverage);

	// Trip Category
	var _trip120 = _move > 2 * 3600; // Tela Amarela
	var _trip150 = _move > 2.5 * 3600; // trip2h
	var _trip180 = _move > 3 * 3600; // trip3h
	var _trip_category = "trip00"
	if (_trip120) {
		_trip_category = "trip120"
	}
	if (_trip150) {
		_trip_category = "trip150"
	}
	if (_trip180) {
		_trip_category = "trip150"
	}

	//Use of Pedal
	if (_hb["hbDPA10"] ) {
		//console.log(_hb.hbDPA10.length, _distance_total)
		if (_hb.hbDPA10.length && _distance_total) {
			var _pedal_dd = _hb["hbDPA10"].length / (_distance_total/1000);
		} else {
			_pedal_dd = 0;
		}

	}

	// Distances rates:
	var _distance_range = _daydistance + _nightdistance + _criticaldistance || 1;
	var _duration_range = _dayduration + _nightduration + _criticalduration || 1;


	var tripRow = {
		bounds_NE: _NE,
		bounds_SW: _SW,
		details_distance: _distance_total,
		details_distance_str: _distance_str,
		details_driver: _template.driver.id,
		details_duration: _time_total,
		details_duration_str: m2r_getTimeFromTimeStamp(_time_total),

		details_ignition: _ignition,
		details_operator: _template.operator.name,
		details_pedal_dd: _pedal_dd,
		details_profile: _perfil,
	
		details_status: _EVENT01_TRIP_TYPE,
		details_time_begin: _ddstartlocal,
		details_time_finish: _ddendlocal,
		details_trip120: _move > 2 * 3600, // Tela Amarela
		details_trip150: _move > 2.5 * 3600, // trip2h
		details_trip180: _move > 3 * 3600, // trip3h
		details_trip_category: _trip_category,
		details_vaverage: _vaverage,
		details_vehicle: _template.vehicle.id,
	
		date_start: _ddstart,
		date_finish: _ddend,
		date_duration: _time_total,

		date_local_begin: _ddstartlocal,
		date_local_finish: _ddendlocal,
		date_local_time_ini: _time_ini,
		date_local_time_end: _time_end,
		date_local_time_total: _time_total,
		date_local_newday: _newday,
		date_local_shortbegin: _ddstartlocalshort,

		device_imei: _device_imei,

		distance_total: _distance_total,
		distance_fromstart: _odostart,
		distance_toend: _odofinish,
		elevation_minelevation: _elmin,
		elevation_minlatlng: _elminlatlng,
		elevation_maxelevation: _elmax,
		elevation_maxlatlng: _elmaxlatlng,
		elevation_ascention: Math.abs(_elmax - _elmin),
		elevation_elstart: _elstart,
		elevation_elfinish: _elfinish,
		elevation_eldiff: _eldiff,
		harsh_behavior: _hb,
		id_start: _idstart,
		id_finish: _idend,
		ignition: _ignition,
		latlngstart: _latlngstart,
		latlngfinish: _latlngfinish,
		latlngheading: _latlngheading,
		speedlimits_maxexceeded: 0,

		speed_maxrecorded: _max,
		speed_maxrecordedlatlng: _maxspeedlatlng,
		speed_average: _distance_total / _time_total,
		speed_unit: _speedUnit,

		speedranges_speed0: (_speed0 / _time_total) * 100 || 0,
		speedranges_speed30: (_speed30 / _time_total) * 100 || 0,
		speedranges_speed60: (_speed60 / _time_total) * 100 || 0,
		speedranges_speed90: (_speed90 / _time_total) * 100 || 0,
		speedranges_speed120: (_speed120 / _time_total) * 100 || 0,

		shortstops: [],
		summary: _EVENT16_SUMMARY,

		time_total: _time_total,
		time_idle: _idle,
		time_move: _move,

		time_range_day_distance: _daydistance,
		time_range_day_duration: _dayduration,
		time_range_day_distance_rate: _daydistance / _distance_range,
		time_range_day_duration_rate: _dayduration / _duration_range,
		time_range_day_rate: _daydistance / _distance_range > 0,

		time_range_night_distance: _nightdistance,
		time_range_night_duration: _nightduration,
		time_range_night_distance_rate: _nightdistance / _distance_range,
		time_range_night_duration_rate: _nightduration / _duration_range,
		time_range_night_rate: _nightdistance / _distance_range > 0,

		time_range_critical_distance: _criticaldistance,
		time_range_critical_duration: _criticalduration,
		time_range_critical_distance_rate: _criticaldistance / _distance_range,
		time_range_critical_duration_rate: _criticalduration / _duration_range,
		time_range_critical_rate: _criticaldistance / _distance_range > 0,

		trip_nr: _trip_nr,
		trip_nr_m2: _trip_nr_m2,
		trip_type: _EVENT01_TRIP_TYPE,

	};

	var tripDetails = {
		bounds: { NE: _NE, SW: _SW },

		details: {
			distance: _distance_total,
			distance_str: _distance_str,
			driver: _template.driver.id,
			duration: _time_total,
			duration_str: m2r_getTimeFromTimeStamp(_time_total),
			duration_idle: _idle, //m2r_getTimeFromTimeStamp(_idle),
			vaverage: _vaverage,
			operator: _template.operator.name,
			profile: _perfil,
			ignition: _ignition,
			status: _EVENT01_TRIP_TYPE,
			time_begin: _ddstartlocal,
			time_finish: _ddendlocal,
			trip120: _move > 2 * 3600, // Tela Amarela
			trip150: _move > 2.5 * 3600, // trip2h
			trip180: _move > 3 * 3600, // trip3h
			trip_category: _trip_category,
			pedal_dd: _pedal_dd,
			vehicle: _template.vehicle.id,
		},

		date: { start: _ddstart, finish: _ddend, duration: _time_total },
		// date_utc: { begin: _ddstartutc, finish: _ddendutc },
		date_local: {
			begin: _ddstartlocal,
			finish: _ddendlocal,
			time_ini: _time_ini,
			time_end: _time_end,
			time_total: _time_total,
			newday: _newday,
			shortbegin: _ddstartlocalshort,
		},
		device_imei: _device_imei,
		distance: {
			total: _distance_total,
			fromstart: _odostart,
			toend: _odofinish
		},
		elevation: {
			minelevation: _elmin,
			minlatlng: _elminlatlng,
			maxelevation: _elmax,
			maxlatlng: _elmaxlatlng,
			ascention: Math.abs(_elmax - _elmin),
			elstart: _elstart,
			elfinish: _elfinish,
			eldiff: _eldiff
		},

		harsh_behavior: _hb,

		id: { start: _idstart, finish: _idend },
		ignition: _ignition,

		latlngstart: _latlngstart,
		latlngfinish: _latlngfinish,
		latlngheading: _latlngheading,

		speedlimits: [{ maxlimit: null, maxexceeded: null, maxrecorded: null, maxrecordedlatlng: null }],

		speed: {
			maxrecorded: _max,
			maxrecordedlatlng: _maxspeedlatlng,
			average: _distance_total / _time_total,
			unit: _speedUnit,
		},
		speedranges: {
			speed0: (_speed0 / _time_total) * 100 || 0,
			speed30: (_speed30 / _time_total) * 100 || 0,
			speed60: (_speed60 / _time_total) * 100 || 0,
			speed90: (_speed90 / _time_total) * 100 || 0,
			speed120: (_speed120 / _time_total) * 100 || 0,
		},
		shortstops: [],
		summary: _EVENT16_SUMMARY,

		time: { total: _time_total, idle: _idle, move: _move },
		time_range: {
			day: {
				distance: _daydistance,
				duration: _dayduration,
				distance_rate: _daydistance / _distance_range,
				duration_rate: _dayduration / _duration_range,
				rate: _daydistance / _distance_range>0
			},
			night: {
				distance: _nightdistance,
				duration: _nightduration,
				distance_rate: _nightdistance / _distance_range,
				duration_rate: _nightduration / _duration_range,
				rate: _nightdistance / _distance_range>0
			},
			critical: {
				distance: _criticaldistance,
				duration: _criticalduration,
				distance_rate: _criticaldistance / _distance_range,
				duration_rate: _criticalduration / _duration_range,
				rate: _criticaldistance / _distance_range>0
			},
		},
		trip_nr: _trip_nr,
		trip_nr_m2: _trip_nr_m2,
		trip_type:_EVENT01_TRIP_TYPE,
	}

	return [tripDetails, tripRow];
}

function m2r_getTripProfile(_distance_total, _vaverage) {
	var profile = "-";
	var tz = _M2G.user_setup.TrafficZones;
	var tl = tz.length;

	for (var i = 0; i < tl; i++) {
		var p = tz[i];
		var checkD = p.Dmin <= _distance_total && _distance_total < p.Dmax;

		var checkAvg = p.Vavgmin < _vaverage && _vaverage < p.Vavgmax;

		if (checkD && checkAvg) {
			profile = p.id;
			break;
		}
	}
	return profile;
}

function m2r_buildTripPaths(trip) {
	var _path = [];
	var pl = trip.length;

	for (var i = 0; i < pl; i++) {
		var event_type = trip[i].event_type;
		if (event_type != "GTIGF2") { // handle log error type
			var lat = trip[i].lat;
			var lng = trip[i].lng;
		} else { // invert
			lat = trip[i].lng;
			lng = trip[i].lat;
		}
		var latlng = { "lat": Number(lat), "lng": Number(lng) };
		_path.push(latlng)
	}
	return _path;
}


function m2r_setSelectedDevice(device) {

	if (device) {
		_M2G.device_selected = [device];
	}

	var selected = _M2G.device_selected;

	var o = Object.keys(_M2G.rendered_vehicles)
	//console.log(selected, o)

	for (const i in o) {
		var v = o[i];
		var did = v + "-label";
		var check = selected.indexOf(v) > -1;

		if (check) {
			_(did).classList.add("btn-info");
			_(did).classList.remove("btn-outline-info");
		} else {
			_(did).classList.remove("btn-info");
			_(did).classList.add("btn-outline-info");
		}
	}
}



function m2r_setSelectedOption(device) {
	var _selected = _M2G.device_selected[0];
	//console.log(_selected, device);

	if (_selected) {
		m2r_setShapeZindex(_selected, device)
	}

	// set selected button
	m2r_setSelectedDevice(device)

	//center map
	m2r_centerDevice(device, 15)

	m2r_uix_buildTripMenu(device)

	// set selected vehicle marker
	m2r_map_setVehicleMarker();
}

