precision highp float;
precision highp int;

uniform sampler2D ibl_map;
varying vec3 vN;

#pragma glslify: normalToUv = require(./envMapEquirect)


void main() {

  vec3 N = normalize(vN);
  vec2 env_uv = normalToUv(N);
  vec3 final = texture2D(ibl_map, env_uv).rgb;
  //final = vec3(env_uv.r, env_uv.g, 0.0);
  gl_FragColor = vec4(final, 1.0);


}
