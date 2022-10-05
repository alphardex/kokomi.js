uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

varying float vElevation;

void main(){
    vec2 p=vUv;
    
    vec4 tex=texture(uTexture,p);
    tex.rgb*=vElevation*2.+1.;
    
    csm_DiffuseColor=tex;
}