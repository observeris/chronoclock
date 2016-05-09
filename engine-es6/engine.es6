/* global THREE */
/* global window */
/* global document */
/* global Stats */
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const FLOOR = -250;

let container;
let stats;

let camera;
let scene;

let renderer;
let mixer;

/* Unused stuff */
// var sceneAnimationClip;
// var mesh;
// var helper;
let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const clock = new THREE.Clock();

var light1;
var light2;
var light3;
var light4;

var gDialCount = 6;

const gCameraPosition = new THREE.Vector3(gDialCount / 2 * 50, 0, 550);
const gCameraTarget = new THREE.Vector3(gDialCount / 2 * 50, 0, 0);
const gDials = [];
const gDialRings = [];

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
    const loaderPromise = new Promise((iResolveFunc, iRejectFunc) => {

        const loader = new THREE.OBJLoader(iLoadingManager);
        loader.load(iOBJPath, (iObject) => {
            iResolveFunc(iObject);
        }, (xhr) => {
            iProgressCallback(xhr);
        }, (xhr) => {
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
    manager.onProgress = function(item, loaded, total) {

        console.log(item, loaded, total);

    };

    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function( /* xhr */ ) {

    };
    const loaderPromise = OBJLoadPromise('assets/models/obj/numbers_ring/numbers_ring.obj', manager,
        onProgress);

    class DialRing {
        constructor(iMesh, iIndex) {
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
        }

        UpdatePosition() {
            var toCenter =
                new THREE.Matrix4().makeTranslation(-this.fPivotPoint.x, -this.fPivotPoint.y, -
                    this.fPivotPoint.z);
            var fromCenter =
                new THREE.Matrix4().makeTranslation(this.fPivotPoint.x, this.fPivotPoint.y,
                    this.fPivotPoint.z);

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

        SetAngle(iAngle) {
            this.fAngleRadians = iAngle;
            this.UpdatePosition();

        }
    }

    loaderPromise.then((object) => {

        object.traverse((child) => {

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

                    const dialRing = new DialRing(dial, i);
                    gDialRings.push(dialRing);
                }

            }

        });

    }).catch((xhr) => {
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

    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
    console.log(mouseX.toString() + " " + mouseY.toString());

}

//
/**
 * animate(): Animation initialization/callback
 */
function animate() {

    window.requestAnimationFrame(animate);

    render();
    stats.update();

}

/**
 * render(): Rendering happens here.
 */
function render() {

    const time = Date.now() * 0.0005;
    const nowMS = Date.now();
    let delta = clock.getDelta();
    let d = 0;
    // for (d = 0; d < gDials.length; d += 1) {
    //     var dial = gDials[d];
    //     // dial.rotation.x = 0;
    //     // dial.rotation.y = 0;
    //     // dial.rotation.z = 0;
    //     // clone.position.x = ;
    //     // clone.position.y = 200;
    //     // clone.position.z = 0;
    //     //
    //     //
    //     // dial.rotation.x = Math.PI * ((nowMS % 1000) / 1000.0);
    //     // dial.position.x = 0;
    //     // dial.position.y = 0;
    //     // dial.position.z = 0;
    //     dial.matrixAutoUpdate = false;
    //
    //     dial.matrix.identity();
    //     var bbox = new THREE.Box3().setFromObject(dial);
    //
    //     bbox.center = new THREE.Vector3((bbox.max.x + bbox.min.x) * 0.5,
    //         (bbox.max.y + bbox.min.y) * 0.5,
    //         (bbox.max.z + bbox.min.z) * 0.5);
    //
    //     var toCenter = new THREE.Matrix4().makeTranslation(-bbox.center.x, -bbox.center.y, -bbox.center.z);
    //     var fromCenter = new THREE.Matrix4().makeTranslation(bbox.center.x, bbox.center.y, bbox.center.z);
    //
    //     var rotMatrix = new THREE.Matrix4().makeRotationX(2 * Math.PI * ((nowMS % 5000) / 5000.0));
    //     var transMatrix = new THREE.Matrix4().makeTranslation(50 * d, 200, 0);
    //
    //     var newMatrix = new THREE.Matrix4();
    //
    //     // newMatrix.multiply(toCenter);
    //     // newMatrix.multiply(rotMatrix);
    //     // newMatrix.multiply(fromCenter);
    //     // newMatrix.multiply(transMatrix);
    //     newMatrix.multiply(transMatrix);
    //     newMatrix.multiply(fromCenter);
    //     newMatrix.multiply(rotMatrix);
    //     newMatrix.multiply(toCenter);
    //
    //     dial.matrix = newMatrix;
    // }

    for (d = 0; d < gDialRings.length; d += 1) {
        var dialRing = gDialRings[d];
        dialRing.SetAngle(2 * Math.PI * ((nowMS % 5000) / 5000.0));
        dialRing.UpdatePosition();
    }

    // if( object ) object.rotation.y -= 0.5 * delta;
    // light1.position.x = Math.sin( time * 0.7 ) * 100;
    // light1.position.y = Math.cos( time * 0.5 ) * 100;
    // light1.position.z = Math.cos( time * 0.3 ) * 100;

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
