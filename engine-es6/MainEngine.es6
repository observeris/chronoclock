/* global Stats */

import DialRing from './DialRing';
import NDigitDial from './NDigitDial';
import * as DigitLib from './DigitLib';
import WireframeMaterial from './WireframeMaterial';
import THREE from 'three';
import OBJLoader from 'OBJLoader';
import KeyFrameAnimation from 'collada/KeyFrameAnimation';
import ColladaLoader from 'collada/ColladaLoader';

ColladaLoader(THREE);
KeyFrameAnimation(THREE);
OBJLoader(THREE);

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
 * OBJLoadPromise(): Returns a promist to load OBJ
 * @param {String} iCOLLADAPath relative to web root
 * @param {THREE.LoadingManager} iLoadingManager, instance of THREE.LoadingManager()
 * @param {function} iProgressCallback, progress callback()
 * @return {Promise} A Promise that's resolved with an THREE object.
 */
function COLLADALoadPromise(iCOLLADAPath, iLoadingManager, iProgressCallback) {
    const loaderPromise = new Promise((iResolveFunc, iRejectFunc) => {

        const loader = new THREE.ColladaLoader();

        loader.load(iCOLLADAPath, (iColladaStuff) => {
            iResolveFunc(iColladaStuff);
        }, (xhr) => {
            iProgressCallback(xhr);
        }, (xhr) => {
            iRejectFunc(xhr);
        });

    });

    return loaderPromise;
}

export default class MainEngine {
    constructor(iDocument, iWindow) {
        this.window = iWindow;
        this.document = iDocument;

        this.SCREEN_WIDTH = this.window.innerWidth;
        this.SCREEN_HEIGHT = this.window.innerHeight;
        this.FLOOR = -250;

        this.container = null;
        this.stats = null;

        this.camera = null;
        this.scene = null;

        // Keyframe animation stuff: (gets loaded from COLLADA)
        this.kfAnimationsLength = 0;
        this.kfAnimations = [];
        this.kfLastTimeStamp = 0;
        this.kfProgress = 0;

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

        this.gCameraPosition = new THREE.Vector3(this.gDialCount / 2 * 50 + 200, 100, 1250);
        this.gCameraTarget = new THREE.Vector3(this.gDialCount / 2 * 50, 50, 0);

        this.gZeroMoment = 0;
        this.gLastSecondsLeft = 0;

        this.fOBJWireFrame = false;
        this.fCOLLADAWireFrame = true;

        this.document.addEventListener('mousemove', (event) => {
            this.onDocumentMouseMove(event);
        }, false);

        this.init();

        this.animate();
    }

    /**
     * init(): Initialize and load the scene
     */
    init() {
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

        loaderPromise.then((object) => {

            this.gDial = new NDigitDial();

            object.traverse((child) => {

                if (child instanceof THREE.Mesh) {
                    var diffuseColor = new THREE.Color(1, 1, 1);

                    var material = new THREE.MeshPhongMaterial({
                        color: diffuseColor
                    });

                    if (this.fOBJWireFrame) {
                        WireframeMaterial.SetupWireframeShaderAttributes(child.geometry);
                        const wireframeMaterial = new WireframeMaterial();
                        child.material = wireframeMaterial.fMaterial;
                    } else {
                        child.material = material;
                    }
                    for (var i = 0; i < this.gDialCount; i += 1) {
                        var dial = new THREE.Mesh(child.geometry, child.material);
                        // here you can apply transformations, for this clone only
                        dial.geometry.computeBoundingBox();
                        dial.position.x = 0;
                        dial.position.y = 0;
                        dial.position.z = 0;

                        this.scene.add(dial);

                        let separatorGap = 0.0;
                        const gapWidth = 10;
                        if (i >= 2 && i < 4) {
                            separatorGap = gapWidth;
                        } else if (i >= 4) {
                            separatorGap = gapWidth * 2;
                        }

                        const targetBBOX = new THREE.Box3({
                            x: 50 * i - 20 + separatorGap,
                            y: -200,
                            z: -100
                        }, {
                            x: 50 * i + 20 + separatorGap,
                            y: 200,
                            z: 100
                        });

                        const dialRing = new DialRing(dial, i, targetBBOX, "easeNone");
                        dialRing.ScheduleAngleInterpolation(0);
                        this.gDial.AddNewDial(dialRing);
                    }

                    this.window.setInterval(() => {
                        if (this.gDial === null) {
                            return;
                        }
                        try {
                            const seconds = Math.floor((this.gZeroMoment - Date.now()) /
                                1000);
                            if (seconds === this.LastSecondsLeft) {
                                return;
                            }

                            const aHHMMSSString = DigitLib.toHHMMSS(String(
                                seconds));

                            this.gDial.SetDialsFromExactString(aHHMMSSString);
                            this.LastSecondsLeft = seconds;
                            this.gCounter += 1;
                        } catch (e) {
                            console.log("EXCEPTION: " + e.message);
                        }

                    }, 1000);
                }

            });

        }).catch((xhr) => {
            onError(xhr);
        });
        // COLLADALoadPromise('assets/models/dae/mecha/mecha8.dae',
        const tickerLoaderPromise = COLLADALoadPromise(
            'assets/models/dae/gear-system/animatedmechanism.dae',
            manager,
            onProgress);

        tickerLoaderPromise.then((iColladaStuff) => {
            const model = iColladaStuff.scene;

            model.position.x = 120;
            model.position.y = 0;
            model.position.z = 0;

            model.scale.x = model.scale.y = model.scale.z = 1.325; // 1/8 scale, modeled in cm
            model.scale.x = 1.6;
            model.rotateX(-Math.PI / 2);

            // KeyFrame Animations
            this.kfAnimationsLength = iColladaStuff.animations.length;

            for (var i = 0; i < this.kfAnimationsLength; i += 1) {

                var animation = iColladaStuff.animations[i];

                const kfAnimation = new THREE.KeyFrameAnimation(animation);
                kfAnimation.timeScale = 1;
                this.kfAnimations.push(kfAnimation);

            }

            model.traverse((child) => {

                if (child instanceof THREE.Mesh) {

                    if (this.fCOLLADAWireFrame) {
                        const geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);

                        WireframeMaterial.SetupWireframeShaderAttributes(geometry);
                        const wireframeMaterial = new WireframeMaterial();

                        child.geometry = geometry;
                        child.material = wireframeMaterial.fMaterial;
                    }
                }
            });
            console.log("COLLADA LOAD OK");

            this.scene.add(model);

            this.keyframeAnimationStart();

        }).catch((xhr) => {
            console.error("COLLADA LOAD FAILED");
            onError(xhr);
        });

