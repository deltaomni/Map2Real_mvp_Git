/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file fetch external content
 * for MAP2REAL MVP REV2024.01
 *
 * @summary fetch external content from Server/ blob
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-05-14 00:00:00 
 * Revision         : 01/   2024-05-14  
 * Last modified    : 2024-05-14 11:00:00
 * 
 */

async function m2r_fetchHTML(file) {
    var _uri = _M2G.fetch_uri.uri;
    _uri += file;
    console.log(_uri);

    var response = await fetch_file(_uri);
    return response;

    async function fetch_file(uri) {
        var response = await fetch(uri);
        var txtStr = response.text();
        return txtStr;
    }
}


async function m2r_POST_Trip_List(triplistStr, Device_Imei) {
    var uri = _M2G.app_uri.prefix;
   // uri = "https://localhost:7168/";
    var _uri = uri + "api/TripReport";

    // Define the data we want to send
    const Trips = { TripRows: triplistStr, Device_Imei: Device_Imei, Date_Start:_M2G.date_start,Date_Finish:_M2G.date_finish };
   
    // Send the POST request using fetch
    fetch(_uri, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Trips)
    })
        .then((response) => response.json())
        .then((data) => {

            var link = document.createElement("a");
            // If you don't know the name or want to use
            // the webserver default set name = ''
            link.setAttribute('download', '');
            link.href = uri + "downloads/" + data;
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch((error) => console.error("Error:", error));
}
