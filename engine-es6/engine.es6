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

const gDialCount = 6;
let gDial = null;

const gCameraPosition = new THREE.Vector3(gDialCount / 2 * 50, 0, 550);
const gCameraTarget = new THREE.Vector3(gDialCount / 2 * 50, 0, 0);

const R2D = 180.0 / Math.PI;
const D2R = 1.0 / R2D;

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

    /*
    		t - current time of tween
    		b - starting value of property
    		c - change needed in value
    		d - total duration of tween
    	*/

    // Ref: http://tweener.ivank.net/tw.js
    var TweenFunc = {
        /*
        	t - current time of tween
        	b - starting value of property
        	c - change needed in value
        	d - total duration of tween
        */

        // Handy tweener visualizations: http://hosted.zeh.com.br/tweener/docs/en-us/misc/transitions.html
        easeNone: function(t, b, c, d) {
            return c * t / d + b;
        },
        easeInQuad: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            t -= 1;
            return -c / 2 * ((t) * (t - 2) - 1) + b;
        },
        easeInCubic: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeOutInCubic: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeOutCubic(t * 2, b, c / 2, d);
            }
            return TweenFunc.easeInCubic((t * 2) - d, b + c / 2, c / 2, d);
        },
        easeInQuart: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t + b;
            }
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeOutInQuart: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeOutQuart(t * 2, b, c / 2, d);
            }
            return TweenFunc.easeInQuart((t * 2) - d, b + c / 2, c / 2, d);
        },
        easeInQuint: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeOutInQuint: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeOutQuint(t * 2, b, c / 2, d);
            }
            return TweenFunc.easeInQuint((t * 2) - d, b + c / 2, c / 2, d);
        },
        easeInSine: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeOutInSine: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeOutSine(t * 2, b, c / 2, d);
            }
            return TweenFunc.easeInSine((t * 2) - d, b + c / 2, c / 2, d);
        },
        easeInExpo: function(t, b, c, d) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
        },
        easeOutExpo: function(t, b, c, d) {
            return (t === d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function(t, b, c, d) {
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
        easeOutInExpo: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeOutExpo(t * 2, b, c / 2, d);
            }
            return TweenFunc.easeInExpo((t * 2) - d, b + c / 2, c / 2, d);
        },
        easeInCirc: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeOutInCirc: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeOutCirc(t * 2, b, c / 2, d);
            }
            return TweenFunc.easeInCirc((t * 2) - d, b + c / 2, c / 2, d);
        },
        easeInElastic: function(t, b, c, d, a, p) {
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
        easeOutElastic: function(t, b, c, d, a, p) {
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
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOutElastic: function(t, b, c, d, a, p) {
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
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 *
                    Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 +
                c + b;
        },
        easeOutInElastic: function(t, b, c, d, a, p) {
            if (t < d / 2) {
                return TweenFunc.easeOutElastic(t * 2, b, c / 2, d, a, p);
            }
            return TweenFunc.easeInElastic((t * 2) - d, b + c / 2, c / 2, d, a, p);
        },
        easeInBack: function(t, b, c, d, s) {
            if (typeof s === 'undefined') {
                s = 1.70158;
            }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function(t, b, c, d, s) {
            if (typeof s === 'undefined') {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function(t, b, c, d, s) {
            if (typeof s === 'undefined') {
                s = 1.70158;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeOutInBack: function(t, b, c, d, s) {
            if (t < d / 2) {
                return TweenFunc.easeOutBack(t * 2, b, c / 2, d, s);
            }
            return TweenFunc.easeInBack((t * 2) - d, b + c / 2, c / 2, d, s);
        },
        easeInBounce: function(t, b, c, d) {
            return c - TweenFunc.easeOutBounce(d - t, 0, c, d) + b;
        },
        easeOutBounce: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            }

            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        },
        easeInOutBounce: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
            }
            return TweenFunc.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;

        },
        easeOutInBounce: function(t, b, c, d) {
            if (t < d / 2) {
                return TweenFunc.easeOutBounce(t * 2, b, c / 2, d);
            }
            return TweenFunc.easeInBounce((t * 2) - d, b + c / 2, c / 2, d);
        }
    };

    class AngleInterpolation {
        constructor(iStartTime, iEndTime, iStartAngle, iEndAngle, iTweenFunc) {
            this.fStartTime = Number(iStartTime);
            this.fEndTime = Number(iEndTime);
            this.fStartAngle = iStartAngle;
            this.fEndAngle = iEndAngle;

            this.fTweenFunc = iTweenFunc;
        }

        LerpAngleConst(iCurrentTime) {
            const normalizedLerpTime = (iCurrentTime - this.fStartTime) /
                (this.fEndTime - this.fStartTime);

            const t = iCurrentTime - this.fStartTime;
            const b = this.fStartAngle;
            const c = this.fEndAngle - this.fStartAngle;
            const d = this.fEndTime - this.fStartTime;

            let lerpedAngle = this.fStartAngle;
            if (normalizedLerpTime >= 0.0 && normalizedLerpTime < 1.0) {
                const tweenFunc = TweenFunc[this.fTweenFunc];

                lerpedAngle = tweenFunc(t, b, c, d);

            } else if (normalizedLerpTime >= 1.0) {
                lerpedAngle = this.fEndAngle;
            }

            return lerpedAngle;
        }

        IsAnimationDoneConst(iCurrentTime) {
            if (iCurrentTime > this.fEndTime) {
                return true;
            }

            return false;
        }
    }

    class DialRing {
        constructor(iMesh, iIndex, iTweenFunc) {
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

            if (TweenFunc.hasOwnProperty(iTweenFunc)) {
                console.log("Function " + iTweenFunc + " accepted");
            } else {
                console.log("ERROR : No Tween Function " + iTweenFunc + " !");
            }
            this.fTweenFunc = iTweenFunc;
        }

        UpdatePosition() {
            const pivot = this.fPivotPoint;
            var toCenter =
                new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z);
            var fromCenter =
                new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z);

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

        ScheduleAngleInterpolation(iNewAngleValue) {
            const lerpStruct = new AngleInterpolation(Date.now(), Date.now() + 700, this.fAngleRadians,
                iNewAngleValue, this.fTweenFunc);
            this.fAngleInterpolation = lerpStruct;
        }

        ScheduleDialAdvance() {
            this.ScheduleAngleInterpolation(this.fAngleRadians + D2R * 36.0);
        }

        ProcessAnimation(iCurrentTime) {
            if (this.fAngleInterpolation !== null) {

                const lerpedAngle = this.fAngleInterpolation.LerpAngleConst(iCurrentTime);

                if (this.fAngleInterpolation.IsAnimationDoneConst(iCurrentTime)) {
                    this.fAngleInterpolation = null;
                }

                this.SetAngle(lerpedAngle);
            }
        }

    }

    let gLastSwitch = Number(0);
    const gLastSwitchArray = [
        Number(0),
        Number(0),
        Number(0),
        Number(0),
        Number(0)
    ];

    class NDigitDial {
        constructor() {
            this.fDialRings = [];
        }

        SetDials(iNumberString) {
            if (typeof iNumberString !== 'string') {
                throw new Error("Number must be a string");
            }
            if (iNumberString.length !== this.fDialRings.length) {
                throw new Error("String length mismatch");
            }

            const intValue = Number.parseInt(iNumberString, 10);
            if (intValue.toString(10) !== iNumberString) {
                throw new Error("Not a proper integer number");
            }

        }

        AddNewDial(iDial) {
            this.fDialRings.push(iDial);
        }

        Animate(nowMS) {
            const sAnimationMode = 3;

            if (this.fDialRings.length <= 0) {
                return;
            }

            if (sAnimationMode === 0) {
                // Continuous animation of all
                let d = 0;

                for (d = 0; d < this.fDialRings.length; d += 1) {
                    var dialRing = this.fDialRings[d];
                    dialRing.SetAngle(2 * Math.PI * ((nowMS % 5000) / 5000.0));
                }
            } else if (sAnimationMode === 1) {
                // Variated animation of all

                this.fDialRings[0].SetAngle(2 * Math.PI * ((nowMS % 5000) / 5000.0));
                this.fDialRings[1].SetAngle(2 * Math.PI * ((nowMS % 4000) / 4000.0));
                this.fDialRings[2].SetAngle(2 * Math.PI * ((nowMS % 3000) / 3000.0));
                this.fDialRings[3].SetAngle(2 * Math.PI * ((nowMS % 2000) / 2000.0));
                this.fDialRings[4].SetAngle(2 * Math.PI * ((nowMS % 1000) / 1000.0));
                this.fDialRings[5].SetAngle(2 * Math.PI * ((nowMS % 100) / 100.0));
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
            }
        }

    }

    loaderPromise.then((object) => {

        gDial = new NDigitDial();

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

                    const dialRing = new DialRing(dial, i, "easeNone");
                    gDial.AddNewDial(dialRing);
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

    const nowMS = Date.now();

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

    const time = Date.now() * 0.0005;

    let delta = clock.getDelta();

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
