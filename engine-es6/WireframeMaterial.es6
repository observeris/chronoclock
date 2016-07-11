import THREE from 'three';
import vertShader from './WireframeVertexShader.vert';
import fragShader from './WireframeFragmentShader.frag';

export default class WireframeMaterial {
    constructor() {
        this.fMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: vertShader,
            fragmentShader: fragShader
        });

        this.fMaterial.extensions.derivatives = true;
    }

    static SetupWireframeShaderAttributes(ioGeometry) {

        var vectors = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 1)
        ];
        var position = ioGeometry.attributes.position;
        var centers = new Float32Array(position.count * 3);
        for (var i = 0, l = position.count; i < l; i += 1.0) {
            vectors[i % 3].toArray(centers, i * 3);
        }
        ioGeometry.addAttribute('center', new THREE.BufferAttribute(centers, 3));
    }

}
