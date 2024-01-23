import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { FBO } from "../renderTargets";

export interface MeshTransmissionMaterialConfig {
  backside: boolean;
  samples: number;
  background: THREE.Texture | THREE.Color | null;
  chromaticAberration: number;
  refraction: number;
  saturation: number;
  lightPosition: THREE.Vector3;
  diffuse: number;
  specular: number;
  fresnel: number;
  fresnelColor: THREE.Color;
}

const transmissionVertexShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vEyeVector;

#define GLSLIFY 1
// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec4 getWorldPosition(mat4 modelMat,vec3 pos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    return worldPosition;
}

// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){
    vec4 worldPosition=getWorldPosition(modelMat,pos);
    vec3 eyeVector=normalize(worldPosition.xyz-camPos);
    return eyeVector;
}

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;

    vNormal=normalize(normalMatrix*normal);
    vEyeVector=getEyeVector(modelMatrix,p,cameraPosition);
}
`;

const transmissionFragmentShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uFBOResolution;

varying vec3 vNormal;
varying vec3 vEyeVector;

uniform float uChromaticAberration;
uniform float uRefraction;
uniform float uSaturation;
uniform vec3 uLightPosition;
uniform float uDiffuse;
uniform float uSpecular;
uniform float uFresnel;
uniform vec3 uFresnelColor;

vec3 saturation(vec3 rgb,float adjustment){
    const vec3 W=vec3(.2125,.7154,.0721);
    vec3 intensity=vec3(dot(rgb,W));
    return mix(intensity,rgb,adjustment);
}

#ifndef FUNC_SATURATE
#define FUNC_SATURATE
float saturate(float a){
    return clamp(a,0.,1.);
}
#endif

float diffuse(vec3 n,vec3 l){
    float diff=saturate(dot(n,l));
    return diff;
}

float specular2(vec3 n,vec3 l,float shininess){
    float spec=pow(saturate(pow(dot(n,l),2.)),shininess);
    return spec;
}

float lighting(vec3 light,vec3 normal,vec3 eyeVector,float d,float s){
    vec3 N=normal;
    vec3 L=normalize(-light);
    vec3 H=normalize(eyeVector+L);
    
    float diff=diffuse(N,L)*d;
    float spec=specular2(N,H,s);
    float lin=diff+spec;
    return lin;
}

float fresnel2(vec3 eyeVector,vec3 worldNormal,float power){
    float fresnelFactor=abs(dot(eyeVector,worldNormal));
    float inversefresnelFactor=1.-fresnelFactor;
    return pow(inversefresnelFactor,power);
}

void main(){
    vec2 p=gl_FragCoord.xy/uFBOResolution.xy;
    
    vec3 col=vec3(0.);
    
    float iorR=1.15;
    float iorY=1.16;
    float iorG=1.18;
    float iorC=1.22;
    float iorB=1.22;
    float iorP=1.22;
    
    float cr=uChromaticAberration;
    float refra=uRefraction;
    float sat=uSaturation;
    
    vec3 lightPos=uLightPosition;
    float d=uDiffuse;
    float s=uSpecular;
    
    float fr=uFresnel;
    vec3 frCol=uFresnelColor;
    
    for(int i=0;i<SAMPLES;i++){
        float slide=float(i)/float(SAMPLES)*.1;
        
        vec3 refractVecR=refract(vEyeVector,vNormal,(1./iorR));
        vec3 refractVecY=refract(vEyeVector,vNormal,(1./iorY));
        vec3 refractVecG=refract(vEyeVector,vNormal,(1./iorG));
        vec3 refractVecC=refract(vEyeVector,vNormal,(1./iorC));
        vec3 refractVecB=refract(vEyeVector,vNormal,(1./iorB));
        vec3 refractVecP=refract(vEyeVector,vNormal,(1./iorP));
        
        float r=texture(uTexture,p+refractVecR.xy*(refra+slide*1.)*cr).x*.5;
        
        float y=(texture(uTexture,p+refractVecY.xy*(refra+slide*1.)*cr).x*2.+
        texture(uTexture,p+refractVecY.xy*(refra+slide*1.)*cr).y*2.-
        texture(uTexture,p+refractVecY.xy*(refra+slide*1.)*cr).z)/6.;
        
        float g=texture(uTexture,p+refractVecG.xy*(refra+slide*2.)*cr).y*.5;
        
        float c=(texture(uTexture,p+refractVecC.xy*(refra+slide*2.5)*cr).y*2.+
        texture(uTexture,p+refractVecC.xy*(refra+slide*2.5)*cr).z*2.-
        texture(uTexture,p+refractVecC.xy*(refra+slide*2.5)*cr).x)/6.;
        
        float b=texture(uTexture,p+refractVecB.xy*(refra+slide*3.)*cr).z*.5;
        
        float p=(texture(uTexture,p+refractVecP.xy*(refra+slide*1.)*cr).z*2.+
        texture(uTexture,p+refractVecP.xy*(refra+slide*1.)*cr).x*2.-
        texture(uTexture,p+refractVecP.xy*(refra+slide*1.)*cr).y)/6.;
        
        float R=r+(2.*p+2.*y-c)/3.;
        float G=g+(2.*y+2.*c-p)/3.;
        float B=b+(2.*c+2.*p-y)/3.;
        
        col.r+=R;
        col.g+=G;
        col.b+=B;
        
        col=saturation(col,sat);
    }
    
    col/=float(SAMPLES);
    
    float lin=lighting(lightPos,vNormal,vEyeVector,d,s);
    col+=vec3(lin);
    
    float F=fresnel2(vEyeVector,vNormal,fr);
    col+=vec3(F)*frCol;
    
    gl_FragColor=vec4(col,1.);
}
`;

