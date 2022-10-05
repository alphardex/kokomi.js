// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#generic-123-noise
float mod289(float x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}

float noise(vec3 p){
    vec3 a=floor(p);
    vec3 d=p-a;
    d=d*d*(3.-2.*d);
    
    vec4 b=a.xxyy+vec4(0.,1.,0.,1.);
    vec4 k1=perm(b.xyxy);
    vec4 k2=perm(k1.xyxy+b.zzww);
    
    vec4 c=k2+a.zzzz;
    vec4 k3=perm(c);
    vec4 k4=perm(c+1.);
    
    vec4 o1=fract(k3*(1./41.));
    vec4 o2=fract(k4*(1./41.));
    
    vec4 o3=o2*d.z+o1*(1.-d.z);
    vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);
    
    return o4.y*d.y+o4.x*(1.-d.y);
}

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

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;
varying vec3 vPosition;

float lines(vec2 p,float offset){
    float l=abs(.5*(sin(p.x*30.)+offset*2.));
    return smoothstep(0.,.5+.5*offset,l);
}

void main(){
    vec2 p=vUv;
    vec3 pos=vPosition;
    
    float n=noise(pos+iTime);
    
    vec2 baseUv=pos.xy;
    baseUv=rotate(baseUv,n)*.1;
    
    float lineShape1=lines(baseUv,.5);
    float lineShape2=lines(baseUv,.1);
    
    vec3 color1=vec3(224.,148.,66.)/255.;
    vec3 color2=vec3(120.,158.,113.)/255.;
    vec3 color3=vec3(0.,0.,0.)/255.;
    
    vec3 colorMix1=mix(color1,color2,lineShape1);
    vec3 colorMix2=mix(colorMix1,color3,lineShape2);
    
    // vec3 col=vec3(n,0.,0.);
    // vec3 col=vec3(baseUv,0.);
    // vec3 col=vec3(lineShape2);
    // vec3 col=colorMix1;
    vec3 col=colorMix2;
    
    csm_DiffuseColor=vec4(col,1.);
}