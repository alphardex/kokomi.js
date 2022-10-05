#define GLSLIFY 1
// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
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
uniform samplerCube uNoiseTexture;
uniform float uBrightness;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;
varying vec3 vNormal;
varying vec3 vEyeVector;

float layerSum(){
    float sum=0.;
    sum+=texture(uNoiseTexture,vLayer1).r;
    sum+=texture(uNoiseTexture,vLayer2).r;
    sum+=texture(uNoiseTexture,vLayer3).r;
    sum*=uBrightness;
    return sum;
}

void main(){
    float brightness=layerSum();
    brightness=4.*brightness+1.;
    float F=fresnel(0.,1.,2.,vEyeVector,vNormal);
    // brightness+=F;
    brightness*=.5;
    vec4 color=vec4(firePalette(brightness),1.);
    csm_FragColor=color;
}