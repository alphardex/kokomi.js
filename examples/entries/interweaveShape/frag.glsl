#define GLSLIFY 1
vec3 cosPalette(float t,vec3 a,vec3 b,vec3 c,vec3 d){
    return a+b*cos(6.28318*(c*t+d));
}

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;
// varying vec3 vNormal;

varying float vNoise;

void main(){
    vec2 p=vUv;
    // vec3 col=vec3(p,0.);
    vec3 col=cosPalette(vNoise*10.,vec3(.5,.5,.5),vec3(.5,.5,.5),vec3(1.,1.,1.),vec3(0.,.10,.20));
    
    csm_DiffuseColor=vec4(col,1.);
    // csm_FragColor=vec4(vNormal,1.);
    // csm_FragColor=vec4(vec3(vNoise,0.,0.),1.);
}
