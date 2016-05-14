(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./TweenFunc":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var TweenFunc = exports.TweenFunc = {
    /*
        t - current time of tween
        b - starting value of property
        c - change needed in value
        d - total duration of tween
    */

    // Handy tweener visualizations: http://hosted.zeh.com.br/tweener/docs/en-us/misc/transitions.html
    // Ref: http://tweener.ivank.net/tw.js
    easeNone: function easeNone(t, b, c, d) {
        return c * t / d + b;
    },
    easeInQuad: function easeInQuad(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function easeOutQuad(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function easeInOutQuad(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        t -= 1;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },
    easeInCubic: function easeInCubic(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function easeOutCubic(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeOutInCubic: function easeOutInCubic(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeOutCubic(t * 2, b, c / 2, d);
        }
        return TweenFunc.easeInCubic(t * 2 - d, b + c / 2, c / 2, d);
    },
    easeInQuart: function easeInQuart(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function easeOutQuart(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function easeInOutQuart(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeOutInQuart: function easeOutInQuart(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeOutQuart(t * 2, b, c / 2, d);
        }
        return TweenFunc.easeInQuart(t * 2 - d, b + c / 2, c / 2, d);
    },
    easeInQuint: function easeInQuint(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function easeOutQuint(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function easeInOutQuint(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeOutInQuint: function easeOutInQuint(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeOutQuint(t * 2, b, c / 2, d);
        }
        return TweenFunc.easeInQuint(t * 2 - d, b + c / 2, c / 2, d);
    },
    easeInSine: function easeInSine(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function easeOutSine(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function easeInOutSine(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeOutInSine: function easeOutInSine(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeOutSine(t * 2, b, c / 2, d);
        }
        return TweenFunc.easeInSine(t * 2 - d, b + c / 2, c / 2, d);
    },
    easeInExpo: function easeInExpo(t, b, c, d) {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
    },
    easeOutExpo: function easeOutExpo(t, b, c, d) {
        return t === d ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function easeInOutExpo(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
        }
        return c / 2 * 1.0005 * (-Math.pow(2, -10 * (t - 1)) + 2) + b;
    },
    easeOutInExpo: function easeOutInExpo(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeOutExpo(t * 2, b, c / 2, d);
        }
        return TweenFunc.easeInExpo(t * 2 - d, b + c / 2, c / 2, d);
    },
    easeInCirc: function easeInCirc(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function easeOutCirc(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function easeInOutCirc(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeOutInCirc: function easeOutInCirc(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeOutCirc(t * 2, b, c / 2, d);
        }
        return TweenFunc.easeInCirc(t * 2 - d, b + c / 2, c / 2, d);
    },
    easeInElastic: function easeInElastic(t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function easeOutElastic(t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function easeInOutElastic(t, b, c, d, a, p) {
        var s;
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    easeOutInElastic: function easeOutInElastic(t, b, c, d, a, p) {
        if (t < d / 2) {
            return TweenFunc.easeOutElastic(t * 2, b, c / 2, d, a, p);
        }
        return TweenFunc.easeInElastic(t * 2 - d, b + c / 2, c / 2, d, a, p);
    },
    easeInBack: function easeInBack(t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function easeOutBack(t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function easeInOutBack(t, b, c, d, s) {
        if (typeof s === 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeOutInBack: function easeOutInBack(t, b, c, d, s) {
        if (t < d / 2) {
            return TweenFunc.easeOutBack(t * 2, b, c / 2, d, s);
        }
        return TweenFunc.easeInBack(t * 2 - d, b + c / 2, c / 2, d, s);
    },
    easeInBounce: function easeInBounce(t, b, c, d) {
        return c - TweenFunc.easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce: function easeOutBounce(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }

        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    },
    easeInOutBounce: function easeInOutBounce(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
        }
        return TweenFunc.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    },
    easeOutInBounce: function easeOutInBounce(t, b, c, d) {
        if (t < d / 2) {
            return TweenFunc.easeOutBounce(t * 2, b, c / 2, d);
        }
        return TweenFunc.easeInBounce(t * 2 - d, b + c / 2, c / 2, d);
    }
};
},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global THREE */
/* global window */
/* global document */
/* global Stats */

var _TweenFunc = require('./TweenFunc');

var _AngleInterpolation = require('./AngleInterpolation');

var _AngleInterpolation2 = _interopRequireDefault(_AngleInterpolation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -250;

var container = void 0;
var stats = void 0;

var camera = void 0;
var scene = void 0;

var renderer = void 0;
var mixer = void 0;

/* Unused stuff */
// var sceneAnimationClip;
// var mesh;
// var helper;
var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

var light1;
var light2;
var light3;
var light4;

var gDialCount = 6;
var gDial = null;
var gCounter = 0;

var gCameraPosition = new THREE.Vector3(gDialCount / 2 * 50, 0, 550);
var gCameraTarget = new THREE.Vector3(gDialCount / 2 * 50, 0, 0);

var R2D = 180.0 / Math.PI;
var D2R = 1.0 / R2D;

var NumberToAngle = function NumberToAngle(iNumber) {

    // Converting number to dial angle to display that number.
    // 0 degrees rotation - number 5
    // 5*36 degrees rotation - number 0

    var angle = (5 - iNumber) * 36 * D2R;

    return angle;
};

document.addEventListener('mousemove', onDocumentMouseMove, false);

init();
animate();

/**
 * OBJLoadPromise(): Returns a promist to load OBJ
 * @param {String} iOBJPath relative to web root
 * @param {THREE.LoadingManager} iLoadingManager, instance of THREE.LoadingManager()
 * @param {function} iProgressCallback, progress callback()
 * @return {Promise} A Promise that's resolved with an THREE object.
 */
function OBJLoadPromise(iOBJPath, iLoadingManager, iProgressCallback) {
    var loaderPromise = new Promise(function (iResolveFunc, iRejectFunc) {

        var loader = new THREE.OBJLoader(iLoadingManager);
        loader.load(iOBJPath, function (iObject) {
            iResolveFunc(iObject);
        }, function (xhr) {
            iProgressCallback(xhr);
        }, function (xhr) {
            iRejectFunc(xhr);
        });
    });

    return loaderPromise;
}

/**
 * init(): Initialize and load the scene
 */
function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);

    camera.position.x = gCameraPosition.x;
    camera.position.y = gCameraPosition.y;
    camera.position.z = gCameraPosition.z;

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // cene.add( camera );

    // GROUND

    var geometry = new THREE.PlaneBufferGeometry(16000, 16000);
    var material = new THREE.MeshPhongMaterial({
        emissive: 0x000000
    });

    var ground = new THREE.Mesh(geometry, material);
    ground.position.set(0, FLOOR, 0);
    ground.rotation.x = -Math.PI / 2;
    /* scene.add( ground );*/

    ground.receiveShadow = true;

    // RENDERER

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.domElement.style.position = "relative";

    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;

    var sphere = new THREE.SphereGeometry(10.5, 16, 8);
    light1 = new THREE.PointLight(0xffffff, 2, 550);
    light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
        color: 0xff0040
    })));
    scene.add(light1);
    light2 = new THREE.PointLight(0x004040, 2, 550);
    light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
        color: 0x0040ff
    })));
    scene.add(light2);
    light3 = new THREE.PointLight(0x300f00, 2, 550);
    light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
        color: 0x80ff80
    })));
    scene.add(light3);
    light4 = new THREE.PointLight(0xff0000, 2, 550);
    light4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
        color: 0xffaa00
    })));
    scene.add(light4);

    // STATS

    stats = new Stats();
    container.appendChild(stats.dom);

    //

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);
    };

    var onProgress = function onProgress(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function onError() /* xhr */{};
    var loaderPromise = OBJLoadPromise('assets/models/obj/numbers_ring/numbers_ring.obj', manager, onProgress);

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

    var gLastSwitch = Number(0);
    var gLastSwitchArray = [Number(0), Number(0), Number(0), Number(0), Number(0)];

    var NDigitDial = function () {
        function NDigitDial() {
            _classCallCheck(this, NDigitDial);

            this.fDialRings = [];
        }

        _createClass(NDigitDial, [{
            key: 'SetDialsFromExactString',
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
                    gDial.fDialRings[i].ScheduleAngleInterpolation(NumberToAngle(digit));
                }
            }
        }, {
            key: 'SetDialsFromInt',
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
            key: 'AddNewDial',
            value: function AddNewDial(iDial) {
                this.fDialRings.push(iDial);
            }
        }, {
            key: 'Animate',
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

    loaderPromise.then(function (object) {

        gDial = new NDigitDial();

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                var diffuseColor = new THREE.Color(1, 1, 1);

                var material = new THREE.MeshPhongMaterial({
                    color: diffuseColor
                });

                child.material = material;

                for (var i = 0; i < gDialCount; i += 1) {
                    var dial = new THREE.Mesh(child.geometry, child.material);
                    // here you can apply transformations, for this clone only
                    dial.geometry.computeBoundingBox();
                    dial.position.x = 0;
                    dial.position.y = 0;
                    dial.position.z = 0;

                    scene.add(dial);

                    var dialRing = new DialRing(dial, i, "easeNone");
                    dialRing.ScheduleAngleInterpolation(0);
                    gDial.AddNewDial(dialRing);
                }

                // window.setInterval(() => {
                //     if (gDial !== null) {
                //         for (let d = 0; d < gDial.fDialRings.length; d += 1) {
                //             // const randAngle = Math.random() * Math.PI * 2;
                //             // gDial.fDialRings[d].ScheduleAngleInterpolation(randAngle);
                //
                //             const randNumber = Math.floor(Math.random() * 9.0);
                //             gDial.fDialRings[d].ScheduleAngleInterpolation(
                //                 NumberToAngle(randNumber));
                //         }
                //     }
                // }, 1000);

                window.setInterval(function () {
                    if (gDial !== null) {
                        try {

                            gDial.SetDialsFromInt(gCounter);
                            gCounter += 1;
                        } catch (e) {
                            console.log("EXCEPTION: " + e.message);
                        }
                    }
                }, 1000);
            }
        });
    }).catch(function (xhr) {
        onError(xhr);
    });

    // const loader = new THREE.OBJLoader(manager);
    // loader.load('assets/models/obj/numbers_ring/numbers_ring.obj', , onProgress, onError);

    window.addEventListener('resize', onWindowResize, false);
}

