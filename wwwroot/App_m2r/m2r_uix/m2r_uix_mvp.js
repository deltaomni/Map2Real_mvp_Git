/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file starts user UIX
 * for MAP2REAL MVP REV2024.01
 *
 * @summary starts user UIX
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-05-14 00:00:00 
 * Revision         : 01/   2024-05-14  
 * Last modified    : 2024-05-14 11:00:00
 * 
 */

var _m2r_device_selection = "m2r_device_selection";
var _m2r_selection_button = "<label id={{id}} class='btn btn-outline-info m2r-device'>{{device}}</label>";
var _m2r_menu_trips_list = "m2r_menu_trips_list";
var _m2r_menu_trips_header = "m2r_menu_trips_header"; // trip menu heder - Driver + current Trip
var _m2r_menu_drivers = "m2r_menu_drivers"; // menu drivers
var _m2r_uix_timeline = "m2r_uix_timeline"; // offcanvas menu list
var _m2r_trip_printer = "m2r_trip_printer"; // offcanvas trip report
var _m2r_trip_menu_printer = "m2r_trip_menu_printer"; // offcanvas trip menu
var _m2r_trip_txt_download = "m2r_trip_txt_download"; // offcanvas Download Text File

//// date period - offcanvas radio
//var _m2r_date_selection = "m2r_date_selection"; // offcanvas Date selection - radio

function m2r_uix_startPageUIX() {
    console.log("Start UIX:", Date.now().toLocaleString())

    // set events on uix
    m2r_uix_setEvent();

    //Printer button
    _(_m2r_trip_menu_printer).addEventListener('mousedown', function (event) {

        var _pathid = _M2G.device_selected[0]
        m2r_report_buildHTMLReports(_pathid, 'triplist_report');
        //event.preventDefault();
        //event.stopPropagation();

    });

    _(_m2r_trip_txt_download).addEventListener('mousedown', function (event) {

        var _pathid = _M2G.device_selected[0]
        m2r_report_buildHTMLReports(_pathid, 'triplist_download');
        //event.preventDefault();
        //event.stopPropagation();

    });


}

function m2r_uix_setEvent() {
    console.log("Set Range Buttons");
    document.getElementById("m2r_date_from").addEventListener('change',function (event) {
        _M2G.date_start = event.target.value;
        console.log(event.target.value)
});
    document.getElementById("m2r_date_to").addEventListener('change',function (event) {
        _M2G.date_finish = event.target.value;
        console.log(event.target.value)
    });
    document.getElementById("m2r_date_refresh").addEventListener('click',function (event) {
        console.log("refresh");
        m2r_map_clearTripPathShape(); // clear all shapes
        _M2G.rendered_shapes = {};
        m2r_app_start();
    });

//    var coll = _cn("form-control m2r-date m2r_range")
//     console.log(coll)

//    for (var i = 0; i < coll.length; i++) {
//        var el = coll[i];
//        var data = el.getAttribute("m2r_data")
//        switch (data) {
//            case 'from':
//                el.addEventListener("change", (event) => {

//                    _M2G.date_start = event.target.value;
                   
//                    console.log(event.target.value)
//                });

//                break;
//            case 'to':
//                el.addEventListener("change", (event) => {
//                    _M2G.date_finish = event.target.value;
//                    console.log(event.target.value)
//                });
//                break;
//            case 'refresh':
//                el.addEventListener("click", (event) => {
//                    console.log("refresh");
//                    m2r_map_clearTripPathShape(); // clear all shapes
//                    _M2G.rendered_shapes = {};
//                    m2r_app_start();
//                   // console.log(_M2G.rendered_shapes);
//                });
//                break;
//            case '10':
//                break;
//            case '20':
//                break;
//            case '30':
//                break;
//            case '40':
//                break;
//            case '50':
//                break;
//            case '51':
//                break;
//            case '60':
//                break;
//            case '61':
//                break;
//            default:
//                break;
//        }
//    }
}

