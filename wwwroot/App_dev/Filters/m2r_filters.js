// 1. date range
// 2. operator (Customer)
// 3. device/ vehicle
// 4. driver
// 5. time range
// 6. Z1 - Z5
// 7. day/night/critical
// 6. trips
// 7. events

var _M2G = {
	"device_default": null,
	"device_imei": [

	],
	"device_selected": [],
	"filters_defaults": {
		//date_local_begin: null,
		//date_local_finish: null,
		//date_local_time_end: null,
		//date_local_time_ini: null,
		date_range: ['today'],
		//details_driver: ['all'],
		details_operator: ['UNIVAR'],
		details_profile: ['all'],
		device_imei: ['all'],
		harsh_behavior: ['all'],
		time_range: ['all'],
		trip_category: ['all'], 
	},
	"filters_selected": {
		//users: [],
		//user_selected: null,
		//vehicles: [],
		//vehicles_selected: null,
		//operator: [],
		//operator_selected: null,
	},
	"user_selected": null,
	"vehicle_selected": null,

}

function start() {

	m2r_filters_set_operator()

	document.getElementById("m2r_filter_form").addEventListener('change', m2r_trips_filters_get_change);

	var coll = document.getElementsByClassName("m2r_filter_options")
	for (var i = 0; i < coll.length; i++) {
		coll[i].addEventListener('click', m2r_trips_filter_option);	
	}

	m2r_start_module();

}

function m2r_start_module() {
	m2r_trips_clear_filters();
	m2r_trips_filter_reset();

	//set date range option
	var value = _M2G.filters_defaults.date_range[0];
	m2r_trips_set_date_filters(value);
}

function m2r_trips_filters_get_change(e) {

	//console.log(e)
	var id = e.target.id;
	var checked = e.target.checked;
	var value = e.target.value;
	var name = e.target.name;

	console.log(id, checked, value);

	var data = e.target.getAttribute("m2r_data");
	console.log(data);

	if (data == 'details_operator') {
		m2r_filters_enable_filters(value, 'dev_filter'); // enable/ disable devices.
		m2r_filters_enable_filters(value, 'op_filter') // enable/ disable operator.
	}

	var id = e.target.id.split('-')[2];
	//console.log(id);

	var filters = m2r_filters_get_filter_list();
	//console.log(filters);

	if (value == 'all') {
		console.log(scope, name);
		var scope = filters[name]
		m2r_filter_check_all_options(scope, checked)

	}

	if (data == 'm2r_range') {
		m2r_trips_clear_filters("date_range", null); // clear selected options for date range
	}

	if (data == 'date_range') {
		var value = e.target.value;
		m2r_trips_set_date_filters(value); // set selected options for date range
	}


	// console.log(m2r_filters_get_filter_list());
	var selected = m2r_filters_get_selected_values();
	_M2G.filters_selected = selected;
	console.log(_M2G.filters_selected);

}

