uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;
varying vec3 vPosition;

uniform samplerCube tCube;
varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

float saturate(float a){
    return clamp(a,0.,1.);
}

// Ref: https://github.com/pmndrs/three-stdlib/blob/main/src/shaders/FresnelShader.ts
vec4 getFresnelFrag(){
    vec4 reflectedColor=texture(tCube,vec3(-vReflect.x,vReflect.yz));
    vec4 refractedColor=vec4(1.);
    refractedColor.r=texture(tCube,vec3(vRefract[0].x,vRefract[0].yz)).r;
    refractedColor.g=texture(tCube,vec3(vRefract[1].x,vRefract[1].yz)).g;
    refractedColor.b=texture(tCube,vec3(vRefract[2].x,vRefract[2].yz)).b;
    return mix(refractedColor,reflectedColor,saturate(vReflectionFactor));
    // return refractedColor;
    // return vec4(vec3(vReflectionFactor),1.);
    // return reflectedColor;
}

void main(){
    vec2 p=vUv;
    vec3 pos=vPosition;
    
    vec4 col=getFresnelFrag();
    
    csm_FragColor=col;
}
