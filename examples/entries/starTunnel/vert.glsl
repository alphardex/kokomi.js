#define GLSLIFY 1
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
uniform float iVelocity;

attribute vec2 aSeed;
attribute float aSize;

varying float vRandColor;

void main(){
    vec3 p=position;
    
    float t=iTime*1000.;
    float v=iVelocity;
    float s=v*t;
    // p.z=p.z+s;
    p.z=mod(p.z+s,2000.);
    
    csm_Position=p;
    
    vec4 mvPosition=modelViewMatrix*vec4(p,1.);
    
    float pSize=aSize*(200./-mvPosition.z);
    gl_PointSize=pSize;
    
    float randColor=random(aSeed);
    vRandColor=randColor;
}