const frag = 
`
precision mediump float;

varying vec2 vUv;
varying vec3 pos;

uniform float u_time;

void main() {
    // colour is RGBA: u, v, 0, 1
    float r = 5.*(length(pos)-0.5);
    // r = 5.*(pos.x/2.+0.5); // pos.x [0, 1]

    gl_FragColor = vec4(pos/2.+0.5, 1. );
    gl_FragColor = vec4(r, r/5., 0., 1.);
}
`

export default frag