        // const loader = new THREE.OBJLoader(manager);
        // loader.load('assets/models/obj/numbers_ring/numbers_ring.obj', , onProgress, onError);

        this.window.addEventListener('resize', () => {
            this.onWindowResize();
        }, false);
    }

    /**
     * onWindowResize(): Callback on Window Resize
     */
    onWindowResize() {

        this.windowHalfX = this.window.innerWidth / 2;
        this.windowHalfY = this.window.innerHeight / 2;

        this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.enderer.setSize(this.window.innerWidth, this.window.innerHeight);
    }

    /**
     * onDocumentMouseMove(): Callback on Mouse Move
     * @param {Event} event : mouse event from the DOM
     */
    onDocumentMouseMove(event) {

        this.mouseX = (event.clientX - this.windowHalfX);
        this.mouseY = (event.clientY - this.windowHalfY);
        console.log(this.mouseX.toString() + " " + this.mouseY.toString());

    }

    keyframeAnimationStart() {

        for (let i = 0; i < this.kfAnimationsLength; i += 1) {

            const animation = this.kfAnimations[i];

            for (let h = 0; h < animation.hierarchy.length; h += 1) {

                const keys = animation.data.hierarchy[h].keys;
                const sids = animation.data.hierarchy[h].sids;
                const obj = animation.hierarchy[h];

                if (keys.length && sids) {
                    for (var s = 0; s < sids.length; s += 1) {

                        const sid = sids[s];
                        const next = animation.getNextKeyWith(sid, h, 0);

                        if (next) {
                            next.apply(sid);
                        }
                    }
                    obj.matrixAutoUpdate = false;
                    animation.data.hierarchy[h].node.updateMatrix();
                    obj.matrixWorldNeedsUpdate = true;
                }

            }

            animation.loop = false;
            animation.play();
        }
    }

    keyframeAnimationAnimate(timestamp) {
        if (this.kfAnimationsLength <= 0) {
            return;
        }

        const kAnimationDurationInSeconds = 3.40;
        const frameTime = (timestamp - this.kfLastTimeStamp) * 0.001;

        if (this.kfProgress >= 0 && this.kfProgress < kAnimationDurationInSeconds) {

            for (let i = 0; i < this.kfAnimationsLength; i += 1) {

                this.kfAnimations[i].update(frameTime);

            }

        } else if (this.kfProgress >= kAnimationDurationInSeconds) {

            for (let i = 0; i < this.kfAnimationsLength; i += 1) {

                this.kfAnimations[i].stop();

            }

            this.kfProgress = 0;
            this.keyframeAnimationStart();

        }

        this.kfProgress += frameTime;
        this.kfLastTimeStamp = timestamp;

        // console.log("Progress: ", this.kfProgress);
    }

    /**
     * animate(): Animation initialization/callback
     */
    animate() {

        this.window.requestAnimationFrame(() => {
            this.animate();
        });

        const nowMS = Date.now();

        if (this.gDial !== null) {
            this.gDial.Animate(nowMS);
        }

        this.keyframeAnimationAnimate(nowMS);

        this.render();

        this.stats.update();
    }

    render() {

        const time = Date.now() * 0.0005;

        let delta = this.clock.getDelta();

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
}
