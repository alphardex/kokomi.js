uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec4 col=vec4(0.,1.,1.,1.);
    gl_FragColor=col;
}