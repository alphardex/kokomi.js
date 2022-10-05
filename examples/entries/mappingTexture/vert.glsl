#define GLSLIFY 1
mat2 rotation2d(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat2(
        c,-s,
        s,c
    );
}

mat4 rotation3d(vec3 axis,float angle){
    axis=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float oc=1.-c;
    
    return mat4(
        oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
        oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
        oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
        0.,0.,0.,1.
    );
}

vec2 rotate(vec2 v,float angle){
    return rotation2d(angle)*v;
}

vec3 rotate(vec3 v,vec3 axis,float angle){
    return(rotation3d(axis,angle)*vec4(v,1.)).xyz;
}

float map(float a,float b,float c,float d,float t)
{
    float v=(t-a)/(b-a)*(d-c)+c;
    return v;
}

vec2 map(vec2 a,vec2 b,vec2 c,vec2 d,vec2 t)
{
    vec2 v=(t-a)/(b-a)*(d-c)+c;
    return v;
}

vec3 map(vec3 a,vec3 b,vec3 c,vec3 d,vec3 t)
{
    vec3 v=(t-a)/(b-a)*(d-c)+c;
    return v;
}

vec4 map(vec4 a,vec4 b,vec4 c,vec4 d,vec4 t)
{
    vec4 v=(t-a)/(b-a)*(d-c)+c;
    return v;
}

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv2;

uniform vec2 uTranslate;
uniform vec2 uScale;

vec2 getDisplacementUv(vec2 p){
    float d=1.8;
    float u=fract(map(-.5,.5,0.,1.,p.x));
    float v=fract(map(-d,d,0.,1.,p.y));
    
    vec2 displacementUv=vec2(u,v);
    return displacementUv;
}

vec3 distort(vec3 p){
    // p.z+=sin(p.x*10.)*.4;
    
    // vec2 circleRot=rotate(vec2(0.,1.),uv.x*2.*PI);
    // p.x=circleRot.x;
    // p.z=circleRot.y;
    
    vec2 pos=p.xy*.5*uScale+uTranslate;
    vec2 displacementUv=getDisplacementUv(pos);
    
    float displacement=map(0.,1.,-1.,1.,texture(displacementMap,displacementUv).x);
    float radius=1.4+1.25*displacement;
    vec2 rotatedDisplacement=rotate(vec2(0.,radius),(pos.x)*2.*PI);
    p.x=rotatedDisplacement.x;
    p.y=pos.y;
    p.z=rotatedDisplacement.y;
    
    return p;
}

void main(){
    vec3 p=position;
    
    vec3 dp=distort(p);
    
    csm_Position=dp;
    
    vUv2=uv;
}