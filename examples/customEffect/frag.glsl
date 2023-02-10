uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D tDiffuse;

varying vec2 vUv;

uniform float uRGBShift;

vec4 RGBShift(sampler2D t,vec2 rUv,vec2 gUv,vec2 bUv){
    vec4 color1=texture(t,rUv);
    vec4 color2=texture(t,gUv);
    vec4 color3=texture(t,bUv);
    vec4 color=vec4(color1.r,color2.g,color3.b,color2.a);
    return color;
}

highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}

void main(){
    vec2 p=vUv;
    
    vec4 col=vec4(0.);
    
    // RGB Shift
    float n=random(p+mod(iTime,1.))*.1+.5;
    vec2 offset=vec2(cos(n),sin(n))*.0025*uRGBShift;
    vec2 rUv=p+offset;
    vec2 gUv=p;
    vec2 bUv=p-offset;
    col=RGBShift(tDiffuse,rUv,gUv,bUv);
    
    gl_FragColor=col;
}