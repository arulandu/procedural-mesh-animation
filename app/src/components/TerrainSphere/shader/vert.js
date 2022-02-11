import { random } from "./lib";

const vert = 
`
precision mediump float;
varying vec2 vUv;
varying vec3 pos;

uniform float u_time;
uniform float rad;

${random}

void main() {
    vUv = uv;
    vec3 dir = position/length(position);
    vec3 trans = dir*rad-0.2*simplex3d(vec3(dir.xy, u_time/2.))*dir;
    pos = trans;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(trans, 1.0 );
}
`

export default vert;