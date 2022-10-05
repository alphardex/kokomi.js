uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vColor;

void main(){
    vec2 p=vUv;
    
    // vec3 col=vec3(p,0.);
    vec3 col=vColor;
    
    csm_DiffuseColor=vec4(col,1.);
}