/**
 * onWindowResize(): Callback on Window Resize
 */
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * onDocumentMouseMove(): Callback on Mouse Move
 * @param {Event} event : mouse event from the DOM
 */
function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    console.log(mouseX.toString() + " " + mouseY.toString());
}

//
/**
 * animate(): Animation initialization/callback
 */
function animate() {

    window.requestAnimationFrame(animate);

    var nowMS = Date.now();

    if (gDial !== null) {
        gDial.Animate(nowMS);
    }
    render();

    stats.update();
}

/**
 * render(): Rendering happens here.
 */
function render() {

    var time = Date.now() * 0.0005;

    var delta = clock.getDelta();

    light1.position.x = 0;
    light1.position.y = 100;
    light1.position.z = 250;

    light2.position.x = Math.cos(time * 0.3) * 100;
    light2.position.y = Math.sin(time * 0.5) * 100;
    light2.position.z = Math.sin(time * 0.7) * 100;
    light3.position.x = Math.sin(time * 0.7) * 100;
    light3.position.y = Math.cos(time * 0.3) * 100;
    light3.position.z = Math.sin(time * 0.5) * 100;
    light4.position.x = Math.sin(time * 0.3) * 300;
    light4.position.y = Math.cos(time * 0.7) * 400;
    light4.position.z = Math.sin(time * 0.5) * 300;

    delta = 0.75 * clock.getDelta();

    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y = THREE.Math.clamp( camera.position.y + ( - mouseY - camera.position.y ) * .05, 0, 1000 );

    // camera.lookAt(scene.position);
    camera.lookAt(gCameraTarget);
    if (mixer) {
        // console.log( "updating mixer by " + delta );
        mixer.update(delta);
    }

    renderer.render(scene, camera);
}
},{"./AngleInterpolation":1,"./TweenFunc":2}]},{},[1,2,3]);