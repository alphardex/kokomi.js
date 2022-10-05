uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;
varying vec3 vPosition;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

// Ref: https://github.com/pmndrs/three-stdlib/blob/main/src/shaders/FresnelShader.ts
vec4 getFresnelVert(){
    float mRefractionRatio=1.02;
    float mFresnelBias=.1;
    float mFresnelScale=4.;
    float mFresnelPower=2.;
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    vec4 worldPosition=modelMatrix*vec4(position,1.);
    vec3 worldNormal=normalize(mat3(modelMatrix[0].xyz,modelMatrix[1].xyz,modelMatrix[2].xyz)*normal);
    vec3 I=worldPosition.xyz-cameraPosition;
    vReflect=reflect(I,worldNormal);
    vRefract[0]=refract(normalize(I),worldNormal,mRefractionRatio);
    vRefract[1]=refract(normalize(I),worldNormal,mRefractionRatio*.99);
    vRefract[2]=refract(normalize(I),worldNormal,mRefractionRatio*.98);
    vReflectionFactor=mFresnelBias+mFresnelScale*pow(1.+dot(normalize(I),worldNormal),mFresnelPower);
    return projectionMatrix*mvPosition;
}

void main(){
    vec3 p=position;
    
    vUv=uv;
    vPosition=p;
    
    csm_Position=p;
    
    gl_Position=getFresnelVert();
}