uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying float vZ;

void main(){
    vec3 p=position;
    
    p.z+=sin(p.x*5.+iTime*1.5)*.1;
    p.z+=sin(p.y*6.+iTime)*.1;
    
    csm_Position=p;
    
    vUv=uv;
    
    vZ=p.z;
}