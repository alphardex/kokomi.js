uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec2 uHoverUv;
uniform float uHoverState;

varying float vNoise;

vec3 distort(vec3 p){
    float dist=distance(uv,uHoverUv);
    p.z+=10.*sin(10.*dist+iTime)*uHoverState;
    float noise=sin(10.*dist-iTime)*uHoverState;
    vNoise=noise;
    return p;
}

void main(){
    vec3 p=position;
    
    vec3 dp=distort(p);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(dp,1.);
    
    vUv=uv;
}