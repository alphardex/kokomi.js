#define GLSLIFY 1
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float hash(float n){return fract(sin(n)*1e4);}
float hash(vec2 p){return fract(1e4*sin(17.*p.x+p.y*.1)*(.1+abs(sin(p.y*13.+p.x))));}

float noise_0(float x){
    float i=floor(x);
    float f=fract(x);
    float u=f*f*(3.-2.*f);
    return mix(hash(i),hash(i+1.),u);
}

float noise_0(vec2 x){
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
float noise_0(vec3 x){
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

float map(float value,float inMin,float inMax,float outMin,float outMax){
    return outMin+(outMax-outMin)*(value-inMin)/(inMax-inMin);
}

vec2 map(vec2 value,vec2 inMin,vec2 inMax,vec2 outMin,vec2 outMax){
    return outMin+(outMax-outMin)*(value-inMin)/(inMax-inMin);
}

vec3 map(vec3 value,vec3 inMin,vec3 inMax,vec3 outMin,vec3 outMax){
    return outMin+(outMax-outMin)*(value-inMin)/(inMax-inMin);
}

vec4 map(vec4 value,vec4 inMin,vec4 inMax,vec4 outMin,vec4 outMax){
    return outMin+(outMax-outMin)*(value-inMin)/(inMax-inMin);
}

float invert(float n){
    return 1.-n;
}

vec3 invert(vec3 n){
    return 1.-n;
}

// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}

uniform float iTime;
uniform vec2 iResolution;

uniform sampler2D uPerlinNoiseTexture;
uniform float uTransitionProgress;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNdc;
varying vec3 vNormal;
varying vec3 vEyeVector;

void main(){
    // stroke
    float light=dot(vNormal,normalize(vec3(1.)));
    float stroke=cos((vNdc.x-vNdc.y)*750.);
    float noiseSm=noise_0(vec3(vNdc.xy,1.)*500.);
    float noiseLg=noise_0(vec3(vNdc.xy,iTime/4.)*5.);
    float noise=map(noiseSm,0.,1.,-1.,1.)+map(noiseLg,0.,1.,-1.,1.);
    stroke+=noise;
    float F=fresnel(0.,.5,3.,vEyeVector,vNormal);
    float stroke1=invert(smoothstep(light-.2,light+.2,stroke))-F;
    float stroke2=invert(smoothstep(2.*light-2.,2.*light+2.,stroke1));
    // transition with perlin noise
    vec3 normalizedNdc=map(vNdc,vec3(-1.),vec3(1.),vec3(0.),vec3(1.));
    float perlinNoise=texture(uPerlinNoiseTexture,normalizedNdc.xy).r;
    float progress=uTransitionProgress;
    progress+=map(perlinNoise,0.,1.,-1.,1.)*.2;
    float distanceFromCenter=length(vNdc.xy);
    progress=smoothstep(progress-.005,progress,distanceFromCenter);
    float finalStroke=mix(stroke2,stroke1,progress);
    vec3 color=vec3(finalStroke);
    csm_FragColor=vec4(color,1.);
}