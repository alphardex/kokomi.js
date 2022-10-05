uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vPosition;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float hash(float n){return fract(sin(n)*1e4);}
float hash(vec2 p){return fract(1e4*sin(17.*p.x+p.y*.1)*(.1+abs(sin(p.y*13.+p.x))));}

float noise(float x){
    float i=floor(x);
    float f=fract(x);
    float u=f*f*(3.-2.*f);
    return mix(hash(i),hash(i+1.),u);
}

float noise(vec2 x){
    vec2 i=floor(x);
    vec2 f=fract(x);
    
    // Four corners in 2D of a tile
    float a=hash(i);
    float b=hash(i+vec2(1.,0.));
    float c=hash(i+vec2(0.,1.));
    float d=hash(i+vec2(1.,1.));
    
    // Simple 2D lerp using smoothstep envelope between the values.
    // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
    //			mix(c, d, smoothstep(0.0, 1.0, f.x)),
    //			smoothstep(0.0, 1.0, f.y)));
    
    // Same code, with the clamps in smoothstep and common subexpressions
    // optimized away.
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

// This one has non-ideal tiling properties that I'm still tuning
float noise(vec3 x){
    const vec3 step=vec3(110,241,171);
    
    vec3 i=floor(x);
    vec3 f=fract(x);
    
    // For performance, compute the base input to a 1D hash from the integer part of the argument and the
    // incremental change to the 1D based on the 3D -> 1D wrapping
    float n=dot(i,step);
    
    vec3 u=f*f*(3.-2.*f);
    return mix(mix(mix(hash(n+dot(step,vec3(0,0,0))),hash(n+dot(step,vec3(1,0,0))),u.x),
    mix(hash(n+dot(step,vec3(0,1,0))),hash(n+dot(step,vec3(1,1,0))),u.x),u.y),
    mix(mix(hash(n+dot(step,vec3(0,0,1))),hash(n+dot(step,vec3(1,0,1))),u.x),
    mix(hash(n+dot(step,vec3(0,1,1))),hash(n+dot(step,vec3(1,1,1))),u.x),u.y),u.z);
}

float xmbNoise(vec3 x){
    float t=iTime;
    
    return cos(x.z*4.)*cos(x.z+t/10.+x.x);
}

vec3 distort(vec3 pos){
    float t=iTime;
    
    vec3 p=vec3(pos.x,0.,pos.y);
    
    // noise wave
    p.y=xmbNoise(p)/8.;
    
    // distort
    vec3 p2=p;
    p2.x-=t/5.;
    p2.x/=4.;
    p2.y-=t/100.;
    p2.z-=t/10.;
    p.y-=noise(p2*8.)/12.+cos(p.x*2.-t/2.)/5.-.3;
    p.z-=noise(p2*8.)/12.;
    
    return p;
}

void main(){
    vec3 p=position;
    
    vec3 dp=distort(p);
    
    csm_Position=dp;
    
    vUv=uv;
    
    vPosition=dp;
}