function m2r_setSelectionButtons() {
    _(_m2r_device_selection).innerHTML = "";
    // var o = Object.keys(_M2G.rendered_vehicles)
    var o = _M2G.device_imei;
    //var div = document.createElement("div");
    var div = _(_m2r_device_selection);

    for (const i in o) {
        var v = o[i];
        var status = _M2G.rendered_vehicles[v]

        //console.log(v, status.trip_type, status.ignition)
        var label = document.createElement("label");
        label.id = v + "-label";
        var classListStr = "btn btn-outline-info m2r-device d-flex flex-fill text-center m-1 ";
        if (status) {
           // console.log(status)
            if (status.ignition == 1) {
                //classListStr += " ";
                classListStr += "border border-5 border-warning border-top-0 border-bottom-0 border-end-0";
            } else {
                classListStr += "border border-5 border-success border-top-0 border-start-0 border-end-0";
            }
        } else {
            //classListStr += "text-dark";
        }
        label.classList = classListStr;
        label.innerHTML = v.substring(v.length - 4);

        div.appendChild(label);
    }

    //_(_m2r_device_selection).appendChild(div);
    m2r_setSelectionButtonsEvents()
}


function m2r_setSelectionButtonsEvents() {

    var coll = _cn("m2r-device")
    // console.log(coll)

    for (var i = 0; i < coll.length; i++) {
        var el = coll[i];

        el.addEventListener("click", function () {
            var device = this.id.split("-")[0];
            if (device == "all") {
                m2r_map_fitMapToBounds();
            } else {         
                //console.log("última viagem:",device,_M2G.rendered_vehicles[device]);
                console.log(device);
                _M2G.device_selected = [device];
                console.log(_M2G.device_selected);
                m2r_setSelectedOption(device);
               // m2r_uix_buildTripMenu(device)
            }
        });

    }
}

async function m2r_uix_buildTripMenu(device) {
    if (!device) {
        device = _M2G.device_selected[0]
    }

    // CURRENT TRIP: Trip Header Details
    var _current_trip = _M2G.rendered_vehicles[device];
    var _trip_details = await m2r_uix_buildTripDetails(_current_trip)

    var _details = m2r_uix_getCurrentTripDetails(_trip_details);
    if (!_details) {
        return false;
    }

   // console.log(_details)


    // CURRENT TRIP: Current Trip Header
    var TripHeader = _(_m2r_menu_trips_header);
    TripHeader.innerHTML = "";
    var headerDiv = m2r_uix_getCurrentTripByDevice(_details).children[0];
    //console.log(headerDiv);
    TripHeader.appendChild(headerDiv);

    // TRIP LIST
    var TripList = _(_m2r_menu_trips_list);
    TripList.innerHTML = "";

    //var TripListDiv = m2r_uix_getTripList(device);
    var TripListDiv = document.createElement("div");
    var trip_list = _M2G.rendered_trips[device];
    // console.log("todas as viagens:", device, trip_list);

    if (trip_list) {
        var o = Object.keys(trip_list);
        // console.log(o)

        for (var i = o.length - 1; i > 0; i--) {
            var key = o[i];
            var trip = trip_list[key];
            var _trip_details = await m2r_uix_buildTripDetails(trip.details);

            var _details = m2r_uix_getCurrentTripDetails(_trip_details);
            //var div = document.createElement("div");
            if (trip.details.summary) {
                itdiv = m2r_uix_getTripItem(_details);
                TripListDiv.appendChild(itdiv);
            }
        }

        TripList.appendChild(TripListDiv);
    }
}

function m2r_uix_buildTripDetails(_current_trip) {
    //console.log(_current_trip);
    if (!_current_trip) {
        return false;
    }
    var device_imei = _current_trip.device_imei
    var _details = _current_trip.details;
    //console.log(_current_trip);
    var _ignition = _details.ignition;
    var _last_date = _current_trip.date.finish;
    var _last_update = Date.now() / 1000 - _last_date; // time elapsed in seconds
    var _newtrip = _M2G.user_setup.time.newtrip;
    var _checkIdle = _ignition == 0 && _last_update / _newtrip > 1;
    var _checkon = _ignition == 1;
    //console.log(_last_update, _last_update/300);
    var _trip_nr = _current_trip.trip_nr;
    var _trip_nr_m2 = _current_trip.trip_nr_m2;
    var _newday = _current_trip.date_local.newday;
    var _shortbegin= _current_trip.date_local.shortbegin;

    // Trip Header - Trip Driver
    var _device_item = _devices_templates.find(item => {
        return item.id == device_imei;
    })
    if (!_device_item) { return false }
    var _device = {..._device_item};

    if (device_imei.length > 4) {
        var id2 = device_imei.substring(0, device_imei.length - 4)
        id2 += " ";
        id2 += device_imei.substring(device_imei.length - 4);
        _device.id2 = id2;
    }

    var _status = _details.status || "IDLE";
   // console.log(_details)
    if ((_status && !_checkIdle) || _checkon) {
        var _translated_status = _M2G.trip_setup.status[_status.toLowerCase()];
        var _class = _M2G.trip_setup.class[_status.toLowerCase()];
    } else {
        var _default = _M2G.trip_setup.status["default"];
        _translated_status = _M2G.trip_setup.status[_default];
        _class = _M2G.trip_setup.class[_default];
        //console.log(_default, _translated_status, _class)
    }
    //console.log(_translated_status)
    _device.status = _translated_status;

    // Harsh Behavior
    var _HB =  m2r_uix_getHarshBehavior(_current_trip)

    _device["hb"] = _HB;
    _device["class"] = _class;
    _device["details"] = _details;
    _device["trip_nr"] = _trip_nr;
    _device["trip_nr_m2"] = _trip_nr_m2;
    _device["newday"] = _newday;
    _device["shortbegin"] = _shortbegin;

   // console.log(_device)
    return _device;
}

