"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gLastSwitch = Number(0);
var gLastSwitchArray = [Number(0), Number(0), Number(0), Number(0), Number(0)];
var R2D = 180.0 / Math.PI;
var D2R = 1.0 / R2D;

var NumberToAngle = function NumberToAngle(iNumber) {

    // Converting number to dial angle to display that number.
    // 0 degrees rotation - number 5
    // 5*36 degrees rotation - number 0

    var angle = (5 - iNumber) * 36 * D2R;

    return angle;
};

var NDigitDial = function () {
    function NDigitDial() {
        _classCallCheck(this, NDigitDial);

        this.fDialRings = [];
    }

    _createClass(NDigitDial, [{
        key: "SetDialsFromExactString",
        value: function SetDialsFromExactString(iNumberString) {
            if (typeof iNumberString !== 'string') {
                throw new Error("Number must be a string");
            }

            if (iNumberString.length !== this.fDialRings.length) {
                throw new Error("Number must have exactly as many digits as dials");
            }

            for (var i = 0; i < iNumberString.length; i += 1) {
                var digit = Number.parseInt(iNumberString.charAt(i), 10);
                if (Number.isNaN(digit) === true) {
                    throw new Error("Digit in number is not a number!");
                }
                this.fDialRings[i].ScheduleAngleInterpolation(NumberToAngle(digit));
            }
        }
    }, {
        key: "SetDialsFromInt",
        value: function SetDialsFromInt(iInteger) {
            var integerString = iInteger.toString(10);

            if (integerString.length > this.fDialRings.length) {
                throw new Error("Cannot represent the number! Too Large");
            }

            while (integerString.length < this.fDialRings.length) {
                integerString = "0" + integerString;
            }

            this.SetDialsFromExactString(integerString);
        }
    }, {
        key: "AddNewDial",
        value: function AddNewDial(iDial) {
            this.fDialRings.push(iDial);
        }
    }, {
        key: "Animate",
        value: function Animate(nowMS) {
            var sAnimationMode = 4;

            if (this.fDialRings.length <= 0) {
                return;
            }

            if (sAnimationMode === 0) {
                // Continuous animation of all
                var d = 0;

                for (d = 0; d < this.fDialRings.length; d += 1) {
                    var dialRing = this.fDialRings[d];
                    dialRing.SetAngle(2 * Math.PI * (nowMS % 5000 / 5000.0));
                }
            } else if (sAnimationMode === 1) {
                // Variated animation of all

                this.fDialRings[0].SetAngle(2 * Math.PI * (nowMS % 5000 / 5000.0));
                this.fDialRings[1].SetAngle(2 * Math.PI * (nowMS % 4000 / 4000.0));
                this.fDialRings[2].SetAngle(2 * Math.PI * (nowMS % 3000 / 3000.0));
                this.fDialRings[3].SetAngle(2 * Math.PI * (nowMS % 2000 / 2000.0));
                this.fDialRings[4].SetAngle(2 * Math.PI * (nowMS % 1000 / 1000.0));
                this.fDialRings[5].SetAngle(2 * Math.PI * (nowMS % 100 / 100.0));
            } else if (sAnimationMode === 2) {
                // Variated animation of all
                if (nowMS - gLastSwitch > 1000) {
                    this.fDialRings[0].ScheduleDialAdvance();
                    gLastSwitch = nowMS;
                }
                this.fDialRings[0].ProcessAnimation(nowMS);
                this.fDialRings[1].SetAngle(0);
                this.fDialRings[2].SetAngle(0);
                this.fDialRings[3].SetAngle(0);
                this.fDialRings[4].SetAngle(0);
                this.fDialRings[5].SetAngle(0);
            } else if (sAnimationMode === 3) {
                // Variated animation of all
                if (nowMS - gLastSwitchArray[0] > 1000) {
                    this.fDialRings[0].ScheduleDialAdvance();
                    gLastSwitchArray[0] = nowMS;
                }

                if (nowMS - gLastSwitchArray[1] > 1000) {
                    this.fDialRings[1].fTweenFunc = "easeInOutQuad";
                    this.fDialRings[1].ScheduleDialAdvance();
                    gLastSwitchArray[1] = nowMS;
                }

                if (nowMS - gLastSwitchArray[2] > 1000) {
                    this.fDialRings[2].fTweenFunc = "easeInOutBounce";
                    this.fDialRings[2].ScheduleDialAdvance();
                    gLastSwitchArray[2] = nowMS;
                }
                this.fDialRings[0].ProcessAnimation(nowMS);
                this.fDialRings[1].ProcessAnimation(nowMS);
                this.fDialRings[2].ProcessAnimation(nowMS);
                this.fDialRings[3].SetAngle(0);
                this.fDialRings[4].SetAngle(0);
                this.fDialRings[5].SetAngle(0);
            } else if (sAnimationMode === 4) {
                for (var _d = 0; _d < this.fDialRings.length; _d += 1) {
                    this.fDialRings[_d].ProcessAnimation(nowMS);
                }
            }
        }
    }]);

    return NDigitDial;
}();

exports.default = NDigitDial;