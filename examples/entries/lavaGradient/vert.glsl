uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vColor;

uniform vec3 uColors[COLOR_COUNT];
uniform float uNoiseAmp;
uniform float uIncline;

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
            
            float getNoise(vec3 p,float flow,float speed,float seed,vec2 freq){
                float t=iTime*.01;
                vec2 noiseCoord=uv*vec2(3.,4.)*freq;
                noiseCoord.x+=t*flow;
                float noise=snoise(vec3(noiseCoord,t*speed+seed));
                noise=max(0.,noise);
                return noise;
            }
            
            vec3 getOffset(vec3 p){
                float tilt=uv.y;
                p.y+=tilt;
                
                float incline=uv.x*uIncline;
                p.y+=incline;
                
                float offset=mix(-.25,.25,uv.y)*uIncline;
                p.y-=offset;
                return p;
            }
            
            vec3 getColor(vec3 col,vec3 p){
                for(int i=0;i<COLOR_COUNT-1;i++){
                    float colFlow=5.+float(i)*.3;
                    float colSpeed=10.+float(i)*.3;
                    float colSeed=1.+float(i)*10.;
                    vec2 colFreq=vec2(1.,1.4)*.4;
                    
                    float colNoise=getNoise(p,colFlow,colSpeed,colSeed,colFreq);
                    
                    float colFloor=.1;
                    float colCeil=.6+float(i)*.07;
                    colNoise=smoothstep(colFloor,colCeil,colNoise);
                    
                    col=mix(col,uColors[i],colNoise);
                }
                return col;
            }
            
            vec3 distort(vec3 p){
                float t=iTime*.005;
                
                // noise
                float noise=getNoise(p,3.,10.,0.,vec2(1.,1.));
                p.y+=noise*uNoiseAmp;
                
                // offset
                p=getOffset(p);
                
                return p;
            }
            
            void main(){
                vec3 p=position;
                
                vec3 dp=distort(p);
                
                csm_Position=dp;
                
                vUv=uv;
                
                // color
                vec3 col=uColors[COLOR_COUNT-1];
                col=getColor(col,dp);
                
                vColor=col;
            }