function m2r_uix_getCurrentTripByDevice(device) {
    //console.log("ongoing: ", device);
    if (!device) {
        return false;
    }
    var hb_html = m2r_uix_buildHarshBehaviorBadges(device.hb);
    var current_trip = `
    <div id="${device.id}-label" class="btn btn-dark d-flex flex-column ms-2 m-3 p-1 m2r-device ${device.tripclass}"  data-bs-toggle="offcanvas" data-bs-target="#m2r_uix_offcanvas_trip" aria-controls="m2r_uix_offcanvas_trip">
          
    <div class="d-flex flex-fill align-items-center">
                <img src="${device.driver.src}" width="38" height="38" class="m-1 rounded-2" alt="${device.driver.name}">
                <div class="p-1 px-2 flex-grow-1">
                    <h6 class="text-start text-light mb-0">${device.driver.name}</h6>
                    <div class="d-flex justify-content-between text-light">
                        <small>${device.vehicle.make}</small>
                        <small>${device.vehicle.plate}</small>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between ${device.class} w-100 ps-1 pe-2">
                <small>${device.status}</small>
                <small>${device.id2}</small>
            </div>
            <div class="d-flex justify-content-between ${device.class} w-100 ps-1 pe-2">
                <small>Início ${device.tripini}</small>
                <small>${device.triptt}</small>
                <small>${device.distance_str}</small>
            </div>
            ${hb_html}
    </div>`;
    var trip_header = document.createElement("div");
    trip_header.innerHTML = current_trip;

    var _pathid = device.id + "-" + device.trip_nr;

    trip_header.children[0].addEventListener('click', function () {
        m2r_uix_fetchOffcanvasTrip(device);
        m2r_map_fitMaptoPathBounds(device);
        _M2G.rendered_shapes[_pathid]["selected"] = true;
    });

    trip_header.children[0].addEventListener('mouseover', function () {
        m2r_map_highlightPath(_pathid, true)
    });
    trip_header.children[0].addEventListener('mouseout', function () {
        if (_M2G.rendered_shapes[_pathid]["selected"] != true) {
            m2r_map_highlightPath(_pathid, false);
        }
    });

    return trip_header;
}


