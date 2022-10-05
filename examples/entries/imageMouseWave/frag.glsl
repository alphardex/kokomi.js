uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

varying float vNoise;

void main(){
    vec2 p=vUv;
    
    vec4 tex=texture(uTexture,p);
    
    vec4 col=tex;
    
    col.rgb+=.1*vNoise;
    
    gl_FragColor=col;
}