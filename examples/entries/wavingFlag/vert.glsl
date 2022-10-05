uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec2 uFrequency;

varying float vElevation;

void main(){
    vec3 p=position;
    
    float elevation=0.;
    elevation+=sin(p.x*uFrequency.x-iTime)*.1;
    elevation+=sin(p.y*uFrequency.y-iTime)*.1;
    p.z+=elevation;
    
    csm_Position=p;
    
    vUv=uv;
    vElevation=elevation;
}