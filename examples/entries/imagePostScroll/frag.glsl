uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    
    vec4 tex=texture(uTexture,p);
    
    vec4 col=tex;
    
    gl_FragColor=col;
}