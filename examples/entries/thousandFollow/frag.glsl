uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vEyeVector;

uniform vec3 uSpotLight;
uniform float uScatterDivider;
uniform float uScatterPow;
uniform float uIsPlane;
uniform vec3 uPlaneColor;
uniform vec3 uSpotColor;
uniform float uIsText;
uniform vec3 uTextColor;
uniform float uUseFresnel;

// https://ijdykeman.github.io/graphics/simple_fog_shader
// https://lusion.co/
float getScatter(vec3 start,vec3 dir,vec3 lightPos,float d,float lightDivider,float lightPow){
    // light to ray origin
    vec3 q=start-lightPos;
    
    // coefficients
    float b=dot(dir,q);
    float c=dot(q,q);
    
    // evaluate integral
    float t=c-b*b;
    float s=1./sqrt(max(.0001,t));
    float l=s*(atan((d+b)*s)-atan(b*s));
    
    return pow(max(0.,l/lightDivider),lightPow);
}

#define GLSLIFY 1
// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}

void main(){
    vec2 p=vUv;
    
    // scatter
    vec3 cameraToWorld=vWorldPosition-cameraPosition;
    vec3 cameraToWorldDirection=normalize(cameraToWorld);
    float cameraToWorldDistance=length(cameraToWorld);
    float scatter=getScatter(cameraPosition,cameraToWorldDirection,uSpotLight,cameraToWorldDistance,uScatterDivider,uScatterPow);
    
    // color
    vec3 color=vec3(0.,0.,0.);
    
    if(uIsPlane==1.){
        color+=uPlaneColor;
        color+=mix(vec3(0.),uSpotColor,scatter);
    }
    
    if(uIsText==1.){
        color+=mix(vec3(0.),uTextColor,scatter);
        
        if(uUseFresnel==1.){
            float F=fresnel(0.,.5,3.,vEyeVector,vNormal);
            color+=F;
        }
    }
    
    csm_DiffuseColor=vec4(color,1.);
}