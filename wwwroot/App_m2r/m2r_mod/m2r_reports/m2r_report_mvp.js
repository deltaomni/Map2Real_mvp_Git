/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file handles forms
 * for MAP2REAL MVP REV2024.01
 *
 * @summary open new tab for printed forms
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-08-06 00:00:00 
 * Revision         : 01/   2024-08-06 
 * Last modified    : 2024-08-06 11:00:00
 * 
 */


async function m2r_report_buildHTMLReports(tripid, report_type) {
    var report = true;

    switch (report_type) {
        case 'trip_report':
            var htmlText = await m2r_report_buildTripReport(tripid, false,false);
            break;
        case 'triplist_report':
            htmlText = await m2r_report_buildTripReport(tripid, true,false); 
            break;
        case 'triplist_download':
            htmlText = await m2r_report_buildTripReport(tripid, false, true); 
            report = false;
            break;
        default:
            break;

    }
    if (!htmlText) {
        return false;
    }
    if (report) {
        m2r_report_openNewTab(htmlText);
    } else { // generates text file for download

        var dv = _devices_templates.find(item => {
            return item.id == tripid;
        })
        var v = dv.vehicle;
        var o = dv.operator;
        var idt = "\t\t" +v.id + "\t'" + tripid +"\t\t'"+ + v.make + "\t" + v.plate + "\t" + v.location + "\t\t" + o.name + "\t" + o.city + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t;";
        var Header = "p\ti\t0\t1\t2\t3\t4\t5\t6\tkm\tkm/h\t9\tkm/h\t11\tkm/h\t13\t13a\t14\t15\t16\t17\t18\t19\t%\t%\t%\t%\t%\t25\t26;";
        var legend = "placa\timei\tidt Viagem\tIGN ON\tIGN OFF\tData\tInício latlng\tFim latlng\tTT\tDD\tV.Média\tPerfil\tV.Máx\tVmáx latlng\tV.Lim.\tPedal\tPedal/DD\tFreada e curva\tAccel. e curva\tAccel. Brusca\tFreada Brusca\tCurva Brusca\tidling\tV<30\t30<V<60\t60<V<90\t90<V<120\tV>120\tNoite\tCrít.;";
        /* htmlText = idt + Header + legend + htmlText;*/
        htmlText =  Header + legend + htmlText;

        m2r_POST_Trip_List(htmlText, tripid);
    }
}

async function m2r_report_fetchFileReport(file) {

    var htmlText = await m2r_fetchHTML(file);
    return htmlText;

}

