'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TweenFunc = require('./TweenFunc');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AngleInterpolation = function () {
    function AngleInterpolation(iStartTime, iEndTime, iStartAngle, iEndAngle, iTweenFunc) {
        _classCallCheck(this, AngleInterpolation);

        this.fStartTime = Number(iStartTime);
        this.fEndTime = Number(iEndTime);
        this.fStartAngle = iStartAngle;
        this.fEndAngle = iEndAngle;

        this.fTweenFunc = iTweenFunc;
    }

    _createClass(AngleInterpolation, [{
        key: 'LerpAngleConst',
        value: function LerpAngleConst(iCurrentTime) {
            var normalizedLerpTime = (iCurrentTime - this.fStartTime) / (this.fEndTime - this.fStartTime);

            var t = iCurrentTime - this.fStartTime;
            var b = this.fStartAngle;
            var c = this.fEndAngle - this.fStartAngle;
            var d = this.fEndTime - this.fStartTime;

            var lerpedAngle = this.fStartAngle;
            if (normalizedLerpTime >= 0.0 && normalizedLerpTime < 1.0) {
                var tweenFunc = _TweenFunc.TweenFunc[this.fTweenFunc];

                lerpedAngle = tweenFunc(t, b, c, d);
            } else if (normalizedLerpTime >= 1.0) {
                lerpedAngle = this.fEndAngle;
            }

            return lerpedAngle;
        }
    }, {
        key: 'IsAnimationDoneConst',
        value: function IsAnimationDoneConst(iCurrentTime) {
            if (iCurrentTime > this.fEndTime) {
                return true;
            }

            return false;
        }
    }]);

    return AngleInterpolation;
}();

exports.default = AngleInterpolation;