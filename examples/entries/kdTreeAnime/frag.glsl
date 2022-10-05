uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uFrontTexture;
uniform sampler2D uBackTexture;
uniform vec2 uSize;

void main(){
    vec2 p=vUv;
    p/=uSize;
    
    vec2 p2=p+vec2(.5);
    
    vec2 p3=vec2(1.-p2.x,p2.y);
    
    vec4 frontCol=texture(uFrontTexture,p2);
    vec4 backCol=texture(uBackTexture,p3);
    
    float stripe=(sin((vPosition.x+vPosition.y+vPosition.z)*50.)+1.)*.5;
    stripe=smoothstep(.5,.51,stripe);
    vec4 sideCol=vec4(stripe);
    
    float side=abs(dot(vNormal,vec3(0.,0.,1.)));
    
    float backFront=(dot(vNormal,vec3(0.,0.,1.))+1.)*.5;
    vec4 backFrontCol=mix(backCol,frontCol,backFront);
    
    vec4 col=mix(sideCol,backFrontCol,side);
    
    // col=vec4(vNormal,1.);
    
    csm_FragColor=col;
}