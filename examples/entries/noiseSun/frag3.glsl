#define GLSLIFY 1
float invert(float n){
    return 1.-n;
}

vec3 invert(vec3 n){
    return 1.-n;
}

// https://www.shadertoy.com/view/XlSSzK
vec3 firePalette(float i){
    float T=1400.+1300.*i;// Temperature range (in Kelvin).
    vec3 L=vec3(7.4,5.6,4.4);// Red, green, blue wavelengths (in hundreds of nanometers).
    L=pow(L,vec3(5.))*(exp(1.43876719683e5/(T*L))-1.);
    return 1.-exp(-5e8/L);// Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}

uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;
varying vec3 vPosition;

void main(){
    float radial=invert(vPosition.z);
    radial=pow(radial,3.);
    float brightness=(1.+radial*.83)*radial*.4;
    vec3 ringColor=firePalette(brightness);
    vec4 color=vec4(ringColor,radial);
    csm_FragColor=color;
}