import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import {
  CustomShaderMaterial,
  AllMaterialParams,
  CSMPatchMap,
} from "../lib/THREE-CustomShaderMaterial";

import { UniformInjector } from "../components/uniformInjector";

export interface CustomPointsConfig {
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

uniform float uPointSize;

void main(){
    vec3 p=position;
    csm_Position=p;

    gl_PointSize=uPointSize;
    
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
 * It contains a `THREE.Points` object in which you can custom its base material (which is based on [THREE-CustomShaderMaterial](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial)).
 * Also, it provides all the shadertoy uniforms.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#customPoints
 */
class CustomPoints extends Component {
  material: CustomShaderMaterial;
  points: THREE.Points;
  uniformInjector: UniformInjector;
  constructor(base: Base, config: Partial<CustomPointsConfig> = {}) {
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
        ...{
          uPointSize: {
            value: 10,
          },
        },
        ...uniforms,
      },
      patchMap,
      ...materialParams,
    });
    this.material = material;

    const points = new THREE.Points(geometry, material);
    this.points = points;
  }
  addExisting(): void {
    this.base.scene.add(this.points);
  }
  update(time: number): void {
    const uniforms = this.material.uniforms;
    this.uniformInjector.injectShadertoyUniforms(uniforms);
  }
}

export { CustomPoints };