function m2r_uix_getTripItem(device) {
    // console.log(device)
    var _newday = device.newday;
    var _show_new_day = "d-none";
    if (_newday) {
        _show_new_day = "d-block";
    }
    var shortDate = device.shortbegin;
    var hb_html = m2r_uix_buildHarshBehaviorBadges(device.hb);
    if (device.details.status == "IDLE") {
        var _trip = "ESTACIONADO"
        _trip = `<li class="sidebar-item">
        <div class="${_show_new_day} p-3 py-1 text-end text-info"><strong>${shortDate}</strong></div>
							<div class="d-flex align-items-center p-3 py-1">
								<button type="button" class=" d-flex text-center btn p-0 me-2 justify-content-center align-items-center" style="height:38px;width:38px;">
									<img src="${device.driver.src}" width="30" height="30" class="m-1 rounded-2" alt="${device.driver.src}">
								</button>
								<!--<div class="w-100">-->
									<button type="button" class="w-100 text-info btn btn-dark bg-transparent border-3 border-top-0 border-bottom-0 border-start-0 p-2 m-0" data-bs-toggle="offcanvas" data-bs-target="#m2r_uix_offcanvas_trip" aria-controls="m2r_uix_offcanvas_trip">
										<div class="d-flex justify-content-between">
											<small>Ini: ${device.tripini}</small>
											<small>Estacionado</small>
										</div>
                                        <div class="d-flex justify-content-between">
                                      
                                        <small>${device.triptt}</small>     
                                          <small></small>	
										</div>
									</button>
								<!--</div>-->
							</div>
						</li>`;
    } else {
        _trip = "CONCLUÍDA"
        _trip = `<li class="sidebar-item">
                <div class="${_show_new_day} p-3 py-1 text-end text-info"><strong>${shortDate}</strong></div>
							<div class="d-flex align-items-center p-3 py-1">
                                <div class="d-flex flex-column">
								    <button type="button" class="d-flex  text-center btn p-0 me-2 text-dark justify-content-center align-items-center" style="height:38px;width:38px;">
									    <svg viewBox="0 0 24 24" heigth="38" width="38">
										    <path fill="currentColor" d="M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z" />
									    </svg>
								    </button>
                                <div class="text-center">${device.trip_nr}</div>
                             </div>
									<button type="button" class="w-100 text-light btn btn-dark p-2 m-0" data-bs-toggle="offcanvas" data-bs-target="#m2r_uix_offcanvas_trip" aria-controls="m2r_uix_offcanvas_trip">
										<div class="d-flex justify-content-between text-info">
											<small>Ini: ${device.tripini}</small>
										    <small>Concluída</small>
										</div>
                                        <div class="d-flex justify-content-between text-info">
										    <small>${device.triptt}</small>
											<small>${device.distance_str}</small>
                                            
										</div>
                                        ${hb_html}
									</button>
                </div>
                </li>`;
    }

    var trip_item = document.createElement("div");
    trip_item.innerHTML = _trip;

    var _pathid = device.id + "-" + device.trip_nr;
    trip_item.addEventListener('click', function () {
        m2r_uix_fetchOffcanvasTrip(device);
        m2r_map_fitMaptoPathBounds(device);
        _M2G.rendered_shapes[_pathid]["selected"] = true;
    });

    trip_item.addEventListener('mouseover', function () {
        m2r_map_highlightPath(_pathid, true)
    });
    trip_item.addEventListener('mouseout', function () {
        if (_M2G.rendered_shapes[_pathid]["selected"] != true) {
            m2r_map_highlightPath(_pathid, false);
        }
    });
    return trip_item;
}


function m2r_uix_buildHarshBehaviorBadges(hb) {
    //console.log(hb);
    if (!hb) {
        return false;
    }
    var hb_html = "";
    if (hb.display == "d-block") {
        hb_html = `
        <div class="d-flex flex-column justify-content-end flex-shrink-0 text-info my-1 f-xsmall ${hb.display}">
            <div class="d-flex justify-content-end ${hb.hbDPA46.display}">
                <div class="d-flex pe-2">${hb.hbDPA46.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-info col-2">${hb.hbDPA46.value}</div>
            </div>
            <div class="d-flex justify-content-end ${hb.hbDPA47.display}">
                <div class="d-flex pe-2">${hb.hbDPA47.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-primary col-2">${hb.hbDPA47.value}</div>
            </div>
            <div class="d-flex justify-content-end ${hb.hbDPA48.display}">
                <div class="d-flex pe-2">${hb.hbDPA48.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-warning col-2">${hb.hbDPA48.value}</div>
            </div>
            <div class="d-flex justify-content-end ${hb.hbDPA36.display}">
                <div class="d-flex pe-2">${hb.hbDPA36.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-danger col-2">${hb.hbDPA36.value}</div>
            </div>
            <div class="d-flex justify-content-end ${hb.hbDPA37.display}">
                <div class="d-flex pe-2">${hb.hbDPA37.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-light col-2">${hb.hbDPA37.value}</div>
            </div>
            <div class="d-flex justify-content-end ${hb.hbDPA10.display}">
                <div class="d-flex pe-2">${hb.hbDPA10.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-success col-2">${hb.hbDPA10.value}</div>
            </div>
            <div class="d-flex justify-content-end ${hb.hbGTERI10.display}">
                <div class="d-flex pe-2">${hb.hbGTERI10.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-dark col-2">${hb.hbGTERI10.value}</div>
            </div>
            <div class="d-flex justify-content-end ${hb.hbGTIGN0.display}">
                <div class="d-flex pe-2">${hb.hbGTIGN0.desc}: </div>
                <div class="badge rounded-0 pt-1 text-bg-light col-2">${hb.hbGTIGN0.value}</div>
            </div>
        </div>`;
        //hb_html = `
        //<div class="d-flex flex-column justify-content-end text-info my-1 f-xsmall ${hb.display}">
        //    <small class="badge rounded-0 text-bg-info ${hb.hb46.display}" title="${hb.hb46.desc}">${hb.hb46.value}</small>
        //    <small class="badge rounded-0 text-bg-primary ${hb.hb47.display}" title="${hb.hb47.desc}">${hb.hb47.value}</small>
        //    <small class="badge rounded-0 text-bg-warning ${hb.hb48.display}" title="${hb.hb48.desc}">${hb.hb48.value}</small>
        //    <small class="badge rounded-0 text-bg-danger ${hb.hb36.display}" title="${hb.hb36.desc}">${hb.hb36.value}</small>
        //    <small class="badge rounded-0 text-bg-dark ${hb.hb37.display}" title="${hb.hb37.desc}">${hb.hb37.value}</small>
        //    <small class="badge rounded-0 text-bg-dark ${hb.hb10.display}" title="${hb.hb10.desc}">${hb.hb10.value}</small>
        //</div>`;
    }
    return hb_html;
}

