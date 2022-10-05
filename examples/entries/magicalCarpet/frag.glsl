uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying float vZ;

void main(){
    vec2 p=vUv;
    
    // vec3 col=vec3(p,0.);
    
    vec3 colorA=vec3(.1922,.3608,.9137);
    vec3 colorB=vec3(.051,.8275,1.);
    
    vec3 col=mix(colorA,colorB,vZ*2.+.5);
    
    csm_DiffuseColor=vec4(col,1.);
}
