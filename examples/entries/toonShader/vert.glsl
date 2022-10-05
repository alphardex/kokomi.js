#include <common>
#include <shadowmap_pars_vertex>

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vViewDir;

void main(){
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>

    #include <begin_vertex>

    #include <worldpos_vertex>
    #include <shadowmap_vertex>

    vec3 p=position;
    
    csm_Position=p;
    
    vUv=uv;
    
    vec4 modelPosition=modelMatrix*vec4(p,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 clipPosition=projectionMatrix*viewPosition;
    vNormal=normalize(normalMatrix*normal);
    vViewDir=normalize(-viewPosition.xyz);
}