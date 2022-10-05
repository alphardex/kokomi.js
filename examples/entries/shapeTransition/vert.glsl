uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

attribute vec3 aPositionShape2;
attribute vec3 aJitter;

uniform float uTime;
uniform float uChromaticBlur;

const float PI=3.14159265359;

void main(){
    vec3 p=position;
    
    float phase=0.;
    phase=.5*(1.+cos(.8*(iTime+uChromaticBlur)+aJitter.x*.1*2.*PI));
    phase=smoothstep(.1,.9,phase);
    vec3 dp=mix(p,aPositionShape2,phase);
    
    csm_Position=dp;
    
    gl_PointSize=2.;
    
    vUv=uv;
}