uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

uniform sampler2D uInnerTexture;
uniform float uRadius;
uniform float uSwirl;
uniform float uFisheye;

varying vec2 vUv;

vec2 centerUv(vec2 uv,vec2 resolution){
    uv=2.*uv-1.;
    float aspect=resolution.x/resolution.y;
    uv.x*=aspect;
    return uv;
}

vec2 centerUv2(vec2 uv,vec2 resolution){
    uv-=.5;
    float aspect=resolution.x/resolution.y;
    uv.x*=aspect;
    return uv;
}

float circle(vec2 st,float r,float blur,float scale){
    float d=length(st);
    float c=1.-smoothstep(r-r*blur,r+r*blur,d/scale);
    return c;
}

// fbm ref: https://www.shadertoy.com/view/ll2GRt
mat2 rot2d(float angle){return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));}
float r(float a,float b){return fract(sin(dot(vec2(a,b),vec2(12.9898,78.233)))*43758.5453);}
float h(float a){return fract(sin(dot(a,dot(12.9898,78.233)))*43758.5453);}

float noise(vec3 x){
    vec3 p=floor(x);
    vec3 f=fract(x);
    f=f*f*(3.-2.*f);
    float n=p.x+p.y*57.+113.*p.z;
    return mix(mix(mix(h(n+0.),h(n+1.),f.x),
    mix(h(n+57.),h(n+58.),f.x),f.y),
    mix(mix(h(n+113.),h(n+114.),f.x),
    mix(h(n+170.),h(n+171.),f.x),f.y),f.z);
}

// https://iquilezles.org/articles/morenoise
// http://www.pouet.net/topic.php?post=401468
vec3 dnoise2f(vec2 p){
    float i=floor(p.x),j=floor(p.y);
    float u=p.x-i,v=p.y-j;
    float du=30.*u*u*(u*(u-2.)+1.);
    float dv=30.*v*v*(v*(v-2.)+1.);
    u=u*u*u*(u*(u*6.-15.)+10.);
    v=v*v*v*(v*(v*6.-15.)+10.);
    float a=r(i,j);
    float b=r(i+1.,j);
    float c=r(i,j+1.);
    float d=r(i+1.,j+1.);
    float k0=a;
    float k1=b-a;
    float k2=c-a;
    float k3=a-b-c+d;
    return vec3(k0+k1*u+k2*v+k3*u*v,
        du*(k1+k3*v),
        dv*(k2+k3*u));
    }
    
    float fbm(in vec2 uv){
        float t=iTime;
        vec2 p=uv;
        float f,dx,dz,w=.5;
        f=dx=dz=0.;
        for(int i=0;i<3;++i){
            vec3 n=dnoise2f(uv);
            dx+=n.y;
            dz+=n.z;
            f+=w*n.x/(1.+dx*dx+dz*dz);
            w*=.86;
            uv*=vec2(1.36);
            uv*=rot2d(1.25*noise(vec3(p*.1,.12*t))+
            .75*noise(vec3(p*.1,.20*t)));
        }
        return f;
    }
    
    float fbmLow(in vec2 uv){
        float f,dx,dz,w=.5;
        f=dx=dz=0.;
        for(int i=0;i<3;++i){
            vec3 n=dnoise2f(uv);
            dx+=n.y;
            dz+=n.z;
            f+=w*n.x/(1.+dx*dx+dz*dz);
            w*=.95;
            uv*=vec2(3);
        }
        return f;
    }
    
    // ref: https://www.shadertoy.com/view/4s2GRR
    vec2 getFishEyeUv(vec2 uv,vec2 center,float distortionPower){
        vec2 p=uv;
        float prop=uv.x/uv.y;//screen proroption
        vec2 m=center;//center coords
        vec2 d=p-m;//vector from center to current fragment
        float r=sqrt(dot(d,d));// distance of pixel from center
        
        float power=(2.*3.141592/(2.*sqrt(dot(center,center))))*distortionPower;//amount of effect
        
        float bind;//radius of 1:1 effect
        if(power>0.)bind=sqrt(dot(m,m));//stick to corners
        else{if(prop<1.)bind=m.x;else bind=m.y;}//stick to borders
        
        //Weird formulas
        vec2 finalUv;
        if(power>0.)//fisheye
        finalUv=m+normalize(d)*tan(r*power)*bind/tan(bind*power);
        else if(power<0.)//antifisheye
        finalUv=m+normalize(d)*atan(r*-power*10.)*bind/atan(-power*bind*10.);
        else finalUv=p;//no effect for power = 1.0
        return finalUv;
    }
    
    void main(){
        vec2 p=vUv;
        vec2 centerP=centerUv(p,iResolution);
        vec2 centerP2=centerUv2(p,iResolution);
        vec2 center=vec2(.5);
        vec2 dirCenter=p-center;
        float t=iTime*.2;
        float meshFactor=length(iResolution/4400.);
        
        vec2 noiseP=centerP2;
        noiseP*=rot2d(t*10.5);
        vec2 rv=noiseP/(length(noiseP*20.)*noiseP*20.);
        float swirl=fbm(noiseP*fbmLow(vec2(length(noiseP))-t+rv))*10.;
        noiseP*=rot2d(-t*4.5);
        vec2 swirlDistort=fbmLow(noiseP*swirl)*dirCenter*15.;
        
        vec4 col=vec4(0.);
        
        vec2 maskP=centerP;
        float mask=circle(maskP,uRadius,uRadius*.25+.25,1.2);
        col=vec4(vec3(mask),1.);
        
        vec2 dp=p+swirlDistort*.1*uSwirl-dirCenter*mask-dirCenter*uRadius*.5;
        vec4 tex=texture(uTexture,dp);
        
        vec2 dp2=p+dirCenter*(2.-uRadius)*.5;
        dp2=getFishEyeUv(dp2,center,uFisheye*meshFactor);
        vec4 innerTex=texture(uInnerTexture,dp2);
        col=tex;
        
        vec4 finalCol=mix(tex,innerTex,mask);
        
        gl_FragColor=finalCol;
        // gl_FragColor=vec4(noiseP,0.,1.);
        // gl_FragColor=vec4(swirl,0.,0.,1.);
        // gl_FragColor=vec4(swirlDistort,0.,1.);
    }