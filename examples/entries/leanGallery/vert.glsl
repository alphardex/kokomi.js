uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uDistanceCenter;

const float PI=3.14159265359;

void main(){
    vec3 p=position;
    vec2 u=uv;
    
    // distort
    p.y+=sin(PI*u.x)*.05;
    p.z+=sin(PI*u.x)*.1;
    
    // float
    p.y+=sin(iTime*2.)*.02;
    u.y-=sin(iTime*2.)*.02;
    
    // pos scale
    p*=(1.+.2*uDistanceCenter);
    
    // uv scale
    u=2.*u-1.;
    u*=(1.+.2*uDistanceCenter)*.82;
    u=(u+1.)*.5;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=u;
}