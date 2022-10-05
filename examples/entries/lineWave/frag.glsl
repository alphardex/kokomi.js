uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

uniform vec3 uFaceColor;
uniform vec3 uLineColor;

varying float vDepth;

void main(){
    float toMix=smoothstep(.2,1.,vDepth);
    vec3 color=mix(uFaceColor,uLineColor,toMix);
    gl_FragColor=vec4(color,1.);
}