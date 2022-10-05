uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform vec3 uColor;

void main(){
    vec2 p=vUv;
    
    vec3 col=uColor;
    
    csm_DiffuseColor=vec4(col,1.);
}