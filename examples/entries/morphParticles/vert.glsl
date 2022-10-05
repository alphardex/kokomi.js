uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

attribute vec3 aPositionBox;
attribute vec3 aPositionTorus;

uniform float uTransition1;
uniform float uTransition2;

void main(){
    vec3 p=position;
    
    vec3 transition1=mix(p,aPositionBox,uTransition1);
    vec3 transition2=mix(transition1,aPositionTorus,uTransition2);
    vec3 finalPos=transition2;
    
    csm_Position=finalPos;
    
    gl_PointSize=10.;
    
    vUv=uv;
}