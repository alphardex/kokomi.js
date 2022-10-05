// Ref: https://www.maya-ndljk.com/blog/threejs-basic-toon-shader
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec3 uColor;
uniform float uGlossiness;

varying vec3 vNormal;
varying vec3 vViewDir;

void main(){
    // shadow map
    DirectionalLightShadow directionalShadow=directionalLightShadows[0];
    
    float shadow=getShadow(
        directionalShadowMap[0],
        directionalShadow.shadowMapSize,
        directionalShadow.shadowBias,
        directionalShadow.shadowRadius,
        vDirectionalShadowCoord[0]
    );
    
    // directional light
    float NdotL=dot(vNormal,directionalLights[0].direction);
    float lightIntensity=smoothstep(0.,.01,NdotL*shadow);
    vec3 directionalLight=directionalLights[0].color*lightIntensity;
    
    // specular reflection
    vec3 halfVector=normalize(directionalLights[0].direction+vViewDir);
    float NdotH=dot(vNormal,halfVector);
    
    float specularIntensity=pow(NdotH*lightIntensity,1000./uGlossiness);
    float specularIntensitySmooth=smoothstep(.05,.1,specularIntensity);
    
    vec3 specular=specularIntensitySmooth*directionalLights[0].color;
    
    // rim lighting
    float rimDot=1.-dot(vViewDir,vNormal);
    float rimAmount=.6;
    
    float rimThreshold=.2;
    float rimIntensity=rimDot*pow(NdotL,rimThreshold);
    rimIntensity=smoothstep(rimAmount-.01,rimAmount+.01,rimIntensity);
    
    vec3 rim=rimIntensity*directionalLights[0].color;
    
    csm_FragColor=vec4(uColor*(ambientLightColor+directionalLight+specular+rim),1.);
}