'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global THREE */
/* global window */
/* global document */
/* global Stats */
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

var gCameraPosition = new THREE.Vector3(gDialCount / 2 * 50, 0, 550);
var gCameraTarget = new THREE.Vector3(gDialCount / 2 * 50, 0, 0);
var gDials = [];
var gDialRings = [];
var R2D = 180.0 / Math.PI;
var D2R = 1.0 / R2D;

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

    /**
     * OBJLoadPromise(): Returns a promist to load OBJ
     * @param {Number} min relative to web root
     * @param {Number} max, instance of THREE.LoadingManager()
     * @param {Number} value, progress callback()
     * @return {Number} smooth value (0-1)
     */
    function smoothstep(min, max, value) {
        var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
    }

    var AngleInterpolation = function () {
        function AngleInterpolation(iStartTime, iEndTime, iStartAngle, iEndAngle, iLerpType) {
            _classCallCheck(this, AngleInterpolation);

            this.fStartTime = Number(iStartTime);
            this.fEndTime = Number(iEndTime);
            this.fStartAngle = iStartAngle;
            this.fEndAngle = iEndAngle;
            this.fLerpType = iLerpType || "linear";
        }

        _createClass(AngleInterpolation, [{
            key: 'TransferNormalizedLerp',
            value: function TransferNormalizedLerp(iT) {
                if (this.fLerpType === "linear") {
                    return iT;
                } else if (this.fLerpType === "smoothstep") {
                    return smoothstep(0.0, 1.0, iT);
                }
                return iT;
            }
        }, {
            key: 'LerpAngleConst',
            value: function LerpAngleConst(iCurrentTime) {
                var normalizedLerpTime = (iCurrentTime - this.fStartTime) / (this.fEndTime - this.fStartTime);

                var lerpedAngle = this.fStartAngle;
                if (normalizedLerpTime >= 0.0 && normalizedLerpTime < 1.0) {
                    var transferdLerp = this.TransferNormalizedLerp(normalizedLerpTime);
                    lerpedAngle = (1.0 - transferdLerp) * this.fStartAngle + transferdLerp * this.fEndAngle;
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

    var DialRing = function () {
        function DialRing(iMesh, iIndex, iLerpType) {
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
            this.fLerpType = iLerpType;
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
                var lerpStruct = new AngleInterpolation(Date.now(), Date.now() + 200, this.fAngleRadians, iNewAngleValue, this.fLerpType);
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

    loaderPromise.then(function (object) {

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

                    gDials.push(dial);

                    var dialRing = new DialRing(dial, i, "linear");
                    gDialRings.push(dialRing);
                }
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

var gLastSwitch = Number(0);

//
/**
 * animate(): Animation initialization/callback
 */
function animate() {

    window.requestAnimationFrame(animate);

    var nowMS = Date.now();
    var sAnimationMode = 2;

    if (gDialRings.length <= 0) {
        return;
    }

    if (sAnimationMode === 0) {
        // Continuous animation of all
        var d = 0;

        for (d = 0; d < gDialRings.length; d += 1) {
            var dialRing = gDialRings[d];
            dialRing.SetAngle(2 * Math.PI * (nowMS % 5000 / 5000.0));
        }
    } else if (sAnimationMode === 1) {
        // Variated animation of all

        gDialRings[0].SetAngle(2 * Math.PI * (nowMS % 5000 / 5000.0));
        gDialRings[1].SetAngle(2 * Math.PI * (nowMS % 4000 / 4000.0));
        gDialRings[2].SetAngle(2 * Math.PI * (nowMS % 3000 / 3000.0));
        gDialRings[3].SetAngle(2 * Math.PI * (nowMS % 2000 / 2000.0));
        gDialRings[4].SetAngle(2 * Math.PI * (nowMS % 1000 / 1000.0));
        gDialRings[5].SetAngle(2 * Math.PI * (nowMS % 100 / 100.0));
    } else if (sAnimationMode === 2) {
        // Variated animation of all
        if (nowMS - gLastSwitch > 1000) {
            gDialRings[0].ScheduleDialAdvance();
            gLastSwitch = nowMS;
        }
        gDialRings[0].ProcessAnimation(nowMS);
        gDialRings[1].SetAngle(0);
        gDialRings[2].SetAngle(0);
        gDialRings[3].SetAngle(0);
        gDialRings[4].SetAngle(0);
        gDialRings[5].SetAngle(0);
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