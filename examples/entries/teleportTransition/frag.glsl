uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

uniform float uProgress;

varying vec2 vUv;

// barrel distortion
vec2 distort(vec2 p,float pr,float expo){
    p=2.*p-1.;
    
    p=p/(1.-pr*length(p)*expo);
    
    p=(p+1.)*.5;
    return p;
}

void main(){
    vec2 p=vUv;
    
    float pr0=uProgress;
    float pr0a=pow(.5+.5*pr0,32.);
    float pr1=smoothstep(.75,1.,pr0);
    
    vec2 dp0=distort(p,-10.*pr0a,pr0*4.);
    vec2 dp1=distort(p,-10.*(1.-pr1),pr0*4.);
    
    vec4 tex0=texture(iChannel0,dp0);
    vec4 tex1=texture(iChannel1,dp1);
    
    // vec4 color=tex0;
    vec4 color=mix(tex0,tex1,pr1);
    gl_FragColor=color;
}