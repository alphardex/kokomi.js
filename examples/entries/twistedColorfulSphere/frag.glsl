uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uIntensity;
uniform vec3 uBrightness;
uniform vec3 uContrast;
uniform vec3 uOscilation;
uniform vec3 uPhase;

varying vec3 vNormal;
varying float vNoise;

#define GLSLIFY 1
vec3 cosPalette(float t,vec3 a,vec3 b,vec3 c,vec3 d){
    return a+b*cos(6.28318*(c*t+d));
}

void main(){
    vec2 p=vUv;
    
    float noise=vNoise*uIntensity;
    vec3 col=cosPalette(noise,uBrightness,uContrast,uOscilation,uPhase);
    
    csm_DiffuseColor=vec4(col,1.);
}