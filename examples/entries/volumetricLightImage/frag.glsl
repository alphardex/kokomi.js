float circle(vec2 st,float r){
    float d=length(st-vec2(.5));
    float c=smoothstep(r,r-.02,d);
    return c;
}

highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}

// https://github.com/Jam3/glsl-hsl2rgb/blob/master/index.glsl
float hue2rgb(float f1,float f2,float hue){
    if(hue<0.)
    hue+=1.;
    else if(hue>1.)
    hue-=1.;
    float res;
    if((6.*hue)<1.)
    res=f1+(f2-f1)*6.*hue;
    else if((2.*hue)<1.)
    res=f2;
    else if((3.*hue)<2.)
    res=f1+(f2-f1)*((2./3.)-hue)*6.;
    else
    res=f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl){
    vec3 rgb;
    
    if(hsl.y==0.){
        rgb=vec3(hsl.z);// Luminance
    }else{
        float f2;
        
        if(hsl.z<.5)
        f2=hsl.z*(1.+hsl.y);
        else
        f2=hsl.z+hsl.y-hsl.y*hsl.z;
        
        float f1=2.*hsl.z-f2;
        
        rgb.r=hue2rgb(f1,f2,hsl.x+(1./3.));
        rgb.g=hue2rgb(f1,f2,hsl.x);
        rgb.b=hue2rgb(f1,f2,hsl.x-(1./3.));
    }
    return rgb;
}

vec3 hsl2rgb(float h,float s,float l){
    return hsl2rgb(vec3(h,s,l));
}

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main(){
    vec2 p=vUv;
    p-=.5;
    // p.x*=2.;
    
    vec3 col=vec3(1.);
    
    // uv
    vec2 grid=vec2(5.);
    vec2 dp=p*grid;
    dp.x+=mod(floor(p.y*grid.y),2.)/2.;
    
    // color
    vec2 idp=floor(dp);
    float x=random(idp);
    col=mix(uColor1,uColor2,.5);
    
    // shape
    float shape=circle(fract(dp),.3);
    col*=shape;
    
    csm_FragColor=vec4(col,1.);
}