#define GLSLIFY 1
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

vec3 mod289(vec3 x){
    return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x){
    return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x){
    return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159-.85373472095314*r;
}

float snoise(vec3 v)
{
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    
    // First corner
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    
    // Other corners
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;// 2.0*C.x = 1/3 = C.y
    vec3 x3=x0-D.yyy;// -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
    i=mod289(i);
    vec4 p=permute(permute(permute(
                i.z+vec4(0.,i1.z,i2.z,1.))
                +i.y+vec4(0.,i1.y,i2.y,1.))
                +i.x+vec4(0.,i1.x,i2.x,1.));
                
                // Gradients: 7x7 points over a square, mapped onto an octahedron.
                // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
                float n_=.142857142857;// 1.0/7.0
                vec3 ns=n_*D.wyz-D.xzx;
                
                vec4 j=p-49.*floor(p*ns.z*ns.z);//  mod(p,7*7)
                
                vec4 x_=floor(j*ns.z);
                vec4 y_=floor(j-7.*x_);// mod(j,N)
                
                vec4 x=x_*ns.x+ns.yyyy;
                vec4 y=y_*ns.x+ns.yyyy;
                vec4 h=1.-abs(x)-abs(y);
                
                vec4 b0=vec4(x.xy,y.xy);
                vec4 b1=vec4(x.zw,y.zw);
                
                //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
                //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
                vec4 s0=floor(b0)*2.+1.;
                vec4 s1=floor(b1)*2.+1.;
                vec4 sh=-step(h,vec4(0.));
                
                vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
                vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
                
                vec3 p0=vec3(a0.xy,h.x);
                vec3 p1=vec3(a0.zw,h.y);
                vec3 p2=vec3(a1.xy,h.z);
                vec3 p3=vec3(a1.zw,h.w);
                
                //Normalise gradients
                vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
                p0*=norm.x;
                p1*=norm.y;
                p2*=norm.z;
                p3*=norm.w;
                
                // Mix final noise value
                vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
                m=m*m;
                return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),
                dot(p2,x2),dot(p3,x3)));
            }
            
            vec4 getWorldNormal(mat4 modelMat,vec3 normal){
                vec4 worldNormal=normalize((modelMat*vec4(normal,0.)));
                return worldNormal;
            }
            
            const float PI=3.14159265359;
            
            uniform float iTime;
            uniform vec2 iResolution;
            uniform vec2 iMouse;
            
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            
            vec3 distort(vec3 p){
                float time=iTime*.1;
                vec2 mouse=iMouse.xy/iResolution.xy;
                
                vec3 pointDirection=normalize(p);
                vec3 mousePoint=vec3(mouse,1.);
                vec3 mouseDirection=normalize(mousePoint);
                float mousePointAngle=dot(pointDirection,mouseDirection);
                
                float freq=1.5;
                float t=time*100.;
                
                float f=PI*freq;
                float fc=mousePointAngle*f;
                
                vec3 n11=pointDirection*1.5;
                vec3 n12=vec3(time)*4.;
                float dist=smoothstep(.4,1.,mousePointAngle);
                float n1a=dist*2.;
                float noise1=snoise(n11+n12)*n1a;
                
                vec3 n21=pointDirection*1.5;
                vec3 n22=vec3(0.,0.,time)*2.;
                vec3 n23=vec3(mouse,0.)*.2;
                float n2a=.8;
                float noise2=snoise(n21+n22+n23)*n2a;
                
                float mouseN1=sin(fc+PI+t);
                float mouseN2=smoothstep(f,f*2.,fc+t);
                float mouseN3=smoothstep(f*2.,f,fc+t);
                float mouseNa=4.;
                float mouseNoise=mouseN1*mouseN2*mouseN3*mouseNa;
                
                float noise=noise1+noise2+mouseNoise;
                vec3 distortion=pointDirection*(noise+length(p));
                return distortion;
            }
            
            // http://lolengine.net/blog/2013/09/21/picking-orthogonal-vector-combing-coconuts
            vec3 orthogonal(vec3 v){
                return normalize(abs(v.x)>abs(v.z)?vec3(-v.y,v.x,0.)
                :vec3(0.,-v.z,v.y));
            }
            
            // https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=0010
            vec3 fixNormal(vec3 position,vec3 distortedPosition,vec3 normal){
                vec3 tangent=orthogonal(normal);
                vec3 bitangent=normalize(cross(normal,tangent));
                float offset=.1;
                vec3 neighbour1=position+tangent*offset;
                vec3 neighbour2=position+bitangent*offset;
                vec3 displacedNeighbour1=distort(neighbour1);
                vec3 displacedNeighbour2=distort(neighbour2);
                vec3 displacedTangent=displacedNeighbour1-distortedPosition;
                vec3 displacedBitangent=displacedNeighbour2-distortedPosition;
                vec3 displacedNormal=normalize(cross(displacedTangent,displacedBitangent));
                return displacedNormal;
            }
            
            void main(){
                vec3 p=position;
                vec3 dp=distort(p);
                
                csm_Position=dp;
                
                vec3 distortedNormal=fixNormal(position,dp,normal);
                
                vUv=uv;
                vWorldNormal=getWorldNormal(modelMatrix,distortedNormal).xyz;
            }