#define GLSLIFY 1
// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}

uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vEyeVector;

void main(){
    float F=fresnel(0.,.6,2.,vEyeVector,vNormal);
    vec3 color=uColor+F;
    
    csm_FragColor=vec4(color,1.);
}