function m2r_trips_set_date_filters(value) {

	//console.log(elmt);

	//console.log(value)
	var filters = m2r_filters_get_filter_list();
	//	console.log(filters[name].options);

	var date_local_begin = filters['date_local_begin'].options;
	var date_local_finish = filters['date_local_finish'].options;
	var date_local_time_ini = filters['date_local_time_ini'].options;
	var date_local_time_end = filters['date_local_time_end'].options;
	var date_start = filters['date_start'].options;
	var date_finish = filters['date_finish'].options;

	//	console.log(date_local_begin, date_local_finish, date_local_time_ini, date_local_time_end)
	var today = new Date();
	var today_unix = parseInt((today.getTime() / 1000).toFixed(0));

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var tomorow_unix = parseInt((tomorrow.getTime() / 1000).toFixed(0));

	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var yesterday_unix = parseInt((yesterday.getTime() / 1000).toFixed(0));

	var last7dd = new Date();
	last7dd.setDate(last7dd.getDate() - 7);
	var last7dd_unix = parseInt((last7dd.getTime() / 1000).toFixed(0));

	var last30dd = new Date();
	last30dd.setDate(last30dd.getDate() - 30);
	var last30dd_unix = parseInt((last30dd.getTime() / 1000).toFixed(0));

	var mo = new Date().getMonth() + 1;
	var yr = new Date().getFullYear();

	var _today = today.toLocaleDateString();
	_today = m2r_format_date(_today);
	date_local_finish[0].el.value = _today;

	switch (value) {
		case 'today':
			//console.log('this is ', 'today');

			date_local_begin[0].el.value = _today;

			date_start[0].el.value = today_unix - 3 * 3600;
			date_finish[0].el.value = tomorow_unix - 3 * 3600;
			break;
		case 'yesterday':
			var _yesterday = yesterday.toLocaleDateString();
			_yesterday = m2r_format_date(_yesterday);
			date_local_begin[0].el.value = _yesterday;
			date_local_finish[0].el.value = _yesterday;

			date_start[0].el.value = yesterday_unix - 3 * 3600;
			date_finish[0].el.value = today_unix - 3 * 3600;

			console.log('this is ', 'yesterday')
			break;
		case 'last7dd':
			var _last7dd = last7dd.toLocaleDateString();
			_last7dd = m2r_format_date(_last7dd);
			date_local_begin[0].el.value = _last7dd;

			date_start[0].el.value = last7dd_unix - 3 * 3600;
			date_finish[0].el.value = tomorow_unix - 3 * 3600;

			console.log('this is ', 'last7dd')
			break;
		case 'thisMo':
			var thisMoDate = new Date(yr + "-" + mo + "-1");
			thisMoDate = thisMoDate.toLocaleDateString();

			var thisMoDate_unix = parseInt((last30dd.getTime() / 1000).toFixed(0));
			date_start[0].el.value = thisMoDate_unix - 3 * 3600;
			date_finish[0].el.value = tomorow_unix - 3 * 3600;
			console.log('this is ', 'thisMo')
			break;
		case 'last30dd':
			var _last30dd = last30dd.toLocaleDateString();
			_last30dd = m2r_format_date(_last30dd);
			date_local_begin[0].el.value = _last30dd;


			date_start[0].el.value = last30dd_unix - 3 * 3600;
			date_finish[0].el.value = tomorow_unix - 3 * 3600;

			console.log('this is ', 'last30dd')
			break;
		//case 'thisYr':
		//	console.log('this is ', 'thisYr')
		//	break;
		//case 'last12Mo':
		//	console.log('this is ', 'last12Mo')
		//	break;
		default:
			break;
	}
}

function m2r_format_date(dateStr) {
	var date = dateStr.split('/');
	date = [date[2], date[0].padStart(2, '0'), date[1].padStart(2, '0')].join('-');
	console.log(date, dateStr);
	return date;
}

function m2r_trips_clear_filters(nametoclear, valuetoclear) {

	// console.log(nametoclear, valuetoclear);
	var coll = document.getElementsByClassName('m2r_filter');
	//console.log(coll);
	for (var i = 0; i < coll.length; i++) {
		var data = coll[i].getAttribute("m2r_data");
		var id = coll[i].id;
		var name = coll[i].name;
		var value = coll[i].value;
		var checked = coll[i].checked;
		//console.log(id,data,name,value,checked)
		var checkDate = name == 'date_local_begin' || name == 'date_local_finish';
		var checkTime = name == 'date_local_time_ini' || name == 'date_local_time_end';
		var checkUnix = name == 'date_start' || name == 'date_finish';

		if (nametoclear == name && valuetoclear == value) {
			coll[i].checked = false;
		}
		if (nametoclear == name && valuetoclear == null) {
			coll[i].checked = false;
		}

		if (!nametoclear && !valuetoclear) {
			if (checkDate || checkTime || checkUnix ) { // exclude date range and time range
				coll[i].value = '';
			} else {
				coll[i].checked = false;
			}
		}
	}
}

function m2r_trips_filter_reset() {

	var _default = _M2G.filters_defaults;
	var filters = m2r_filters_get_filter_list();

	var o = Object.keys(_default);
	for (var i = 0; i < o.length; i++) {
		var key = _default[o[i]]
		if (key) {
			for (var j = 0; j < key.length; j++) {
				var name = o[i];
				var scope = filters[name]
				if (key[j] == 'all') {			
					m2r_filter_check_all_options(scope, true)
				}
				else {
					m2r_filter_check_one_option(scope, key[j])
				}
			}
		}
	}
}

function m2r_trips_filter_option(e) {
	var name = e.target.name;
	console.log(name);
	switch (name) {
		case 'update':
			break;
		case 'clear':
			//m2r_trips_clear_filters();
			//m2r_trips_filter_reset();
			m2r_start_module()
			break;
		default:
			break;
	}
}

function m2r_filters_get_filter_list() {
	var filter_list = {}
	var coll = document.getElementsByClassName('m2r_filter');
	//console.log(coll);
	for (var i = 0; i < coll.length; i++) {
		var data = coll[i].getAttribute("m2r_data");

		var id = coll[i].id;
		var name = coll[i].name;
		var value = coll[i].value;
		//if (!isNaN(Number(value))){ value = Number(value) }
		var checked = coll[i].checked;

		if (name) {
			var item = { id: id, name: name, value: value, checked: checked, el: coll[i] }
			if (filter_list[name]) {

				filter_list[name].options.push(item);
			} else {
				filter_list[name] = {
					values: [],
					options: [ item ]
				}
			}
		}
	//	console.log(data, id, name, value);
	}
	return filter_list;
}


