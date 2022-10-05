uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uSpikeCount;
uniform float uSpikeLength;
uniform vec2 uImpulse;
uniform float uSceneRotationY;

varying float vNoise;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x){
return x-floor(x*(1./289.))*289.;}

float mod289(float x){
return x-floor(x*(1./289.))*289.;}

vec4 permute(vec4 x){
    return mod289(((x*34.)+1.)*x);
}

float permute(float x){
    return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159-.85373472095314*r;
}

float taylorInvSqrt(float r)
{
    return 1.79284291400159-.85373472095314*r;
}

vec4 grad4(float j,vec4 ip)
{
    const vec4 ones=vec4(1.,1.,1.,-1.);
    vec4 p,s;
    
    p.xyz=floor(fract(vec3(j)*ip.xyz)*7.)*ip.z-1.;
    p.w=1.5-dot(abs(p.xyz),ones.xyz);
    s=vec4(lessThan(p,vec4(0.)));
    p.xyz=p.xyz+(s.xyz*2.-1.)*s.www;
    
    return p;
}

// (sqrt(5) - 1)/4 = F4, used once below
#define F4.309016994374947451

float snoise(vec4 v)
{
    const vec4 C=vec4(.138196601125011,// (5 - sqrt(5))/20  G4
    .276393202250021,// 2 * G4
    .414589803375032,// 3 * G4
-.447213595499958);// -1 + 4 * G4

// First corner
vec4 i=floor(v+dot(v,vec4(F4)));
vec4 x0=v-i+dot(i,C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
vec4 i0;
vec3 isX=step(x0.yzw,x0.xxx);
vec3 isYZ=step(x0.zww,x0.yyz);
//  i0.x = dot( isX, vec3( 1.0 ) );
i0.x=isX.x+isX.y+isX.z;
i0.yzw=1.-isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
i0.y+=isYZ.x+isYZ.y;
i0.zw+=1.-isYZ.xy;
i0.z+=isYZ.z;
i0.w+=1.-isYZ.z;

// i0 now contains the unique values 0,1,2,3 in each channel
vec4 i3=clamp(i0,0.,1.);
vec4 i2=clamp(i0-1.,0.,1.);
vec4 i1=clamp(i0-2.,0.,1.);

//  x0 = x0 - 0.0 + 0.0 * C.xxxx
//  x1 = x0 - i1  + 1.0 * C.xxxx
//  x2 = x0 - i2  + 2.0 * C.xxxx
//  x3 = x0 - i3  + 3.0 * C.xxxx
//  x4 = x0 - 1.0 + 4.0 * C.xxxx
vec4 x1=x0-i1+C.xxxx;
vec4 x2=x0-i2+C.yyyy;
vec4 x3=x0-i3+C.zzzz;
vec4 x4=x0+C.wwww;

// Permutations
i=mod289(i);
float j0=permute(permute(permute(permute(i.w)+i.z)+i.y)+i.x);
vec4 j1=permute(permute(permute(permute(
                i.w+vec4(i1.w,i2.w,i3.w,1.))
                +i.z+vec4(i1.z,i2.z,i3.z,1.))
                +i.y+vec4(i1.y,i2.y,i3.y,1.))
                +i.x+vec4(i1.x,i2.x,i3.x,1.));
                
                // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
                // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
                vec4 ip=vec4(1./294.,1./49.,1./7.,0.);
                
                vec4 p0=grad4(j0,ip);
                vec4 p1=grad4(j1.x,ip);
                vec4 p2=grad4(j1.y,ip);
                vec4 p3=grad4(j1.z,ip);
                vec4 p4=grad4(j1.w,ip);
                
                // Normalise gradients
                vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
                p0*=norm.x;
                p1*=norm.y;
                p2*=norm.z;
                p3*=norm.w;
                p4*=taylorInvSqrt(dot(p4,p4));
                
                // Mix contributions from the five corners
                vec3 m0=max(.6-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),0.);
                vec2 m1=max(.6-vec2(dot(x3,x3),dot(x4,x4)),0.);
                m0=m0*m0;
                m1=m1*m1;
                return 49.*(dot(m0*m0,vec3(dot(p0,x0),dot(p1,x1),dot(p2,x2)))
                +dot(m1*m1,vec2(dot(p3,x3),dot(p4,x4))));
                
            }
            
            vec3 impulsePos(vec3 pos,vec2 impulse,float intensity){
                // hor x,z
                float angleH=atan(pos.z,pos.x);
                float hLength=length(vec2(pos.z,pos.x));
                float xStrength=intensity*impulse.x;
                float xPos=hLength*cos(angleH+xStrength);
                float zPos=hLength*sin(angleH+xStrength);
                // ver y
                float zPos2=hLength*sin(angleH+xStrength-uSceneRotationY);
                float yStrength=intensity*impulse.y;
                float angleV=atan(zPos2,pos.y)-yStrength;
                float vLength=length(vec2(zPos2,pos.y));
                float yPos=vLength*cos(angleV);
                pos=vec3(xPos,yPos,zPos);
                return pos;
            }
            
            void main(){
                vec3 p=position;
                
                float noise=snoise(vec4(p*uSpikeCount,10.)*uSpikeLength)*.5;
                vec3 dp=p+noise*normal;
                float intensity=noise*5.;
                dp=impulsePos(dp,uImpulse,intensity);
                
                csm_Position=dp;
                
                vUv=uv;
                
                vNoise=noise;
            }