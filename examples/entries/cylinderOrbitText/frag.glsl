uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uVelocity;

void main(){
    vec2 p=vUv;
    
    vec2 grid=vec2(1.,1.);
    vec2 gridUv=vUv*grid;
    vec2 displacement=vec2(iTime*uVelocity,0.);
    vec2 displacedUv=fract(gridUv+displacement);
    vec3 tex=texture(uTexture,displacedUv).rgb;
    
    vec3 col=tex;
    
    if(col==vec3(0.)){
        discard;
    }
    
    csm_DiffuseColor=vec4(col,1.);
}