function m2r_filter_check_all_options(scope,checked) {
	for (var i = 0; i < scope.options.length; i++) {
		//if (scope.options[i].value != 'all') {
			scope.options[i].el.checked = checked;
		//}
	}
}

function m2r_filter_check_one_option(scope, option) {
	for (var i = 0; i < scope.options.length; i++) {
		if (scope.options[i].value == option) {
			scope.options[i].el.checked = true;
		}
	}
}

function m2r_filters_get_selected_values() {

	var filters = m2r_filters_get_filter_list();
	var o = Object.keys(filters);
	//console.log(o)
	var selected = {}
	for (var i = 0; i < o.length; i++) {
		var key = o[i];
		var options = filters[key].options
		//console.log(options.length, options)
		for (var k = 0; k < options.length; k++) {
			//console.log(options[k]);
			if (options[k].value != 'all') {
				var cl = options[k].el.getAttribute('disabled');
				//console.log(options[k].value,cl, cl==null)
				if (selected[key]) {
					if (options[k].checked == true && cl == null) {
					
						selected[key].push(options[k].value)
					}
				} else {
					if (options[k].checked == true && cl == null) {
					
						selected[key] = [options[k].value]
					} else {
						selected[key] = []
					}
				}


			}
		}
	}

	//console.log(filters);
	//console.log(selected);
	return selected;
}

//function m2r_trips_date_range_select(elmt) {
//	var name = elmt.name;
//	var value = elmt.value;
//	console.log(name, value);
//}

function m2r_filters_update() {
	var coll = document.getElementsByClassName('m2r_filter');
	//console.log(coll);

	var filters = {};
	for (var i = 0; i < coll.length; i++) {
		if (coll[i].labels[0]) {
			var label = coll[i].labels[0].innerText
		} else {
			label = null
		}
		var collArr = coll[i].id.split("-");
		filters[coll[i].id] = [collArr[1], coll[i].checked, coll[i].value, label, coll[i]];
	}
	return filters;
}

function m2r_filters_set_operator() {

	var html = '';
	var _tp = _devices_templates;
	var ops = [];

	for (var i = 0; i < _tp.length; i++) {
		var op = _tp[i].operator;
		//console.log(op.name);

		var check = ops.includes(op.name);
		if (!check) {
			ops.push(op.name);
		}
	}

	//console.log(ops);
	// build [ops]
	for (var j = 0; j < ops.length; j++) {
		var operator = ops[j];
		var opid = j + 1;
		var str = `<input type="radio" m2r_data="details_operator" value="${operator}" class="btn-check m2r_filter" name="details_operator" id="option-1-${opid}" autocomplete="off">
				<label class="btn btn-outline-primary p-0 px-1 m-0 rounded-1" for="option-1-${opid}" style="font-size:11px;">
					<strong>${operator}</strong>
				</label>`;
		html = html + str;
		//console.log(html);
	}
	document.getElementById('m2r_filter_operator').innerHTML = html;

}

function m2r_filters_enable_filters(operator, filter_class) {
	var coll = document.getElementsByClassName(filter_class);
	var c = 'op_' + operator;
	// console.log(c)
	for (var i = 0; i < coll.length; i++) {
		//var dis = coll[i].getAttribute('disabled');

		var check = coll[i].classList.contains(c);
		// console.log(coll[i].value, check);

		if (check) {
			coll[i].removeAttribute('disabled');
		} else {
			coll[i].setAttribute('disabled','');
		}
	}
}


//function m2r_trips_filters_flatten(obj) {
//	var obj = details;
//	var array = []
//	var headers = [];
//	var item =[]
//	const flattenJSON = (obj = {}, res = {}, extraKey = '') => {

//		for (key in obj) {
//			if (isNaN(Number(key))) {
//			//	if (typeof obj[key] !== 'object') {
//					item.push(obj[key])
//					if (extraKey.split('.')[0] == '0') {
//						var head = extraKey + key + ".";
//						head = head.split('.');
//						head.pop();
//						head.shift();
//						head = head.join(".");
//						headers.push(head);
//					}
//				//}
//			} else {

//				array.push(item);
//				item = [];
//			}
//			if (typeof obj[key] !== 'object') {
//				res[extraKey + key] = obj[key];
			
//			} else {
//				flattenJSON(obj[key], res, `${extraKey}${key}.`);
//			};
//		};
		
	
//		return res;
//	};
//	console.log(flattenJSON(obj));
//	//console.log(item)
//	array.shift();
//	//console.log(headers)
//	array.unshift(headers);
//	//console.log(array)
	
//}

