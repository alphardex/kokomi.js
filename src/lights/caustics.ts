import * as THREE from "three";

import { FullScreenQuad } from "three-stdlib";

import { Component } from "../components/component";
import { Base } from "../base/base";

import { FBO } from "../renderTargets";
import { getBound, getBoundsVertices } from "../utils";

export interface CausticsConfig {
  lightSource: THREE.Vector3;
  intensity: number;
  normalMaterial: THREE.MeshNormalMaterial;
  ior: number;
  chromaticAberration: number;
  samples: number;
  saturation: number;
  noiseIntensity: number;
  scaleCorrection: number;
}

const vertexShader = /* glsl */ `
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

varying vec3 vWorldPosition;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
    vWorldPosition=vec3(modelMatrix*vec4(p,1));
}
`;

const fragmentShader = /* glsl */ `
#ifndef saturate
#define saturate(a)clamp(a,0.,1.)
#endif

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;
varying vec3 vWorldPosition;

uniform sampler2D uNormalTexture;
uniform vec3 uLightPosition;
uniform float uIntensity;
uniform float uIor;

void main(){
    vec2 uv=vUv;
    
    vec3 normal=normalize(texture(uNormalTexture,uv).xyz);
    vec3 lightDir=normalize(uLightPosition);
    
    vec3 ray=refract(lightDir,normal,1./uIor);
    
    vec3 oldPos=vWorldPosition;
    vec3 newPos=vWorldPosition+ray;
    
    // https://medium.com/@evanwallace/rendering-realtime-caustics-in-webgl-2a99a29a0b2c
    float oldArea=length(dFdx(oldPos))*length(dFdy(oldPos));
    float newArea=length(dFdx(newPos))*length(dFdy(newPos));
    float result=saturate(oldArea/newArea)*uIntensity;
    result=pow(result,2.);
    
    gl_FragColor=vec4(vec3(result),1.);
}
`;

const vertexShader2 = /* glsl */ `
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;

const fragmentShader2 = /* glsl */ `
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uCa;
uniform float uSaturation;
uniform float uNoiseIntensity;

vec3 saturation(vec3 rgb,float adjustment){
    const vec3 W=vec3(.2125,.7154,.0721);
    vec3 intensity=vec3(dot(rgb,W));
    return mix(intensity,rgb,adjustment);
}

highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}

