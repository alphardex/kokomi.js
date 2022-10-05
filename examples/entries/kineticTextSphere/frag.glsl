uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uVelocity;
uniform float uShadow;

varying vec3 vPosition;

float saturate(float a){
    return clamp(a,0.,1.);
}

void main(){
    vec2 p=vUv;
    
    vec2 grid=vec2(12.,12.);
    vec2 gridUv=vUv*grid;
    vec2 displacement=vec2(sin(p.y)*5.,iTime*uVelocity);
    vec2 displacedUv=fract(gridUv+displacement);
    vec3 tex=texture(uTexture,displacedUv).rgb;
    
    vec3 col=tex;
    
    float shadow=saturate(vPosition.z/uShadow);// farther darker (to 0).
    col*=shadow;
    
    csm_DiffuseColor=vec4(col,1.);
}