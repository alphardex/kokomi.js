#define GLSLIFY 1
mat2 rotation2d(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat2(
        c,-s,
        s,c
    );
}

mat4 rotation3d(vec3 axis,float angle){
    axis=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float oc=1.-c;
    
    return mat4(
        oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
        oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
        oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
        0.,0.,0.,1.
    );
}

vec2 rotate(vec2 v,float angle){
    return rotation2d(angle)*v;
}

vec3 rotate(vec3 v,vec3 axis,float angle){
    return(rotation3d(axis,angle)*vec4(v,1.)).xyz;
}

float invert(float n){
    return 1.-n;
}

vec3 invert(vec3 n){
    return 1.-n;
}

// https://github.com/glslify/glsl-easings
float qinticInOutAbs(float t){
    return t<.5
    ?+16.*pow(t,5.)
    :-.5*abs(pow(2.*t-2.,5.))+1.;
}

// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec4 getWorldPosition(mat4 modelMat,vec3 pos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    return worldPosition;
}

// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){
    vec4 worldPosition=getWorldPosition(modelMat,pos);
    vec3 eyeVector=normalize(worldPosition.xyz-camPos);
    return eyeVector;
}

float saturate(float a){
    return clamp(a,0.,1.);
}

const float PI=3.14159265359;

uniform float iTime;

varying vec2 vUv;

uniform vec3 uAxis;
uniform float uVelocity;
uniform float uDistortion;

varying vec3 vNormal;
varying vec3 vEyeVector;

void main(){
    vec3 p=position;
    float offset=2.*dot(uAxis,position);
    float sDistortion=.01*uDistortion;
    float oDistortion=sDistortion*offset;
    float displacement=uVelocity*iTime;
    float progress=saturate((fract(displacement)-oDistortion)/invert(sDistortion));
    progress=qinticInOutAbs(progress)*PI;
    p=rotate(p,uAxis,progress);
    
    csm_Position=p;
    
    vUv=uv;
    vec3 rotatedNormal=rotate(normal,uAxis,progress);
    vNormal=rotatedNormal;
    vec3 rotatedPos=rotate(position,uAxis,progress);
    vEyeVector=getEyeVector(modelMatrix,rotatedPos,cameraPosition);
}
