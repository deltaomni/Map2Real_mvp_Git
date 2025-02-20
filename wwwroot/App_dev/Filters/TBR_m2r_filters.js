
//var _M2G = {
//	"device_default": null,
//	"device_imei": [

//	], 
//	"device_selected": [],
//	"filters_selected": {
//		users: [],
//		user_selected: null,
//		vehicles: [],
//		vehicles_selected: null,
//		operator: [],
//		operator_selected: null,
//	},
//	"user_selected": null,
//	"vehicle_selected": null,

//}

//function start() {

//	console.log(_M2G);
//	console.log(_devices_templates);
//	m2r_trips_set_filters()
//	m2r_trips_filters_flatten()
//}

//function m2r_trips_set_filters() {
//	// 1. date range
//	// 2. operator (Customer)
//	// 3. device/ vehicle
//	// 4. driver
//	// 5. time range
//	// 6. Z1 - Z5
//	// 7. day/night/critical
//	// 6. trips
//	// 7. events

//}

function m2r_trips_set_filters_date_range() {


}

function change_get(e) {
	console.log(e);
}

function m2r_trips_details_filters_flatten(obj) {
	//console.log(JSON.stringify(obj))
	return false;
	//var obj = [..._devices_templates];
	var array = []
	var headers = [];
	var item =[]
	const flattenJSON = (obj = {}, res = {}, extraKey = '') => {

		for (key in obj) {
			if (isNaN(Number(key))) {
				if (typeof obj[key] !== 'object') {
					item.push(obj[key])
					if (extraKey.split('.')[0] == '0') {
						var head = extraKey + key + ".";
						head = head.split('.');
						head.pop();
						head.shift();
						head = head.join(".");
						headers.push(head);
					}
				}
			} else {

				array.push(item);
				item = [];
			}
			if (typeof obj[key] !== 'object'  ) {

				res[extraKey + key] = obj[key];
			
			} else {
				flattenJSON(obj[key], res, `${extraKey}${key}.`);
			};
		};
		
	
		return res;
	};
	console.log(flattenJSON(obj));
	//console.log(item)
	array.shift();
	console.log(headers)
	array.unshift(headers);
	console.log(array)
	
}