uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D tDiffuse;

varying vec2 vUv;

uniform float uScrollDelta;

vec2 distort(vec2 p){
    float area=smoothstep(.4,.0,p.y);
    area=pow(area,4.);
    p.x-=(p.x-.5)*.1*area*uScrollDelta;
    return p;
}

void main(){
    vec2 p=vUv;
    
    vec2 dp=distort(p);
    
    vec4 tex=texture(tDiffuse,dp);
    
    vec4 col=tex;
    
    gl_FragColor=col;
}