void main(){
    vec2 uv=vUv;
    vec3 col=vec3(0.);
    for(int i=0;i<SAMPLES;i++){
        float noise=random(uv)*uNoiseIntensity;
        float slide=float(i)/float(SAMPLES)*.1+noise;
        
        vec2 dir=vec2(1.);
        dir=i%2==0?vec2(-.5,0.):vec2(0.,.5);
        
        float R=texture(uTexture,uv+(uCa*slide*dir*1.)).r;
        float G=texture(uTexture,uv+(uCa*slide*dir*2.)).g;
        float B=texture(uTexture,uv+(uCa*slide*dir*3.)).b;
        col.r+=R;
        col.g+=G;
        col.b+=B;
    }
    col/=float(SAMPLES);
    col=saturation(col,uSaturation);
    
    gl_FragColor=vec4(col,1.);
}
`;

/**
 * Reference: https://blog.maximeheckel.com/posts/caustics-in-webgl/
 */
class Caustics extends Component {
  group: THREE.Group;
  scene: THREE.Scene;
  lightSource: THREE.Vector3;
  intensity: number;
  normalMaterial: THREE.MeshNormalMaterial;
  ior: number;
  chromaticAberration: number;
  samples: number;
  saturation: number;
  noiseIntensity: number;
  scaleCorrection: number;
  material: THREE.ShaderMaterial;
  causticsPlane: THREE.Mesh;
  normalFBO: FBO;
  normalCamera: THREE.PerspectiveCamera;
  causticsFBO: FBO;
  causticsComputeMaterial: THREE.ShaderMaterial;
  causticsQuad: FullScreenQuad;
  bound!: ReturnType<typeof getBound>;
  constructor(base: Base, config: Partial<CausticsConfig> = {}) {
    super(base);

    const {
      lightSource = new THREE.Vector3(-10, 13, -10),
      intensity = 0.5,
      normalMaterial = new THREE.MeshNormalMaterial(),
      ior = 1.25,
      chromaticAberration = 0.16,
      samples = 16,
      saturation = 1.265,
      noiseIntensity = 0.01,
      scaleCorrection = 1.75,
    } = config;

    this.lightSource = lightSource;
    this.intensity = intensity;
    this.normalMaterial = normalMaterial;
    this.ior = ior;
    this.chromaticAberration = chromaticAberration;
    this.samples = samples;
    this.saturation = saturation;
    this.noiseIntensity = noiseIntensity;
    this.scaleCorrection = scaleCorrection;

    const group = new THREE.Group();
    this.group = group;

    const scene = new THREE.Scene();
    this.scene = scene;
    group.add(this.scene);

    const geometry = new THREE.PlaneGeometry();
    // const material = new THREE.MeshBasicMaterial();
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTexture: {
          value: null,
        },
        uCa: {
          value: this.chromaticAberration,
        },
        uSaturation: {
          value: this.saturation,
        },
        uNoiseIntensity: {
          value: this.noiseIntensity,
        },
      },
      defines: {
        SAMPLES: this.samples,
      },
    });
    this.material = material;
    const causticsPlane = new THREE.Mesh(geometry, material);
    this.causticsPlane = causticsPlane;
    this.causticsPlane.rotation.set(-Math.PI / 2, 0, 0);
    this.causticsPlane.position.set(5, 0, 5);
    this.causticsPlane.scale.setScalar(10);

    this.group.add(this.causticsPlane);

    const normalFBO = new FBO(this.base);
    this.normalFBO = normalFBO;

    const normalCamera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
    this.normalCamera = normalCamera;

    const causticsFBO = new FBO(this.base);
    this.causticsFBO = causticsFBO;

    const causticsComputeMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uNormalTexture: {
          value: null,
        },
        uLightPosition: {
          value: this.lightSource,
        },
        uIntensity: {
          value: this.intensity,
        },
        uIor: {
          value: this.ior,
        },
      },
    });
    this.causticsComputeMaterial = causticsComputeMaterial;

    const causticsQuad = new FullScreenQuad(causticsComputeMaterial);
    this.causticsQuad = causticsQuad;
  }
  addExisting() {
    this.container.add(this.group);
  }
  add(...object: THREE.Object3D[]) {
    this.scene.add(...object);
  }
  adjustPlane() {
    const bounds = this.bound.boundingBox;

    const boundsVertices = getBoundsVertices(bounds);

    // projectedVertex = vertex + lightDir * ((planeY - vertex.y) / lightDir.y)
    const lightDir = this.lightSource.clone().normalize();
    const newVertices = boundsVertices.map((vert) =>
      vert.add(lightDir.clone().multiplyScalar(-vert.y / lightDir.y))
    );
    const centerPos = newVertices
      .reduce((a, b) => a.add(b), new THREE.Vector3(0, 0, 0))
      .divideScalar(newVertices.length);
    this.causticsPlane.position.copy(centerPos);

    const scale = newVertices
      .map((vert) => Math.hypot(vert.x - centerPos.x, vert.z - centerPos.z))
      .reduce((a, b) => Math.max(a, b), 0);
    this.causticsPlane.scale.multiplyScalar(this.scaleCorrection);
  }
  update() {
    const bound = getBound(this.scene);
    this.bound = bound;

    this.adjustPlane();

    this.material.uniforms.uCa.value = this.chromaticAberration;
    this.material.defines.SAMPLES = this.samples;
    this.material.uniforms.uSaturation.value = this.saturation;
    this.material.uniforms.uNoiseIntensity.value = this.noiseIntensity;

    this.normalCamera.position.copy(this.lightSource);
    this.normalCamera.lookAt(this.bound.center);

    this.scene.overrideMaterial = this.normalMaterial;
    this.scene.overrideMaterial.side = THREE.BackSide;

    this.base.renderer.setRenderTarget(this.normalFBO.rt);
    this.base.renderer.render(this.scene, this.normalCamera);

    this.scene.overrideMaterial = null;

    this.causticsComputeMaterial.uniforms.uNormalTexture.value =
      this.normalFBO.rt.texture;
    this.causticsComputeMaterial.uniforms.uLightPosition.value =
      this.lightSource;
    this.causticsComputeMaterial.uniforms.uIntensity.value = this.intensity;
    this.causticsComputeMaterial.uniforms.uIor.value = this.ior;
    this.causticsQuad.material = this.causticsComputeMaterial;
    this.base.renderer.setRenderTarget(this.causticsFBO.rt);
    this.causticsQuad.render(this.base.renderer);

    // this.causticsPlane.material.map = this.normalFBO.rt.texture;
    // this.causticsPlane.material.map = this.causticsFBO.rt.texture;
    (
      this.causticsPlane.material as THREE.ShaderMaterial
    ).uniforms.uTexture.value = this.causticsFBO.rt.texture;
    this.base.renderer.setRenderTarget(null);
  }
}

export { Caustics };
