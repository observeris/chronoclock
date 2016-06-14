'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global THREE */
/* global Stats */

var _DialRing = require('./DialRing');

var _DialRing2 = _interopRequireDefault(_DialRing);

var _NDigitDial = require('./NDigitDial');

var _NDigitDial2 = _interopRequireDefault(_NDigitDial);

var _DigitLib = require('./DigitLib');

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