async function m2r_report_buildTripReport(tripid, list, download) {
    var locale = _M2G.locale.app_locale;
    //console.trace();
    var _n = "-";
    if (download) {
        _n = "";
    }
    console.log(tripid);
    var Arr = tripid.split("-");
    console.log(Arr);

    var device_imei = Arr[0];
    if (!device_imei) {
        return false;
    }
    if (_M2G.rendered_trips_filtered) {
        var trips = _M2G.rendered_trips_filtered[device_imei];
    } else {
        trips = _M2G.rendered_trips[device_imei];
    }
    if (!trips) {
       // console.log(_M2G.device_selected);
        console.log("refresh");
        m2r_map_clearTripPathShape(); // clear all shapes
        _M2G.rendered_shapes = {};
        m2r_app_start();
    }
    var trip_nr = Arr[1] || null;

    // path
    var uri = _M2G.fetch_uri;

    // Fetch file
    var fileStr = uri.files["report_trip"];
    var suffix = uri.suffix; // .html

    var htmlText = await m2r_report_fetchFileReport(fileStr + suffix);
    // console.log(htmlText);


    // Body
    console.log(trips)
    if (!trips) {
        return false;
    }
    var o = Object.keys(trips);

    var bodyText = "";

    if (trip_nr) {
        var details = trips[trip_nr].details;
        bodyText += subf_reportGet(details, "cell-bottom-bd");
    } else {
        for (var i = 0; i < o.length; i++) {
            details = trips[o[i]].details;
            // console.log(details);

            if (i == o.length - 1) {
                var cell_bd = "cell-bottom-bd";
            } else {
                cell_bd = "cell-bd";
            }

            bodyText += subf_reportGet(details, cell_bd);
            //console.log(_body_text);
        }
    }
    //var JSONString = JSON.stringify(details);
    //// console.log(trips);
    //bodyText += "<br/>";
    //bodyText += JSONString;

    // build html
    // Body
    if (!download) {
        var html = htmlText.replaceAll("{{body}}", bodyText);

        // Header
        var vehicle_idt = _M2G.devices_templates.find(item => {
            return item.id == device_imei;
        })
        var vehicle = vehicle_idt.vehicle;

        //console.log(vehicle.vehicle);
        html = html.replaceAll("{{vehicle.make}}", vehicle.make);
        html = html.replaceAll("{{vehicle.plate}}", vehicle.plate);
        html = html.replaceAll("{{device_imei}}", device_imei);
        if (trip_nr) {
            var trip_nr_text = details.trip_nr_m2;
        } else {
            trip_nr_text = "";
        }
        html = html.replaceAll("{{trip.trip_nr_m2}}", trip_nr_text);
    } else {
        html = bodyText;
    }
    //console.log(html)
    //// open new tab
    return html;

    function subf_reportGet(details, cell_class) {
        // console.log(details);
        var _prefix = "https://www.google.com/maps/search/";
        var _suffix = "?sa=X&ved=1t:242&ictx=111";

        // Lat Long Start
        //${ details.latlngstart.lat }, <br />${ details.latlngstart.lng }
        var startlat = details.latlngstart.lat;
        var startlng = details.latlngstart.lng;
        if (startlat) {
            var latlngstart = startlat + ",<br>" + startlng;
            var maxstart = _prefix + startlat + ",+" + startlng + _suffix;
        } else {
            latlngstart = _n;
            maxstart = "";
        }


        // Lat Long Finish
        //${ details.latlngfinish.lat }, <br />${ details.latlngfinish.lng }</div >
        var finlat = details.latlngfinish.lat;
        var finlng = details.latlngfinish.lng;
        if (finlat) {
            var latlngfinish = finlat + ",<br>" + finlng;
            var maxfinish = _prefix + finlat + ",+" + finlng + _suffix;
        } else {
            latlngfinish = _n;
            maxfinish = "";
        }

        // data short
        var _datashort = details.date_local.shortbegin.split('/');
        _datashort = _datashort[0] + "/" + _datashort[1] + "/" + _datashort[2].substring(2)

        //speed
        var unit = details.speed.unit;
        var slat = details.speed.maxrecordedlatlng.lat;
        if (slat) {
            var slng = details.speed.maxrecordedlatlng.lng;
            var maxrecordedlatlng = slat + ",<br>" + slng;
            var maxmap = _prefix + slat + ",+" + slng + _suffix
        } else {
            maxrecordedlatlng = _n;
            maxmap = "";
        }



        //
        var _avg = details.speed.average;
        if (_avg) {
            _avg = _avg.toFixed(2);
            //_avg = _avg.toLocaleString();
            // _avg = _avg.replace(".", ",");
        } else { _avg = _n };

        var _maxrec = Number(details.speed.maxrecorded);
        if (_maxrec) {
            _maxrec = _maxrec.toFixed(2);
            //_maxrec = _maxrec.replace(".", ",");
        } else { _maxrec = _n };


        // harsh behavior
        var hb36 = details.harsh_behavior.hbDPA36; // Freio e Curva
        var hb37 = details.harsh_behavior.hbDPA37; // Aceleração e Curva
        var hb38 = details.harsh_behavior.hbDPA38; // Desconhecido
        var hb46 = details.harsh_behavior.hbDPA46; // Accelerador Brusco
        var hb47 = details.harsh_behavior.hbDPA47; // Freio Brusco
        var hb48 = details.harsh_behavior.hbDPA48; // volante Brusco
        var hb10 = details.harsh_behavior.hbDPA10; // Pedal
        if (hb36) {
            var _hb36 = hb36.length;
        } else {
            _hb36 = _n;
        }
        if (hb37) {
            var _hb37 = hb37.length;
        } else {
            _hb37 = _n;
        }
        if (hb38) {
            var _hb38 = hb38.length;
        } else {
            _hb38 = _n;
        }
        if (hb46) {
            var _hb46 = hb46.length;
        } else {
            _hb46 = _n;
        }
        if (hb47) {
            var _hb47 = hb47.length;
        } else {
            _hb47 = _n;
        }
        if (hb48) {
            var _hb48 = hb48.length;
        } else {
            _hb48 = _n;
        }
        if (hb10) {
            var _hb10 = hb10.length;
        } else {
            _hb10 = _n;
        }


        //Pedal/DD
        var _pedal_dd = details.details.pedal_dd;
        if (_pedal_dd) {
            _pedal_dd = _pedal_dd.toFixed(2);
        } else {
            _pedal_dd = _n;
        }
        //<div class="p-0 cw-60 border ${cell_class} f-xxxsmall"><a href="${maxstart}" target="_blank">${latlngstart}</a></div>
        //<div class="p-0 cw-60 border ${cell_class} f-xxxsmall"><a href="${maxfinish}" target="_blank">${latlngfinish}</a></div>
        //<div class="p-0 cw-50 border ${cell_class} f-xxxsmall"><a href="${maxmap}" target="_blank">${maxrecordedlatlng}</a></div>
        var _distance = details.details.distance / 1000 || _n;

        if (_distance != _n) {
            _distance = _distance.toFixed(2);
            //_distance = _distance.replace(".", ",");

        }
        //console.log(_distance, _n)

        //duration
        var _duration = m2r_getTimeFromTimeStamp(details.details.duration, 1);
        if (_distance != _n) {
            var _idling = m2r_getTimeFromTimeStamp(details.details.duration_idle, 1);
        } else {
            _idling = _n;
        }

        var _vavg = details.details.vaverage || _n;
        if (_vavg != _n) {
            _vavg = _vavg.toFixed(2);
            //_vavg = _vavg.replace(".", ",");
        }

        var _speed0 = details.speedranges.speed0 || _n;
        if (_speed0 != _n) {
            _speed0 = _speed0.toFixed(2);
            //_speed0 = _speed0.replace(".", ",");
        }

        var _speed30 = details.speedranges.speed30 || _n;
        if (_speed30 != _n) {
            _speed30 = _speed30.toFixed(2);
            //_speed30 = _speed30.replace(".", ",");
        }

        var _speed60 = details.speedranges.speed60 || _n;
        if (_speed60 != _n) {
            _speed60 = _speed60.toFixed(2);
            //_speed60 = _speed60.replace(".", ",");
        }

        var _speed90 = details.speedranges.speed90 || _n;
        if (_speed90 != _n) {
            _speed90 = _speed90.toFixed(2);
            //_speed90 = _speed90.replace(".", ",");
        }

        var _speed120 = details.speedranges.speed120 || _n;
        if (_speed120 != _n) {
            _speed120 = _speed120.toFixed(2);
            //_speed120 = _speed120.replace(".", ",");
        }

        // Períodos críticos
        var _night = m2r_getTimeFromTimeStamp(details.time_range.night.duration, 1);
        var _critical = m2r_getTimeFromTimeStamp(details.time_range.critical.duration, 1);

        var device_imei_short = device_imei.substring(device_imei.length - 4);
        var vehicle = details.details.vehicle;

        var _body_text = `
                <div class="d-flex flex-row  flex-fill p-0 py-0 f-xxsmall text-center">

                 <div class="p-0 cw-65 border ${cell_class} col_0">${vehicle}</div> 
                 <div class="p-0 cw-50 border ${cell_class} col_0">${device_imei_short}</div> 

                <div class="p-0 cw-50 border ${cell_class} col_0">${details.trip_nr_m2}</div> 
                <div class="p-0 cw-60 border ${cell_class} col_1">${details.date_local.time_ini}</div>
                <div class="p-0 cw-60 border ${cell_class} col_2">${details.date_local.time_end}</div>
                <div class="p-0 cw-50 border ${cell_class} col_3">${_datashort}</div>
              
                <div class="p-0 cw-40 border ${cell_class} col_4"><a href="${maxstart}" target="_blank">Map</a></div>
                <div class="p-0 cw-40 border ${cell_class} col_5"><a href="${maxfinish}" target="_blank">Map</a></div>
                <div class="p-0 cw-50 border ${cell_class} col_6">${_duration}</div>

                <div class="p-0 cw-60 border ${cell_class} col_7">${_distance}</div>
                <div class="p-0 cw-40 border ${cell_class} col_8">${_vavg}</div>
                <div class="p-0 cw-40 border ${cell_class} col_9">${details.details.profile}</div>
                <div class="p-0 cw-40 border ${cell_class} col_10">${_maxrec}</div>

                <div class="p-0 cw-40 border ${cell_class} col_11"><a href="${maxmap}" target="_blank">Map</a></div>
                <div class="p-0 cw-50 border ${cell_class} col_12">-</div>
                <div class="p-0 cw-40 border ${cell_class} col_13">${_hb10}</div>
                 <div class="p-0 cw-40 border ${cell_class} col_13a">${_pedal_dd}</div>

                <div class="p-0 cw-40 border ${cell_class} col_14">${_hb36}</div>
                <div class="p-0 cw-40 border ${cell_class} col_15">${_hb37}</div>
                <div class="p-0 cw-40 border ${cell_class} col_16">${_hb46}</div>

                <div class="p-0 cw-40 border ${cell_class} col_17">${_hb47}</div>
                <div class="p-0 cw-40 border ${cell_class} col_18">${_hb48}</div>
                <div class="p-0 cw-50 border ${cell_class} col_19">${_idling}</div>

                <div class="p-0 cw-50 border ${cell_class} col_20">${_speed0}</div>
                <div class="p-0 cw-50 border ${cell_class} col_21">${_speed30}</div>
                <div class="p-0 cw-50 border ${cell_class} col_22">${_speed60}</div>
                <div class="p-0 cw-50 border ${cell_class} col_23">${_speed90}</div>

                <div class="p-0 cw-50 border ${cell_class} col_24">${_speed120}</div>
                <div class="p-0 cw-50 border ${cell_class} col_25">${_night}</div>
                <div class="p-0 cw-50 border ${cell_class}-end col_26">${_critical}</div>
            </div>`

        if (download) {

            var _body_download = `${vehicle}\t${device_imei_short}\t${details.trip_nr_m2}\t${details.date_local.time_ini}\t${details.date_local.time_end}\t${_datashort}\tMapa\tMapa\t${_duration}\t${_distance}\t${_vavg}\t${details.details.profile}\t${_maxrec}\tMapa\t\t${_hb10}\t${_pedal_dd}\t${_hb36}\t${_hb37}\t${_hb46}\t${_hb47}\t${_hb48}\t${_idling}\t${_speed0}\t${_speed30}\t${_speed60}\t${_speed90}\t${_speed120}\t${_night}\t${_critical};`;
            var locale = _M2G.locale.app_locale;
            if (locale == "pt-BR") {
                _body_download = _body_download.replaceAll(".", ",");
            }
            _body_text = _body_download;
            // console.log(_body_download);
        }

        return _body_text;
    }
}



function m2r_report_openNewTab(htmlStr) {
    // console.trace()

    var newWindow = window.open();
    newWindow.document.write(htmlStr);
    newWindow.focus();
    newWindow.document.close();

}

