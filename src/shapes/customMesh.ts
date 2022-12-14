import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import {
  CustomShaderMaterial,
  AllMaterialParams,
  CSMPatchMap,
} from "../lib/THREE-CustomShaderMaterial";

import { UniformInjector } from "../components/uniformInjector";

export interface CustomMeshConfig {
  geometry: THREE.BufferGeometry;
  baseMaterial: THREE.Material;
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
  patchMap: CSMPatchMap;
  materialParams: AllMaterialParams;
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

/**
 * It contains a `THREE.Mesh` object in which you can custom its base material (which is based on [THREE-CustomShaderMaterial](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial)).
 * Also, it provides all the shadertoy uniforms.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#customMesh
 */
class CustomMesh extends Component {
  material: CustomShaderMaterial;
  mesh: THREE.Mesh;
  uniformInjector: UniformInjector;
  constructor(base: Base, config: Partial<CustomMeshConfig> = {}) {
    super(base);

    const {
      geometry = new THREE.PlaneGeometry(1, 1, 16, 16),
      baseMaterial = new THREE.ShaderMaterial(),
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
      patchMap = {},
      materialParams = {},
    } = config;

    const uniformInjector = new UniformInjector(base);
    this.uniformInjector = uniformInjector;

    const material = new CustomShaderMaterial({
      baseMaterial,
      vertexShader,
      fragmentShader,
      uniforms: {
        ...uniformInjector.shadertoyUniforms,
        ...uniforms,
      },
      patchMap,
      ...materialParams,
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
    this.uniformInjector.injectShadertoyUniforms(uniforms);
  }
}

export { CustomMesh };
