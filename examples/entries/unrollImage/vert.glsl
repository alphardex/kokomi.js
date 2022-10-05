#define GLSLIFY 1
mat2 rotation2d_0(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat2(
        c,-s,
        s,c
    );
}

mat4 rotation3d_0(vec3 axis,float angle){
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

vec2 rotate_0(vec2 v,float angle){
    return rotation2d_0(angle)*v;
}

vec3 rotate_0(vec3 v,vec3 axis,float angle){
    return(rotation3d_0(axis,angle)*vec4(v,1.)).xyz;
}

const float HALF_PI=1.57079632680;

const float PI=3.14159265359;

mat2 rotation2d_1(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat2(
        c,-s,
        s,c
    );
}

mat4 rotation3d_1(vec3 axis,float angle){
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

vec2 rotate_1(vec2 v,float angle){
    return rotation2d_1(angle)*v;
}

vec3 rotate_1(vec3 v,vec3 axis,float angle){
    return(rotation3d_1(axis,angle)*vec4(v,1.)).xyz;
}

vec3 rotateByOrigin(vec3 v,vec3 axis,float angle,vec3 origin){
    v-=origin;
    v=rotate_1(v,axis,angle);
    v+=origin;
    return v;
}

float saturate(float a){
    return clamp(a,0.,1.);
}

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform float uProgress;
uniform float uAngle;
uniform float uFloat;

varying vec2 vUv;
varying vec3 vPosition;

vec3 unroll(vec3 p,float angle,float progress){
    float rad=.1;
    float rolls=4.;
    vec3 zAxis=vec3(0.,0.,1.);
    vec3 origin=vec3(-.5,.5,0.);// 旋转中心为左上角
    vec3 origin2=vec3(-.5,.5,rad);
    float sc=sin(angle)+cos(angle);
    float totalAngle=rolls*PI;
    
    // rotate forward
    p=rotateByOrigin(p,zAxis,-angle,origin);
    
    float offset=(p.x+.5)/sc;
    float finalProgress=saturate((progress-offset)/.01);
    
    p.z=rad+rad*(1.-offset/2.)*sin(-offset*totalAngle-HALF_PI);
    p.x=-.5+rad*(1.-offset/2.)*cos(-offset*totalAngle+HALF_PI);
    
    // rotate back
    p=rotateByOrigin(p,zAxis,angle,origin);
    
    // unroll
    p=rotateByOrigin(p,vec3(sin(angle),cos(angle),0.),-progress*totalAngle,origin2);
    p+=vec3(
        progress*cos(angle)*sc,
        -progress*sin(angle)*sc,
        -progress*rad/2.
    );
    
    p=mix(p,position,finalProgress);
    return p;
}

vec3 distort(vec3 p){
    float freq=.25;
    float angle=(iTime*10.+uv.x*20.-uv.y*10.)*freq;
    float amp=uFloat*10.;
    float strength=sin(angle)*amp;
    p.z+=strength;
    return p;
}

void main(){
    vec3 p=position;
    
    vec3 unrolledPos=unroll(p,uAngle,uProgress);
    
    vec3 dp=distort(unrolledPos);
    
    vec4 modelPosition=modelMatrix*vec4(dp,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vPosition=p;
}