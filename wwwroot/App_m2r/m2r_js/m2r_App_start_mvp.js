/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file starts Web App
 * for MAP2REAL MVP REV2024.01
 *
 * @summary starts Web App when Window Loads
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-05-14 00:00:00 
 * Revision         : 01/   2024-05-14  
 * Last modified    : 2024-05-14 11:00:00
 * 
 */

console.log("Start App:",Date.now().toLocaleString())

/// recursive within App
function _(id) {
    return document.getElementById(id);
}

function _cn(cname, el) {
    // console.log(cname, el);
    if (el) {
        return el.getElementsByClassName(cname);
    } else {
        return document.getElementsByClassName(cname);
    }
}

function _qsa(cname, el) {
    if (el) {
        return el.querySelectorAll(cname);
    } else {
        return document.querySelectorAll(cname);
    }
}

function _tn(cname, el) {
    if (el) {
        return el.getElementsByTagName(cname);
    } else {
        return document.getElementsByTagName(cname);
    }
}