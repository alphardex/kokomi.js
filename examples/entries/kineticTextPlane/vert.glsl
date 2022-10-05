uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vPosition;

uniform float uVelocity;
uniform float uFrequency;

varying float vWave;

vec3 distort(vec3 p){
    float displacement=sin((p.x-p.y)*uFrequency-iTime*uVelocity);
    p.z+=displacement;
    return p;
}

void main(){
    vec3 p=position;
    
    vec3 dp=distort(p);
    
    csm_Position=dp;
    
    vUv=uv;
    
    vPosition=p;
    vWave=dp.z;
}