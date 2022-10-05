uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec4 tex=texture(uTexture,p);
    vec3 color=tex.rgb;
    if(color.r<.1&&color.g<.1&&color.b<.1){
        discard;
    }
    gl_FragColor=vec4(color,1.);
}