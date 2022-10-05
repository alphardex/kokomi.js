uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

attribute float pIndex;

varying float vOpacity;

uniform vec3 uHover;
uniform float uDevicePixelRatio;

float saturate(float a){
    return clamp(a,0.,1.);
}

float random(float n){
    return fract(sin(n)*43758.5453123);
}

vec3 distort(vec3 p){
    vec2 m=uHover.xy*uDevicePixelRatio;
    
    // hover
    float r=.05;
    float distanceToMouse=pow(1.-saturate(length(m.xy-p.xy)-r)-.3,3.);
    vec2 dir=p.xy-m;
    p.xy=mix(p.xy,normalize(dir)+m,distanceToMouse);
    
    return p;
}

void main(){
    vec3 p=position;
    vec3 dp=distort(p);
    
    csm_Position=dp;
    
    vec4 mvPosition=modelViewMatrix*vec4(dp,1.);
    float pSize=40./-mvPosition.z;
    gl_PointSize=pSize;
    
    vUv=uv;
    
    vOpacity=random(pIndex);
}