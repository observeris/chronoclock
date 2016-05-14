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

    return R2D * iRadians;
};