var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -250;

var container, stats;

var camera, scene, sceneAnimationClip;
var renderer;

var mesh, helper;

var mixer;

var mouseX = 0,
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

var light1, light2, light3, light4;

var gDialCount = 6;

var gCameraPosition = new THREE.Vector3(gDialCount / 2 * 50, 0, 550);
var gCameraTarget = new THREE.Vector3(gDialCount / 2 * 50, 0, 0);
var gDials = new Array();

document.addEventListener('mousemove', onDocumentMouseMove, false);

init();
animate();

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);

    camera.position.x = gCameraPosition.x;
    camera.position.y = gCameraPosition.y;
    camera.position.z = gCameraPosition.z;

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    //scene.add( camera );

    // GROUND

    var geometry = new THREE.PlaneBufferGeometry(16000, 16000);
    var material = new THREE.MeshPhongMaterial({
        emissive: 0x000000
    });

    var ground = new THREE.Mesh(geometry, material);
    ground.position.set(0, FLOOR, 0);
    ground.rotation.x = -Math.PI / 2;
    /*scene.add( ground );*/

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

    var onError = function(xhr) {};

    var loader = new THREE.OBJLoader(manager);
    loader.load('assets/models/obj/numbers_ring/numbers_ring.obj', function(object) {


        object.traverse(function(child) {

            if (child instanceof THREE.Mesh) {
                var diffuseColor = new THREE.Color(1, 1, 1);

                var material = new THREE.MeshPhongMaterial({
                    color: diffuseColor
                })

                child.material = material;

                for (var i = 0; i < gDialCount; i++) {
                    var clone = new THREE.Mesh(child.geometry, child.material);
                    // here you can apply transformations, for this clone only
                    clone.position.x = 0;
                    //50 * i;
                    clone.position.y = 0;
                    //200;
                    clone.position.z = 0;

                    scene.add(clone);

                    gDials.push(clone);
                }


            }

        });


        // object.position.x = 0;
        // object.position.y = 200;
        // object.position.z = 0;
        //
        // scene.add(object);


    }, onProgress, onError);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {


    var time = Date.now() * 0.0005;
    var nowMS = Date.now();
    var delta = clock.getDelta();
    var d = 0;
    for (d = 0; d < gDials.length; d++) {
        var dial = gDials[d];
        // dial.rotation.x = 0;
        // dial.rotation.y = 0;
        // dial.rotation.z = 0;
        // clone.position.x = ;
        // clone.position.y = 200;
        // clone.position.z = 0;
        //
        //
        // dial.rotation.x = Math.PI * ((nowMS % 1000) / 1000.0);
        // dial.position.x = 0;
        // dial.position.y = 0;
        // dial.position.z = 0;
        dial.matrixAutoUpdate = false;

        dial.matrix.identity();
        var bbox = new THREE.Box3().setFromObject(dial);

        bbox.center = new THREE.Vector3((bbox.max.x + bbox.min.x) * 0.5,
            (bbox.max.y + bbox.min.y) * 0.5,
            (bbox.max.z + bbox.min.z) * 0.5);

        var toCenter = new THREE.Matrix4().makeTranslation(-bbox.center.x, -bbox.center.y, -bbox.center.z);
        var fromCenter = new THREE.Matrix4().makeTranslation(+bbox.center.x, +bbox.center.y, +bbox.center.z);


        var rotMatrix = new THREE.Matrix4().makeRotationX(2 * Math.PI * ((nowMS % 5000) / 5000.0));
        var transMatrix = new THREE.Matrix4().makeTranslation(50 * d, 200, 0);

        var newMatrix = new THREE.Matrix4();

        // newMatrix.multiply(toCenter);
        // newMatrix.multiply(rotMatrix);
        // newMatrix.multiply(fromCenter);
        // newMatrix.multiply(transMatrix);
        newMatrix.multiply(transMatrix);
        newMatrix.multiply(fromCenter);
        newMatrix.multiply(rotMatrix);
        newMatrix.multiply(toCenter);




        //dial.matrix.multiplyMatrices(rotMatrix, transMatrix);


        dial.matrix = newMatrix;
        //applyMatrix();
        // dial.rotation.x = Math.PI * ((nowMS % 1000) / 1000.0);
        // dial.rotation.x = Math.PI * ((nowMS % 1000) / 1000.0);


        //dial.applyMatrix(new THREE.Matrix4().makeRotationX();;
        //dial.applyMatrix(new THREE.Matrix4().makeTranslation(0, -6, 0));
    }


    //if( object ) object.rotation.y -= 0.5 * delta;
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

    var delta = 0.75 * clock.getDelta();

    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y = THREE.Math.clamp( camera.position.y + ( - mouseY - camera.position.y ) * .05, 0, 1000 );


    // camera.lookAt(scene.position);
    camera.lookAt(gCameraTarget);
    if (mixer) {
        //console.log( "updating mixer by " + delta );
        mixer.update(delta);
    }

    renderer.render(scene, camera);

}
