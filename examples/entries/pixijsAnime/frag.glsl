uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uBackground;
uniform sampler2D uMask;

void main(){
    vec2 p=vUv;
    
    vec4 mask=texture(uMask,p);
    
    float strength=mask.a*mask.r;
    strength*=5.;
    strength=saturate(strength);
    
    vec4 tex=texture(uBackground,p+(1.-strength)*.1);
    
    vec4 col=tex;
    // col.a*=mask.a;
    col*=strength;
    
    csm_FragColor=col;
    // csm_FragColor=mask;
}