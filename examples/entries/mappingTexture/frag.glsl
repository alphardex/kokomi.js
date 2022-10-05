uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv2;

uniform sampler2D uTexture;

void main(){
    vec2 p=vUv2;
    
    vec4 tex=texture(uTexture,p);
    
    vec4 col=tex;
    
    csm_DiffuseColor=col;
}