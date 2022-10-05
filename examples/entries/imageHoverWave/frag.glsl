uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

uniform float uHoverState;

void main(){
    vec2 p=vUv;
    
    float x=uHoverState;
    x=smoothstep(.0,1.,(x*2.+p.y-1.));
    
    vec4 col=mix(
        texture(uTexture,(p-.5)*(1.-x)+.5),
        texture(uTexture,(p-.5)*x+.5),
    x);
    
    gl_FragColor=col;
}