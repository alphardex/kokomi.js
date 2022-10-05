uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vEyeVector;

// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec4 getWorldPosition(mat4 modelMat,vec3 pos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    return worldPosition;
}

vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){
    vec4 worldPosition=getWorldPosition(modelMat,pos);
    vec3 eyeVector=normalize(worldPosition.xyz-camPos);
    return eyeVector;
}

void main(){
    vec3 p=position;
    
    csm_Position=p;
    
    vUv=uv;
    
    vWorldPosition=getWorldPosition(modelMatrix,p).xyz;
    vNormal=normalize(mat3(modelMatrix)*normal);
    vEyeVector=getEyeVector(modelMatrix,p,cameraPosition);
}