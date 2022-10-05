uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    
    vec4 col=vec4(p,0.,1.);
    
    csm_DiffuseColor=col;
}