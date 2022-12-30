varying vec2 vUv;

uniform vec3 uTextColor;

void main(){
    vec2 p=vUv;
    
    vec4 col=vec4(uTextColor,1.);
    
    gl_FragColor=col;
}