uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

uniform sampler2D uDataTexture;

vec2 distort(vec2 p,vec2 offset){
    vec2 dp=p-offset.xy*.02;
    return dp;
}

void main(){
    vec2 p=vUv;
    
    vec4 offsetTex=texture(uDataTexture,p);
    
    vec2 dp=distort(p,offsetTex.xy);
    
    vec4 tex=texture(uTexture,dp);
    
    vec4 col=tex;
    gl_FragColor=col;
    // gl_FragColor=offset;
}