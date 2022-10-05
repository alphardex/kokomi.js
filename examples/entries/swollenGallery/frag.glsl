uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D tDiffuse;

uniform float uRadius;
uniform float uPower;

varying vec2 vUv;

float saturate(float a){
    return clamp(a,0.,1.);
}

vec2 distort(vec2 p){
    float power=saturate(abs(uPower)*1.25);
    vec2 pivot=vec2(.5);
    vec2 d=p-pivot;
    float rDist=length(d);
    float gr=pow(rDist/uRadius,power);
    float mag=2.-cos(gr-1.);
    vec2 dp=pivot+d*mag;
    return dp;
}

void main(){
    vec2 p=vUv;
    vec2 dp=distort(p);
    vec4 tex=texture(tDiffuse,dp);
    vec4 col=tex;
    gl_FragColor=col;
}