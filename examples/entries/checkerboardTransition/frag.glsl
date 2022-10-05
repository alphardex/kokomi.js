// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#generic-123-noise
float rand(float n){return fract(sin(n)*43758.5453123);}

float rand(vec2 n){
    return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);
}

float noise(float p){
    float fl=floor(p);
    float fc=fract(p);
    return mix(rand(fl),rand(fl+1.),fc);
}

float noise(vec2 n){
    const vec2 d=vec2(0.,1.);
    vec2 b=floor(n),f=smoothstep(vec2(0.),vec2(1.),fract(n));
    return mix(mix(rand(b),rand(b+d.yx),f.x),mix(rand(b+d.xy),rand(b+d.yy),f.x),f.y);
}

// https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
float map(float value,float min1,float max1,float min2,float max2){
    return min2+(value-min1)*(max2-min2)/(max1-min1);
}

float saturate(float a){
    return clamp(a,0.,1.);
}

varying vec2 vUv;

uniform float uProgress;
uniform float uProgress1;
uniform float uGridSize;
uniform vec3 uTextColor;
uniform vec3 uShadowColor;

float getMixer(vec2 p,float pr,float pattern){
    float width=.5;
    pr=map(pr,0.,1.,-width,1.);
    pr=smoothstep(pr,pr+width,p.x);
    float mixer=1.-saturate(pr*2.-pattern);
    return mixer;
}

void main(){
    vec2 p=vUv;
    
    // pattern
    vec2 grid=vec2(5.,10.);
    grid.x*=uGridSize;
    vec2 gridP=vec2(floor(grid.x*p.x),floor(grid.y*p.y));
    float pattern=noise(gridP);
    
    // anime
    vec4 col=vec4(0.);
    
    vec4 l0=vec4(uShadowColor,1.);
    float pr0=uProgress;
    float m0=getMixer(p,pr0,pattern);
    col=mix(col,l0,m0);
    
    vec4 l1=vec4(uTextColor,1.);
    float pr1=uProgress1;
    float m1=getMixer(p,pr1,pattern);
    col=mix(col,l1,m1);
    
    gl_FragColor=col;
}