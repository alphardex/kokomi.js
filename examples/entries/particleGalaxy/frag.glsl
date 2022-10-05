float spot(vec2 st,float r,float expo){
    return pow(r/distance(st,vec2(.5)),expo);
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

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec3 uColor;

varying float vOpacity;

void main(){
    vec2 p=vUv;
    
    float shape=spot(p,.04,2.5);
    
    vec3 col=uColor*vOpacity;
    
    gl_FragColor=vec4(col,shape);
}