import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export interface CustomMeshConfig {
  geometry: THREE.BufferGeometry;
  baseMaterial: THREE.Material;
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
}

const defaultVertexShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    csm_Position=p;
    
    vUv=uv;
}
`;

const defaultFragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec3 col=vec3(p,0.);
    
    csm_DiffuseColor=vec4(col,1.);
}

`;

class CustomMesh extends Component {
  material: CustomShaderMaterial;
  mesh: THREE.Mesh;
  constructor(base: Base, config: Partial<CustomMeshConfig> = {}) {
    super(base);

    const {
      geometry = new THREE.SphereGeometry(0.25, 64, 64),
      baseMaterial = new THREE.MeshLambertMaterial(),
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
    } = config;

    const material = new CustomShaderMaterial({
      baseMaterial,
      vertexShader,
      fragmentShader,
      uniforms: {
        ...{
          iGlobalTime: {
            value: 0,
          },
          iTime: {
            value: 0,
          },
          iTimeDelta: {
            value: 0,
          },
          iResolution: {
            value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
          },
          iMouse: {
            value: new THREE.Vector4(0, 0, 0, 0),
          },
          iFrame: {
            value: 0,
          },
          iDate: {
            value: new THREE.Vector4(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              new Date().getDate(),
              new Date().getHours()
            ),
          },
          iSampleRate: {
            value: 44100,
          },
          iChannelTime: {
            value: [0, 0, 0, 0],
          },
        },
        ...uniforms,
      },
    });
    this.material = material;

    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
  }
  addExisting(): void {
    this.base.scene.add(this.mesh);
  }
  update(time: number): void {
    const uniforms = this.material.uniforms;
    const t = this.base.clock.elapsedTime;
    uniforms.iGlobalTime.value = t;
    uniforms.iTime.value = t;
    const delta = this.base.clock.deltaTime;
    uniforms.iTimeDelta.value = delta;
    uniforms.iResolution.value = new THREE.Vector3(
      window.innerWidth,
      window.innerHeight,
      1
    );
    const { x, y } = this.base.iMouse.mouse;
    uniforms.iMouse.value = new THREE.Vector4(x, y, 0, 0);
    uniforms.iDate.value = new THREE.Vector4(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
      new Date().getHours()
    );
    uniforms.iChannelTime.value = [t, t, t, t];
  }
}

export { CustomMesh };
