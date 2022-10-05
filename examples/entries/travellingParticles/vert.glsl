uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

attribute float aOpacity;

uniform float uSize;

varying float vOpacity;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vec4 mvPosition=modelViewMatrix*vec4(p,1.);
    float pSize=uSize/-mvPosition.z;
    gl_PointSize=pSize;
    
    vOpacity=aOpacity;
}