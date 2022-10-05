uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

attribute float aRandom;
attribute vec3 aCenter;

uniform float uProgress;

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

vec3 distort(vec3 p){
    // p.x+=aRandom*sin((uv.y+uv.x+iTime)*10.)*.5;
    
    // p+=aRandom*normal;
    
    // p+=aRandom*(.5*sin(iTime)+.5)*normal;
    
    // p+=aRandom*normal*uProgress;
    // p=rotate(p,vec3(0.,1.,0.),uProgress*PI*3.*aRandom);
    
    // p-=aCenter;
    // p+=normal*aRandom*(1.-uProgress);
    // p*=uProgress;
    // p+=aCenter;
    // p=rotate(p,vec3(0.,1.,0.),(1.-uProgress)*PI*2.*aRandom*2.);
    
    // float localPr=uProgress;
    float pr=saturate((p.y+1.)*.5);
    float localPr=saturate((uProgress-.8*pr)/.2);
    p-=aCenter;
    p+=normal*aRandom*(localPr)*2.;
    p*=(1.-localPr);
    p+=aCenter;
    p=rotate(p,vec3(0.,1.,0.),localPr*PI*2.*aRandom*2.);
    
    return p;
}

void main(){
    vec3 p=position;
    
    vec3 dp=distort(p);
    
    csm_Position=dp;
    
    vUv=uv;
}