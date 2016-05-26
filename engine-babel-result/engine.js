'use strict';

var _DialRing = require('./DialRing');

var _DialRing2 = _interopRequireDefault(_DialRing);

var _NDigitDial = require('./NDigitDial');

var _NDigitDial2 = _interopRequireDefault(_NDigitDial);

var _DigitLib = require('./DigitLib');

var DigitLib = _interopRequireWildcard(_DigitLib);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCREEN_WIDTH = window.innerWidth; /* global THREE */
/* global window */
/* global document */
/* global Stats */

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

var gZeroMoment = 0;
var gLastSecondsLeft = 0;

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
    gZeroMoment = Date.now() + 120000;

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

    loaderPromise.then(function (object) {

        gDial = new _NDigitDial2.default();

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
                    gDial.AddNewDial(dialRing);
                }

                // window.setInterval(() => {
                //     if (gDial !== null) {
                //         try {
                //
                //             gDial.SetDialsFromInt(gCounter);
                //             gCounter += 1;
                //         } catch (e) {
                //             console.log("EXCEPTION: " + e.message);
                //         }
                //     }
                // }, 1000);

                window.setInterval(function () {
                    if (gDial === null) {
                        return;
                    }
                    try {
                        var seconds = Math.floor((gZeroMoment - Date.now()) / 1000);
                        if (seconds === gLastSecondsLeft) {
                            return;
                        }

                        var aHHMMSSString = DigitLib.toHHMMSS(String(seconds));

                        gDial.SetDialsFromExactString(aHHMMSSString);
                        gLastSecondsLeft = seconds;
                        gCounter += 1;
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