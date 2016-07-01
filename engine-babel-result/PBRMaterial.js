'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global THREE */

var _ImageBasedLightGenerator = require('cpina/common/ibl/ImageBasedLightGenerator');

var _PhysicallyBased = require('cpina/common/ibl/PhysicallyBased.frag');

var _PhysicallyBased2 = _interopRequireDefault(_PhysicallyBased);

var _StandardRawTBN = require('cpina/common/StandardRawTBN.vert');

var _StandardRawTBN2 = _interopRequireDefault(_StandardRawTBN);

var _Newport_Loft_Ref = require('cpina/HDR/textures/Newport_Loft_Ref.hdr');

var _Newport_Loft_Ref2 = _interopRequireDefault(_Newport_Loft_Ref);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PBRMaterial = function () {
    function PBRMaterial() {
        _classCallCheck(this, PBRMaterial);

        this.material = null;
        this.context = null;
        this.uniforms = {
            base_color_constant: {
                type: 'c',
                value: new THREE.Color(0x006AA4)
            },
            roughness_constant: {
                type: 'f',
                value: 0.25
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

    _createClass(PBRMaterial, [{
        key: 'setup',
        value: function setup(context) {
            var _this = this;

            this.context = context;
            var makeIBLPromise = (0, _ImageBasedLightGenerator.generateImageBasedLight)(context, iblMapUrl);

            makeIBLPromise.then(function (_ref) {
                var ibl = _ref.ibl;
                var brdf = _ref.brdf;

                _this.uniforms.ibl_map.value = ibl;
                _this.uniforms.ibl_map.needsUpdate = true;

                _this.uniforms.brdf_map.value = brdf;
                _this.uniforms.brdf_map.needsUpdate = true;
            });

            this.material = new THREE.RawShaderMaterial({
                vertexShader: _StandardRawTBN2.default,
                fragmentShader: _PhysicallyBased2.default,
                uniforms: this.uniforms
            });
        }
    }]);

    return PBRMaterial;
}();