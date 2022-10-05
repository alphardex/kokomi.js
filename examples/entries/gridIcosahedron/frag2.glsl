#define GLSLIFY 1
// https://threejs.org/examples/?q=wire#webgl_materials_wireframe
float edgeFactorTri(vec3 center,float width){
    vec3 d=fwidth(center);
    vec3 a3=smoothstep(d*(width-.5),d*(width+.5),center);
    return min(min(a3.x,a3.y),a3.z);
}

uniform float uWidth;

varying vec2 vUv;

varying vec3 vCenter;

void main(){
    float line=1.-edgeFactorTri(vCenter,uWidth);
    if(line<.1){
        discard;
    }
    vec3 color=vec3(vec2(line),1.);
    csm_FragColor=vec4(color,1.);
}