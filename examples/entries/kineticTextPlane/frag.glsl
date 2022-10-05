uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uVelocity;

varying vec3 vPosition;

varying float vWave;

float saturate(float a){
    return clamp(a,0.,1.);
}

// https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
float map(float value,float min1,float max1,float min2,float max2){
    return min2+(value-min1)*(max2-min2)/(max1-min1);
}

void main(){
    vec2 p=vUv;
    
    vec2 grid=vec2(4.,16.);
    vec2 gridUv=vUv*grid;
    vec2 displacement=vec2(iTime*uVelocity,0.);
    vec2 displacedUv=fract(gridUv);
    vec3 tex=texture(uTexture,displacedUv).rgb;
    
    vec3 col=tex;
    
    float wave=vWave;
    wave=map(wave,-1.,1.,0.,.1);
    float shadow=1.-wave;
    col*=shadow;
    
    csm_DiffuseColor=vec4(col,1.);
}