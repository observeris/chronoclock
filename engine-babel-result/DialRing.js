'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global THREE */


var _TweenFunc = require('./TweenFunc');

var _AngleInterpolation = require('./AngleInterpolation');

var _AngleInterpolation2 = _interopRequireDefault(_AngleInterpolation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var R2D = 180.0 / Math.PI;
var D2R = 1.0 / R2D;

var DialRing = function () {
    function DialRing(iMesh, iIndex, iTweenFunc) {
        _classCallCheck(this, DialRing);

        this.fMesh = iMesh;
        this.fAngleRadians = 0.0;
        this.fIndex = iIndex;
        if (iMesh.geometry.boundingBox === null) {
            iMesh.geometry.computeBoundingBox();
        }
        this.fBBOX = iMesh.geometry.boundingBox;
        // Default pivot point is the center of bounding box.

        this.fPivotPoint = new THREE.Vector3(0, 0, 0);
        this.fPivotPoint.add(this.fBBOX.min);
        this.fPivotPoint.add(this.fBBOX.max);
        this.fPivotPoint.multiplyScalar(0.5);

        this.fMesh.matrixAutoUpdate = false;
        this.fMesh.matrix.identity();
        this.fAngleInterpolation = null;

        if (_TweenFunc.TweenFunc.hasOwnProperty(iTweenFunc)) {
            console.log("Function " + iTweenFunc + " accepted");
        } else {
            console.log("ERROR : No Tween Function " + iTweenFunc + " !");
        }
        this.fTweenFunc = iTweenFunc;
        this.fForceAnimationDirection = 2;
        // -1, if the digit increase, it will always be one step.
        // -1, if the digit decreases, it will always be NINE steps.

        // 1 = Forces all angles to be bigger than current angles.
        // E.g. when asked to lerp from 20 degrees to 1, will lerp to 361
        // 0 = No Forcing;
        // -1 = Forces all angles to be smaller than current angles.
        // E.g. when asked to lerp from 20 degrees to 1, will lerp to -359
        // 2 = Forces minimal spin direction. (SHOULD BE DEFAULT I THINK)
        // Evaluates 1 and -1 option and picks one that results in minimal change.
        // 3 = Forces maximal spin direction.
        // Evaluates 1 and -1 option and picks one that results in maximal change.
    }

    _createClass(DialRing, [{
        key: 'UpdatePosition',
        value: function UpdatePosition() {
            var pivot = this.fPivotPoint;
            var toCenter = new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z);
            var fromCenter = new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z);

            var rotMatrix = new THREE.Matrix4().makeRotationX(this.fAngleRadians);
            // 2 * Math.PI * ((nowMS % 5000) / 5000.0));
            var transMatrix = new THREE.Matrix4().makeTranslation(50 * this.fIndex, 200, 0);

            var newMatrix = new THREE.Matrix4();

            // newMatrix.multiply(toCenter);
            // newMatrix.multiply(rotMatrix);
            // newMatrix.multiply(fromCenter);
            // newMatrix.multiply(transMatrix);
            newMatrix.multiply(transMatrix);
            newMatrix.multiply(fromCenter);
            newMatrix.multiply(rotMatrix);
            newMatrix.multiply(toCenter);

            this.fMesh.matrix = newMatrix;
        }
    }, {
        key: 'SetAngle',
        value: function SetAngle(iAngle) {
            this.fAngleRadians = iAngle;
            this.UpdatePosition();
        }
    }, {
        key: 'ScheduleAngleInterpolation',
        value: function ScheduleAngleInterpolation(iNewAngleValue) {
            var _this = this;

            var PositiveAngleDirection = function PositiveAngleDirection(iNewAngle) {
                var newAngle = iNewAngle;
                while (newAngle < _this.fAngleRadians) {
                    newAngle += Math.PI * 2;
                }
                return newAngle;
            };

            var NegativeAngleDirection = function NegativeAngleDirection(iNewAngle) {
                var newAngle = iNewAngle;
                while (newAngle > _this.fAngleRadians) {
                    newAngle -= Math.PI * 2;
                }
                return newAngle;
            };

            var newAngleRadians = iNewAngleValue;
            if (this.fForceAnimationDirection === 1) {
                newAngleRadians = PositiveAngleDirection(iNewAngleValue);
            } else if (this.fForceAnimationDirection === -1) {
                newAngleRadians = NegativeAngleDirection(iNewAngleValue);
            } else if (this.fForceAnimationDirection === 2 || this.fForceAnimationDirection === 3) {
                var forceMINUSNewAngle = NegativeAngleDirection(iNewAngleValue);
                var forcePLUSNewAngle = PositiveAngleDirection(iNewAngleValue);

                // this.fForceAnimationDirection === 2 Pick one angle that results in *less* rotation
                // this.fForceAnimationDirection === 3 Pick one angle that results in *more* rotation

                if (Math.abs(forceMINUSNewAngle - this.fAngleRadians) < Math.abs(forcePLUSNewAngle - this.fAngleRadians)) {
                    if (this.fForceAnimationDirection === 2) {
                        newAngleRadians = forceMINUSNewAngle;
                    } else {
                        newAngleRadians = forcePLUSNewAngle;
                    }
                } else if (this.fForceAnimationDirection === 3) {
                    newAngleRadians = forcePLUSNewAngle;
                } else {
                    newAngleRadians = forceMINUSNewAngle;
                }
            }
            var lerpStruct = new _AngleInterpolation2.default(Date.now(), Date.now() + 700, this.fAngleRadians, newAngleRadians, this.fTweenFunc);
            this.fAngleInterpolation = lerpStruct;
        }
    }, {
        key: 'ScheduleDialAdvance',
        value: function ScheduleDialAdvance() {
            this.ScheduleAngleInterpolation(this.fAngleRadians + D2R * 36.0);
        }
    }, {
        key: 'ProcessAnimation',
        value: function ProcessAnimation(iCurrentTime) {
            if (this.fAngleInterpolation !== null) {

                var lerpedAngle = this.fAngleInterpolation.LerpAngleConst(iCurrentTime);

                if (this.fAngleInterpolation.IsAnimationDoneConst(iCurrentTime)) {
                    this.fAngleInterpolation = null;
                }

                this.SetAngle(lerpedAngle);
            }
        }
    }]);

    return DialRing;
}();

exports.default = DialRing;