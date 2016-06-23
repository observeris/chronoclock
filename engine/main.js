/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _MainEngine = __webpack_require__(1);

	var _MainEngine2 = _interopRequireDefault(_MainEngine);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gEngine = new _MainEngine2.default(document, window); /* global document */
	/* global window */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global THREE */
	/* global Stats */

	var _DialRing = __webpack_require__(2);

	var _DialRing2 = _interopRequireDefault(_DialRing);

	var _NDigitDial = __webpack_require__(6);

	var _NDigitDial2 = _interopRequireDefault(_NDigitDial);

	var _DigitLib = __webpack_require__(5);

	var DigitLib = _interopRequireWildcard(_DigitLib);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	 * OBJLoadPromise(): Returns a promist to load OBJ
	 * @param {String} iCOLLADAPath relative to web root
	 * @param {THREE.LoadingManager} iLoadingManager, instance of THREE.LoadingManager()
	 * @param {function} iProgressCallback, progress callback()
	 * @return {Promise} A Promise that's resolved with an THREE object.
	 */
	function COLLADALoadPromise(iCOLLADAPath, iLoadingManager, iProgressCallback) {
	    var loaderPromise = new Promise(function (iResolveFunc, iRejectFunc) {

	        var loader = new THREE.ColladaLoader();

	        loader.load(iCOLLADAPath, function (iColladaStuff) {
	            iResolveFunc(iColladaStuff);
	        }, function (xhr) {
	            iProgressCallback(xhr);
	        }, function (xhr) {
	            iRejectFunc(xhr);
	        });
	    });

	    return loaderPromise;
	}

	var MainEngine = function () {
	    function MainEngine(iDocument, iWindow) {
	        var _this = this;

	        _classCallCheck(this, MainEngine);

	        this.window = iWindow;
	        this.document = iDocument;

	        this.SCREEN_WIDTH = this.window.innerWidth;
	        this.SCREEN_HEIGHT = this.window.innerHeight;
	        this.FLOOR = -250;

	        this.container = null;
	        this.stats = null;

	        this.camera = null;
	        this.scene = null;

	        this.renderer = null;
	        this.mixer = null;

	        this.mouseX = 0;
	        this.mouseY = 0;

	        this.windowHalfX = this.window.innerWidth / 2;
	        this.windowHalfY = this.window.innerHeight / 2;

	        this.clock = new THREE.Clock();
	        this.light1 = null;
	        this.light2 = null;
	        this.light3 = null;
	        this.light4 = null;

	        this.gDialCount = 6;
	        this.gDial = null;
	        this.gCounter = 0;

	        this.gCameraPosition = new THREE.Vector3(this.gDialCount / 2 * 50, 0, 550);
	        this.gCameraTarget = new THREE.Vector3(this.gDialCount / 2 * 50, 0, 0);

	        this.gZeroMoment = 0;
	        this.gLastSecondsLeft = 0;

	        this.document.addEventListener('mousemove', function (event) {
	            _this.onDocumentMouseMove(event);
	        }, false);

	        this.init();

	        this.animate();
	    }

	    /**
	     * init(): Initialize and load the scene
	     */


	    _createClass(MainEngine, [{
	        key: 'init',
	        value: function init() {
	            var _this2 = this;

	            this.gZeroMoment = Date.now() + 1200 * 1000; // 20 minutes into the future

	            this.container = this.document.getElementById('container');

	            this.camera = new THREE.PerspectiveCamera(30, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 10000);

	            this.camera.position.x = this.gCameraPosition.x;
	            this.camera.position.y = this.gCameraPosition.y;
	            this.camera.position.z = this.gCameraPosition.z;

	            this.scene = new THREE.Scene();

	            this.scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

	            // cene.add( camera );

	            // GROUND

	            var geometry = new THREE.PlaneBufferGeometry(16000, 16000);
	            var material = new THREE.MeshPhongMaterial({
	                emissive: 0x000000
	            });

	            var ground = new THREE.Mesh(geometry, material);
	            ground.position.set(0, this.FLOOR, 0);
	            ground.rotation.x = -Math.PI / 2;
	            /* scene.add( ground );*/

	            ground.receiveShadow = true;

	            // RENDERER

	            this.renderer = new THREE.WebGLRenderer({
	                antialias: true
	            });
	            this.renderer.setClearColor(this.scene.fog.color);
	            this.renderer.setPixelRatio(this.window.devicePixelRatio);
	            this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
	            this.renderer.domElement.style.position = "relative";

	            this.container.appendChild(this.renderer.domElement);

	            this.renderer.gammaInput = true;
	            this.renderer.gammaOutput = true;

	            this.renderer.shadowMap.enabled = true;

	            var sphere = new THREE.SphereGeometry(10.5, 16, 8);
	            this.light1 = new THREE.PointLight(0xffffff, 2, 550);
	            this.light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
	                color: 0xff0040
	            })));
	            this.scene.add(this.light1);
	            this.light2 = new THREE.PointLight(0x004040, 2, 550);
	            this.light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
	                color: 0x0040ff
	            })));
	            this.scene.add(this.light2);
	            this.light3 = new THREE.PointLight(0x300f00, 2, 550);
	            this.light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
	                color: 0x80ff80
	            })));
	            this.scene.add(this.light3);
	            this.light4 = new THREE.PointLight(0xff0000, 2, 550);
	            this.light4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
	                color: 0xffaa00
	            })));
	            this.scene.add(this.light4);

	            // STATS

	            this.stats = new Stats();
	            this.container.appendChild(this.stats.dom);

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

	            loaderPromise.then(function (object) {

	                _this2.gDial = new _NDigitDial2.default();

	                object.traverse(function (child) {

	                    if (child instanceof THREE.Mesh) {
	                        var diffuseColor = new THREE.Color(1, 1, 1);

	                        var material = new THREE.MeshPhongMaterial({
	                            color: diffuseColor
	                        });

	                        child.material = material;

	                        for (var i = 0; i < _this2.gDialCount; i += 1) {
	                            var dial = new THREE.Mesh(child.geometry, child.material);
	                            // here you can apply transformations, for this clone only
	                            dial.geometry.computeBoundingBox();
	                            dial.position.x = 0;
	                            dial.position.y = 0;
	                            dial.position.z = 0;

	                            _this2.scene.add(dial);

	                            var separatorGap = 0.0;
	                            var gapWidth = 10;
	                            if (i >= 2 && i < 4) {
	                                separatorGap = gapWidth;
	                            } else if (i >= 4) {
	                                separatorGap = gapWidth * 2;
	                            }

	                            var targetBBOX = new THREE.Box3({
	                                x: 50 * i - 20 + separatorGap,
	                                y: -200,
	                                z: -100
	                            }, {
	                                x: 50 * i + 20 + separatorGap,
	                                y: 200,
	                                z: 100
	                            });

	                            var dialRing = new _DialRing2.default(dial, i, targetBBOX, "easeNone");
	                            dialRing.ScheduleAngleInterpolation(0);
	                            _this2.gDial.AddNewDial(dialRing);
	                        }

	                        _this2.window.setInterval(function () {
	                            if (_this2.gDial === null) {
	                                return;
	                            }
	                            try {
	                                var seconds = Math.floor((_this2.gZeroMoment - Date.now()) / 1000);
	                                if (seconds === _this2.LastSecondsLeft) {
	                                    return;
	                                }

	                                var aHHMMSSString = DigitLib.toHHMMSS(String(seconds));

	                                _this2.gDial.SetDialsFromExactString(aHHMMSSString);
	                                _this2.LastSecondsLeft = seconds;
	                                _this2.gCounter += 1;
	                            } catch (e) {
	                                console.log("EXCEPTION: " + e.message);
	                            }
	                        }, 1000);
	                    }
	                });
	            }).catch(function (xhr) {
	                onError(xhr);
	            });

	            var tickerLoaderPromise = COLLADALoadPromise('assets/models/dae/ticker/ticker.dae', manager, onProgress);

	            tickerLoaderPromise.then(function (iColladaStuff) {
	                var model = iColladaStuff.scene;
	                var animations = iColladaStuff.animations;
	                var kfAnimationsLength = iColladaStuff.animations.length;
	                model.scale.x = model.scale.y = model.scale.z = 0.125; // 1/8 scale, modeled in cm
	                console.log("COLLADA LOAD OK");
	            }).catch(function (xhr) {
	                console.error("COLLADA LOAD FAILED");
	                onError(xhr);
	            });

	            // const loader = new THREE.OBJLoader(manager);
	            // loader.load('assets/models/obj/numbers_ring/numbers_ring.obj', , onProgress, onError);

	            this.window.addEventListener('resize', function () {
	                _this2.onWindowResize();
	            }, false);
	        }

	        /**
	         * onWindowResize(): Callback on Window Resize
	         */

	    }, {
	        key: 'onWindowResize',
	        value: function onWindowResize() {

	            this.windowHalfX = this.window.innerWidth / 2;
	            this.windowHalfY = this.indow.innerHeight / 2;

	            this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
	            this.camera.updateProjectionMatrix();

	            this.enderer.setSize(this.window.innerWidth, this.window.innerHeight);
	        }

	        /**
	         * onDocumentMouseMove(): Callback on Mouse Move
	         * @param {Event} event : mouse event from the DOM
	         */

	    }, {
	        key: 'onDocumentMouseMove',
	        value: function onDocumentMouseMove(event) {

	            this.mouseX = event.clientX - this.windowHalfX;
	            this.mouseY = event.clientY - this.windowHalfY;
	            console.log(this.mouseX.toString() + " " + this.mouseY.toString());
	        }

	        //
	        /**
	         * animate(): Animation initialization/callback
	         */

	    }, {
	        key: 'animate',
	        value: function animate() {
	            var _this3 = this;

	            this.window.requestAnimationFrame(function () {
	                _this3.animate();
	            });

	            var nowMS = Date.now();

	            if (this.gDial !== null) {
	                this.gDial.Animate(nowMS);
	            }

	            this.render();

	            this.stats.update();
	        }
	    }, {
	        key: 'render',
	        value: function render() {

	            var time = Date.now() * 0.0005;

	            var delta = this.clock.getDelta();

	            this.light1.position.x = 0;
	            this.light1.position.y = 100;
	            this.light1.position.z = 250;

	            this.light2.position.x = Math.cos(time * 0.3) * 100;
	            this.light2.position.y = Math.sin(time * 0.5) * 100;
	            this.light2.position.z = Math.sin(time * 0.7) * 100;

	            this.light3.position.x = Math.sin(time * 0.7) * 100;
	            this.light3.position.y = Math.cos(time * 0.3) * 100;
	            this.light3.position.z = Math.sin(time * 0.5) * 100;

	            this.light4.position.x = Math.sin(time * 0.3) * 300;
	            this.light4.position.y = Math.cos(time * 0.7) * 400;
	            this.light4.position.z = Math.sin(time * 0.5) * 300;

	            delta = 0.75 * this.clock.getDelta();

	            // camera.position.x += ( mouseX - camera.position.x ) * .05;
	            // camera.position.y = THREE.Math.clamp( camera.position.y + ( - mouseY - camera.position.y ) * .05, 0, 1000 );

	            // camera.lookAt(scene.position);
	            this.camera.lookAt(this.gCameraTarget);
	            if (this.mixer) {
	                // console.log( "updating mixer by " + delta );
	                this.mixer.update(delta);
	            }

	            this.renderer.render(this.scene, this.camera);
	        }
	    }]);

	    return MainEngine;
	}();

	exports.default = MainEngine;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global THREE */


	var _TweenFunc = __webpack_require__(3);

	var _AngleInterpolation = __webpack_require__(4);

	var _AngleInterpolation2 = _interopRequireDefault(_AngleInterpolation);

	var _DigitLib = __webpack_require__(5);

	var DigitLib = _interopRequireWildcard(_DigitLib);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DialRing = function () {
	    function DialRing(iMesh, iIndex, iTargetWorldSpaceBoundingBox, iTweenFunc) {
	        _classCallCheck(this, DialRing);

	        this.fMesh = iMesh;
	        this.fAngleRadians = 0.0;
	        this.fIndex = iIndex;
	        if (iMesh.geometry.boundingBox === null) {
	            iMesh.geometry.computeBoundingBox();
	        }

	        this.fTargetWorldSpaceBoundingBox = iTargetWorldSpaceBoundingBox;

	        // Place the geometry so its center is at the center of target bounding box.
	        // And so the width (delta X) is the same as width (delta X) of target boundingBox;

	        var targetWidth = this.fTargetWorldSpaceBoundingBox.max.x - this.fTargetWorldSpaceBoundingBox.min.x;
	        if (targetWidth < 0.00001) {
	            throw new Error("Incorrect target BBOX parameter");
	        }

	        var objectWidth = this.fMesh.geometry.boundingBox.max.x - this.fMesh.geometry.boundingBox.min.x;
	        if (objectWidth < 0.00001) {
	            throw new Error("Invalid mesh - too thin!");
	        }

	        this.fScaleFactor = targetWidth / objectWidth;

	        this.fBBOX = iMesh.geometry.boundingBox;
	        // Default pivot point is the center of bounding box.

	        this.fPivotPoint = this.fBBOX.center();

	        this.fMesh.matrixAutoUpdate = false;
	        this.fMesh.matrix.identity();
	        this.fAngleInterpolation = null;

	        if (_TweenFunc.TweenFunc.hasOwnProperty(iTweenFunc)) {
	            console.log("Function " + iTweenFunc + " accepted");
	        } else {
	            console.log("ERROR : No Tween Function " + iTweenFunc + " !");
	        }
	        this.fTweenFunc = iTweenFunc;
	        this.fForceAnimationDirection = 3;
	        // -1, if the digit increase, it will always be one step.
	        // -1, if the digit decreases, it will always be NINE steps.

	        // 1 = Forces all angles to be bigger than current angles.
	        // E.g. when asked to lerp from 20 degrees to 1, will lerp to 361
	        // 0 = No Forcing;
	        // -1 = Forces all angles to be smaller than current angles.
	        // E.g. when asked to lerp from 20 degrees to 1, will lerp to -359
	        // 2 = Forces minimal spin direction. (SHOULD BE DEFAULT FOR POSITIVE DIRECTION)
	        // Evaluates 1 and -1 option and picks one that results in minimal change.
	        // 3 = Forces maximal spin direction. (SHOULD BE DEFAULT FOR NEGATIVE DIRECTION / COUNTDOWN)
	        // Evaluates 1 and -1 option and picks one that results in maximal change.
	    }

	    _createClass(DialRing, [{
	        key: 'UpdatePosition',
	        value: function UpdatePosition() {
	            var pivot = this.fPivotPoint;
	            var toCenter = new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z);
	            // var fromCenter =
	            //     new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z);

	            var rotMatrix = new THREE.Matrix4().makeRotationX(this.fAngleRadians);
	            var scaleMatrix = new THREE.Matrix4().makeScale(this.fScaleFactor, this.fScaleFactor, this.fScaleFactor);
	            var newMatrix = new THREE.Matrix4();

	            // newMatrix.multiply(toCenter);
	            // newMatrix.multiply(rotMatrix);
	            // newMatrix.multiply(fromCenter);
	            // newMatrix.multiply(transMatrix);
	            // newMatrix.multiply(transMatrix);
	            // newMatrix.multiply(fromCenter);

	            var newPivotPosition = this.fTargetWorldSpaceBoundingBox.center();

	            var transToNewPivotMatrix = new THREE.Matrix4().makeTranslation(newPivotPosition.x, newPivotPosition.y, newPivotPosition.z);

	            newMatrix.multiply(transToNewPivotMatrix);
	            newMatrix.multiply(rotMatrix);
	            newMatrix.multiply(scaleMatrix);
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
	            this.ScheduleAngleInterpolation(this.fAngleRadians + DigitLib.DegreesToRadians(36.0));
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

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _TweenFunc = __webpack_require__(3);

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

/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _DigitLib = __webpack_require__(5);

	var DigitLib = _interopRequireWildcard(_DigitLib);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	                this.fDialRings[i].ScheduleAngleInterpolation(DigitLib.NumberToAngle(digit));
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
	            var sAnimationMode = 4; // All modes other than 4 are just for debugging.
	            // Animations should be set externally,
	            // and all this class has to do is call ProcessAnimation() on all the rings

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

/***/ }
/******/ ]);