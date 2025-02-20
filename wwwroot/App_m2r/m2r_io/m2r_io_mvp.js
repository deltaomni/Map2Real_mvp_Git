/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file defines I/O with M2R API
 * for MAP2REAL MVP REV2024.01
 *
 * @summary I/O Functions between web app and API Server
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-05-14 00:00:00 
 * Revision         : 01/   2024-05-14  
 * Last modified    : 2024-05-14 11:00:00
 * 
 */


async function m2r_fetchmap(device_imei, date_start, date_finish) {
	if (device_imei == 'start') { device_imei = _M2G.device_imei.join(',') } else {
		if (!device_imei) {
			// update sequence of m2r_app_start
			device_imei = _M2G.device_selected[0];
			m2r_app_start(device_imei, "update")
		}
	}

	if (!date_start) {
		date_start = "/" + _M2G.date_start;
	}
	if (!date_finish) {
		date_finish = "/" + _M2G.date_finish;
	}
	
	var _prefix = _M2G.app_uri.prefix;
	var _uri = _M2G.app_uri.uri;

	date_finish_adjust = date_finish.split("-");

	var finishDD = Number(date_finish_adjust[2]);

	if (finishDD < 10) {
		finishDD = "0" + finishDD;
	}
	date_finish_adjust[2] = finishDD.toString();
	date_finish_adjust=date_finish_adjust.join("-");
	date_finish = m2r_getNextDate(date_finish_adjust);

	_uri += device_imei + date_start + "/"+ date_finish;
	f_hier_BlinkIOOnOff("on");

	var response = await fetch(_prefix+_uri);
	var txtStr = await response.text();
	f_hier_BlinkIOOnOff("off");

	if (txtStr != "{}") {
		return txtStr;
	} else {
		alert("Não há dados no período considerado para o imei: " + device_imei);
	}
}

function f_hier_BlinkIOOnOff(state) {

	if (!state) {
		return false;
	}

	var topStatus = _cn("io_hier_status");
	var tsl = topStatus.length;

	for (var i0 = 0; i0 < tsl; ++i0) {
		if (state === "show" || state === "on") {
			topStatus[i0].classList.remove("d-none");
		}

		if (state === "hide" || state === "off") {
			topStatus[i0].classList.add("d-none");
		}
	}
}


function m2r_getNextDate(inputDate) {
	// Parse the input date
	const date = new Date(inputDate);

	// Add one day (in milliseconds)
	date.setDate(date.getDate() + 1);

	// Format the date back to YYYY-MM-DD
	const nextDate = date.toISOString().split('T')[0];
	return nextDate;
}