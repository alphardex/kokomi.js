uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uPositionTexture;
uniform float uPointSize;

attribute vec2 reference;

void main(){
    vec3 p=texture(uPositionTexture,reference).xyz;
    
    csm_Position=p;
    
    vec4 mvPosition=modelViewMatrix*vec4(p,1.);
    gl_PointSize=uPointSize*(1./-mvPosition.z);
    
    vUv=uv;
}