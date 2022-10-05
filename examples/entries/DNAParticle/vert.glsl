uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying float vRandColor;
varying float vRandAlpha;

uniform float uSize;
uniform float uProgress;

highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}

float quinticInOut(float t){
    return t<.5
    ?+16.*pow(t,5.)
    :-.5*pow(2.*t-2.,5.)+1.;
}

float saturate(float a){
    return clamp(a,0.,1.);
}

void main(){
    // rand particle color and alpha
    float randColor=random(uv);
    float randAlpha=random(uv+50.);
    float randAnimeOffset=random(uv);
    
    vec3 newPos=position;
    
    // anime
    // newPos.y+=quinticInOut(saturate((uProgress-uv.y*.6)/.4));
    
    vec4 modelPosition=modelMatrix*vec4(newPos,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    
    gl_Position=projectedPosition;
    gl_PointSize=uSize*(1./-viewPosition.z);
    
    vUv=uv;
    
    vRandColor=randColor;
    vRandAlpha=randAlpha;
}