/**
 * Reference: https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/
 */
class MeshTransmissionMaterial extends Component {
  fbo: FBO;
  fboBack: FBO;
  material: THREE.ShaderMaterial;
  parent: THREE.Mesh;
  backside: boolean;
  background: THREE.Texture | THREE.Color | null;
  oldBg: THREE.Texture | THREE.Color | null;
  constructor(
    base: Base,
    parent: THREE.Mesh,
    config: Partial<MeshTransmissionMaterialConfig> = {}
  ) {
    super(base);

    const {
      backside = true,
      samples = 16,
      background = null,
      chromaticAberration = 0.5,
      refraction = 0.25,
      saturation = 1.14,
      lightPosition = new THREE.Vector3(-1, 1, 1),
      diffuse = 0.2,
      specular = 15,
      fresnel = 8,
      fresnelColor = new THREE.Color("#ffffff"),
    } = config;
    this.backside = backside;
    this.background = background;

    this.parent = parent;

    const fbo = new FBO(this.base);
    this.fbo = fbo;
    const fboBack = new FBO(this.base);
    this.fboBack = fboBack;

    const material = new THREE.ShaderMaterial({
      vertexShader: transmissionVertexShader,
      fragmentShader: transmissionFragmentShader,
      defines: {
        SAMPLES: samples,
      },
      uniforms: {
        uTexture: {
          value: null,
        },
        uFBOResolution: {
          value: new THREE.Vector2(fbo.rt.width, fbo.rt.height),
        },
        uChromaticAberration: {
          value: chromaticAberration,
        },
        uRefraction: {
          value: refraction,
        },
        uSaturation: {
          value: saturation,
        },
        uLightPosition: {
          value: lightPosition,
        },
        uDiffuse: {
          value: diffuse,
        },
        uSpecular: {
          value: specular,
        },
        uFresnel: {
          value: fresnel,
        },
        uFresnelColor: {
          value: fresnelColor,
        },
      },
    });
    this.material = material;

    this.oldBg = null;

    this.base.resizer.on("resize", () => {
      material.uniforms.uFBOResolution.value = new THREE.Vector2(
        fbo.rt.width,
        fbo.rt.height
      );
    });
  }
  update(time: number): void {
    const { fbo, fboBack } = this;

    this.oldBg = this.base.scene.background;
    if (this.background) {
      this.base.scene.background = this.background;
    }

    this.parent.visible = false;

    const mat = this.parent.material as THREE.ShaderMaterial;

    // back
    if (this.backside) {
      this.base.renderer.setRenderTarget(fboBack.rt);
      this.base.renderer.render(this.base.scene, this.base.camera);

      mat.uniforms.uTexture.value = fboBack.rt.texture;
      mat.side = THREE.BackSide;

      this.parent.visible = true;
    }

    // front
    this.base.renderer.setRenderTarget(fbo.rt);
    this.base.renderer.render(this.base.scene, this.base.camera);

    mat.uniforms.uTexture.value = fbo.rt.texture;
    mat.side = THREE.FrontSide;

    this.base.scene.background = this.oldBg;

    this.base.renderer.setRenderTarget(null);

    this.parent.visible = true;
  }
}

export { MeshTransmissionMaterial };
