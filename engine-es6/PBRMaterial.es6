import {
    generateImageBasedLight
} from './cpina/common/ibl/ImageBasedLightGenerator';
import PBRFrag from './cpina/common/ibl/PhysicallyBased.frag';
import PBRVert from './cpina/common/StandardRawTBN.vert';
import iblMapUrl from './cpina/HDR/textures/Newport_Loft_Ref.hdr';
import THREE from 'three';

export default class PBRMaterial {
    constructor() {
        this.fMaterial = null;
        this.context = null;
        this.uniforms = {
            base_color_constant: {
                type: 'c',
                value: new THREE.Color(0xFFFFFF)
            },
            roughness_constant: {
                type: 'f',
                value: 1.0
            },
            metalicity: {
                type: 'f',
                value: 0.0
            },
            specular_level: {
                type: 'f',
                value: 0.04,
                min: 0.02,
                max: 0.08
            },
            light_color: {
                type: 'c',
                value: new THREE.Color(0xFFFFFF)
            },
            light_direction: {
                type: 'c',
                value: new THREE.Color(0xCCCCCC)
            },
            light_intensity: {
                type: 'f',
                value: 1.0
            },
            use_textures: {
                type: 'i',
                value: 0,
                min: 0,
                max: 1,
                hidden: true
            },
            brdf_map: {
                type: 't',
                value: null
            },
            ibl_map: {
                type: 't',
                value: null
            },
            ibl_exposure: {
                type: 'f',
                value: 2.2,
                min: 0.0,
                max: 3.0,
                hidden: true
            }
        };
    }

    generateMaterial(renderSystem) {
        this.context = renderSystem;
        const makeIBLPromise = generateImageBasedLight(renderSystem, iblMapUrl);

        makeIBLPromise.then(({
            ibl,
            brdf
        }) => {
            this.uniforms.ibl_map.value = ibl;
            this.uniforms.ibl_map.needsUpdate = true;

            this.uniforms.brdf_map.value = brdf;
            this.uniforms.brdf_map.needsUpdate = true;

        });

        this.fMaterial = new THREE.RawShaderMaterial({
            vertexShader: PBRVert,
            fragmentShader: PBRFrag,
            uniforms: this.uniforms
        });
    }
}
