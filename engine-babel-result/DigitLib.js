"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var R2D = 180.0 / Math.PI;
var D2R = 1.0 / R2D;

var NumberToAngle = exports.NumberToAngle = function NumberToAngle(iNumber) {

    // Converting number to dial angle to display that number.
    // 0 degrees rotation - number 5
    // 5*36 degrees rotation - number 0

    var angle = (5 - iNumber) * 36 * D2R;

    return angle;
};

var DegreesToRadians = exports.DegreesToRadians = function DegreesToRadians(iDegrees) {

    return D2R * iDegrees;
};

var RadiansToDegrees = exports.RadiansToDegrees = function RadiansToDegrees(iRadians) {

    return R2D * iRadians * 1.0;
};

var toHHMMSS = exports.toHHMMSS = function toHHMMSS(iString) {
    var sec_num = parseInt(iString, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return String(hours) + String(minutes) + String(seconds);
};