function m2r_uix_getCurrentTripDetails(_device) {
    var _details = _device.details;
    if (!_details) {
        return false;
    }
    // Current Trip ini
    var dd = new Date(_details.time_begin);
    var bghours = dd.getHours();
    var bgminutes = dd.getMinutes();
    var am_pm = "am";
    if (bgminutes < 10) {
        bgminutes = "0" + bgminutes;
    }
    var _tripini = bghours + ":" + bgminutes + " ";
    if (bghours >= 12) { am_pm = "pm" }
    _device["tripini"] = _tripini + am_pm;

    // Current trip total time 
    var _duration = _details.duration_str.split(" ");
    var _triptt = _duration[0] + " " + _duration[1];
    _device["triptt"] = _triptt;

    // Current trip total distance
    var _ddunit = _M2G.user_setup.units.distance;
    var _distance_str = (_details.distance / 1000).toFixed(2) + " " + _ddunit;
    if (_distance_str > 0) { _distance_str += "s" }
    _device["distance_str"] = _distance_str;

    // Ignition on/off
    var _ignclass = "border border-5 border-dark border-top-0 border-bottom-0 border-end-0";
    if (_details.ignition == 1) {
        _ignclass = "border border-5 border-warning border-top-0 border-bottom-0 border-end-0";
    }
    _device["tripclass"] = _ignclass;
   // console.log(_device);

    return _device;
}


function m2r_uix_getCurrentTrip(device) {
    if (!device) {
        device = _M2G.device_selected[0];
    }
    var current_trip = _M2G.rendered_vehicles[device];
    // console.log("Current Trip:",current_trip);
    return current_trip;
}

function m2r_uix_getHarshBehavior(current_trip) {
    
    var _hb = { ...current_trip.harsh_behavior };
    var hbl = Object.keys(_hb).length > 0;

    var _hbdisplay = "d-none";
    if (hbl > 0) {
        _hbdisplay = "d-block";
    }
    //var DPA = { ..._M2G.event_types.DPA };
    var DPA = { ..._M2G.event_types };
    var _hb2 = {}
    var events = Object.keys(DPA);
   // console.log(_harsh_behavior)
   // console.log(_hb,events)
    for (var i = 0; i < events.length; i++) {
        var key = events[i];
       // console.log(i, _hb[key])
        if (_hb[key]) {
            _hb2[key] = { display: "d-block", value: _hb[key].length, desc:DPA[key].desc }
        } else {
            _hb2[key] = { display: "d-none", value: 0 }
        }
    }
    _hb2.display = _hbdisplay;
   // console.log(_hb2);
    return  _hb2;
}


// filters
function m2r_uix_toggle_sidebarFilters() {
   // _('m2r_sidebar').classList.toggle('m2r_filters_width');
    _('m2r_sidebar').classList.toggle('d-none');
}