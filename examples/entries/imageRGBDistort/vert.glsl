#define GLSLIFY 1
const float PI=3.14159265359;

// https://tympanus.net/codrops/2019/10/21/how-to-create-motion-hover-effects-with-image-distortions-using-three-js/
vec3 deformationCurve(vec3 position,vec2 uv,vec2 offset){
    position.x=position.x+(sin(uv.y*PI)*offset.x);
    position.y=position.y+(sin(uv.x*PI)*offset.y);
    return position;
}

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uScrollDelta;

void main(){
    vec3 p=position;
    
    float sd=uScrollDelta;
    
    p=deformationCurve(p,uv,vec2(0.,sd));
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}