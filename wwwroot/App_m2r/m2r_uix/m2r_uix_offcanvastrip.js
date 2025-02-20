/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file populates offcanvas trip
 * for MAP2REAL MVP REV2024.01
 *
 * @summary fetch and populate offcanvas trip
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-07-16 00:00:00 
 * Revision         : 01/   2024-07-16
 * Last modified    : 2024-07-16 11:00:00
 * 
 */


async function m2r_uix_fetchOffcanvasTrip(trip) {
    // path
    var uri = _M2G.fetch_uri;
    var prefix = uri.prefix; //m2r_uix_

    // offcanvas div id
    var _offcanvas_trip = uri.files.offcanvas_trip;
    var suffix = uri.suffix; // .html

    var file = prefix + _offcanvas_trip;
    var response = await m2r_fetchHTML(file + suffix);
    m2r_uix_displayOffcanvasTrip(trip, response, file);
    var coll = _cn("m2r_trip_close");
    var _pathid = trip.id + "-" + trip.trip_nr;
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function () {     
            _M2G.rendered_shapes[_pathid]["selected"] = false;
			m2r_map_highlightPath(_pathid, false);
        })
	}

	//Printer button
	_(_m2r_trip_printer).addEventListener('click', function () {
		m2r_report_buildHTMLReports(_pathid, 'trip_report');
	});

}

function m2r_uix_displayOffcanvasTrip(trip, text, elid) {
	// Trip Sumary && Details
	console.log(trip);

	// Trip Events
	var tripEvents = _M2G.rendered_trips[trip.id][trip.trip_nr];


	// header details
	var _app_locale = _M2G.locale.app_locale;
	var details = trip.details;
	var textItem = text.replaceAll("{{trip.trip_nr}}", trip.trip_nr_m2);
	textItem = textItem.replaceAll("{{trip.vehicle.make}}", trip.vehicle.make);
	textItem = textItem.replaceAll("{{trip.vehicle.plate}}", trip.vehicle.plate);
	textItem = textItem.replaceAll("{{trip.id}}", trip.id);
	textItem = textItem.replaceAll("{{details.time_begin}}", new Date(details.time_begin).toLocaleString(_app_locale));
	textItem = textItem.replaceAll("{{trip.triptt}}", trip.triptt);
	textItem = textItem.replaceAll("{{details.time_finish}}", new Date(details.time_finish).toLocaleString(_app_locale));
	
	textItem = textItem.replaceAll("{{trip.distance_str}}", trip.distance_str);

	_(elid).innerHTML = textItem;

	// Chart
	var chart = m2r_uix_getOffCanvasChart(tripEvents);

	// Events Timeline
	var eventList = m2r_uix_getOffCanvasTimeline(tripEvents);
	_(_m2r_uix_timeline).innerHTML = "";
	_(_m2r_uix_timeline).appendChild(eventList);
}

function m2r_uix_getOffCanvasTimeline(tripEvents) {
	var events = tripEvents.events;
	console.log(events);
	var _total_distance = 0;
	var _ul = document.createElement("ul");
	_ul.className = "timeline";
	var _ddunit = _M2G.user_setup.units.distance;

	for (const event of events) {
		var date = new Date(event.date_bsb).toLocaleTimeString()
		_total_distance += event.diff_distance;

		// Current trip total distance literal
		var _distance_str = _total_distance / 1000 + " " + _ddunit;
		if (_distance_str > 0) { _distance_str += "s" }

		//console.log(event.EVENT16_SUMMARY, date, event.diff_distance, _total_distance, event.trip_nr_m2);
		var summary = event.EVENT16_SUMMARY;
		if (summary) {
			var event_now = summary[1];
			summary = summary[0];
			var summaryClass = "";
		} else {
			event_now = "";

			summary = _M2G.trip_setup.status.run;
			summaryClass = _M2G.trip_setup.class.run;
		}


		var _li = document.createElement("li");
		var _li_str = `<a href="#" class="${summaryClass}">${summary}</a>
                       <a href="#" class="float-end">${date}</a>
						<p>
							Evento: ${event_now}<br/>
							Velocidade: ${event.speed}<br/>
                            DTot Percorrida: ${_distance_str}<br />
                            TTot de viagem: ${event.diff_time_sum_str}
						</p>
						`;
		_li.innerHTML = _li_str;
		_ul.appendChild(_li)
	}
	return _ul
}

