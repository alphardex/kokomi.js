uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uDevicePixelRatio;
uniform float uMaskRadius;

vec2 centerUv(vec2 uv,vec2 resolution){
    uv-=vec2(.5);
    float aspect=resolution.x/resolution.y;
    uv.x*=aspect;
    return uv;
}

float circle(vec2 st,float r,vec2 v){
    float d=length(st-v);
    float c=smoothstep(r,r+.001,d);
    return c;
}

float getCircle(float radius){
    vec2 viewportP=gl_FragCoord.xy/iResolution/uDevicePixelRatio;
    float aspect=iResolution.x/iResolution.y;
    
    vec2 m=iMouse.xy/iResolution.xy;
    
    vec2 maskP=viewportP-m;
    maskP/=vec2(1.,aspect);
    maskP+=m;
    
    float r=radius/iResolution.x;
    float c=circle(maskP,r,m);
    
    return c;
}

void main(){
    vec2 p=vUv;
    
    float mask=getCircle(uMaskRadius/uDevicePixelRatio);
    vec3 col=vec3(1.);
    
    float alpha=mask;
    
    gl_FragColor=vec4(col,alpha);
}