function m2r_uix_getOffCanvasChart(tripEvents) {
	//console.log(tripEvents);

	//var duration = tripEvents.details.date.duration;
	var duration = tripEvents.events.length;
	var _time = [];
	var _speed = [];
	var _label = [];
	var _categories = [];
	var _dataset = []

	var _hb = tripEvents.details.harsh_behavior;
	var _labels = {};
	var o = Object.keys(_hb);
	var ol = o.length;
	// console.log(ol,o);
	for (var j = 0; j < ol; j++) {
		_labels[o[j]] = [];
	}

	for (var i = 0; i < duration; i++) {
		var events = tripEvents.events[i];
		_time.push(events.diff_time_sum);
		_speed.push(events.speed);

		var type_id = events.type_id;
		var event_type = events.event_type;
		var eid = events.id;

		var eid = "hb" + event_type + type_id;
		var _exclude = ["hbGTERI10", "hbDPA10", "hbGTFRI10"]
		var check_excl = _exclude.indexOf(eid) > -1;
		if (check_excl) {
			var hbLabel = "";
		} else {
			console.log(eid, type_id, type_id != 10, hbLabel)
			hbLabel = _M2G.event_types[eid].ini;
		
		}
		_label.push(hbLabel);
		var ds = { AxeX: hbLabel, AxeY: events.speed };
		_dataset.push(ds);

		for (var k = 0; k < ol; k++) {
			var hbLabels = 0;
			if (o[k] == eid) {
				hbLabels = events.speed;
			}
			_labels[o[k]].push(hbLabels);
		}
	}

	//console.log(o);
	for (var l = 0; l < ol; l++) {
		var _pointstyle = "circle";
		var _pointradius = 10;
		if (o[l] == 'hb0' || o[l] == 'hb10') {
			_pointstyle = null;
			_pointradius = null;
		}

		var cat =
		{
			label: o[l],
			fill: false,
			backgroundColor: "transparent",
			borderColor: "transparent",
			//borderDash: [1, 1],
			data: _labels[o[l]],
			pointStyle: _pointstyle,
			pointRadius: _pointradius,
			pointHoverRadius: 15
		}
		_categories.push(cat);
	}

	var chart = {
		time: _time, speed: _speed, label: _label, hb: { ..._hb }, labels: _labels, categories: _categories, dataset: _dataset
	}

	//console.log(chart)
	var _data = {
		labels: chart.label, // ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
		datasets: [{
			label: "Velocidade",
			fill: true,
			backgroundColor: "transparent",
			borderColor: window.theme.primary,
			data: chart.speed, //[0, 15, 60, 70, 90, 88, 60, 79, 98, 90, 87, 67]
		}]
	};

	//var _data = {
	//	datasets: [{
	//		label: "Velocidade",
	//		fill: true,
	//		backgroundColor: "#d9d9d9",
	//		borderColor: window.theme.primary,
	//		data: chart.dataset
	//	}]
	//}

	for (var j = 0; j < chart.categories.length; j++) {
		_data.datasets.push(chart.categories[j])
	}


	// Line chart
	new Chart(document.getElementById("chartjs-line"), {
		type: "line",
		data: _data,
		options: {
			maintainAspectRatio: false,
			legend: {
				display: true
			},
			tooltips: {
				intersect: false
			},
			hover: {
				intersect: true
			},
			plugins: {
				filler: {
					propagate: false
				}
			},
			//parsing: {
			//	xAxisKey: 'AxeX',
			//	yAxisKey: 'AxeY'
			//},
			scales: {
				//scales: {
				//	x: {
				//		display: true,
				//	},
				//},
				xAxes: [{
					//reverse: true,
					display: true,
					gridLines: {
						color: "rgba(0,0,0,0.05)"
					},
					//alignToPixels: true,
					//offsetAfterAutoskip: true,
					offset: true,
					ticks: {
						autoSkip: false
					},
				}],
				yAxes: [{
					ticks: {
						stepSize: 20
					},
					display: true,
					borderDash: [5, 5],
					gridLines: {
						color: "rgba(0,0,0,0)",
						fontColor: "#fff"
					}
				}]
			}
		}
	});

	return chart;
}