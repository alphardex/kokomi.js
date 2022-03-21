import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

interface PlaneConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
}

const defaultVertexShader = `
varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=vec4(p,1.);
    
    vUv=uv;
}
`;

const defaultFragmentShader = `
uniform float iTime;
uniform vec3 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec3 color=vec3(p,0.);
    gl_FragColor=vec4(color,1.);
}
`;

class ScreenQuad extends Component {
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  constructor(base: Base, config: Partial<PlaneConfig> = {}) {
    super(base);

    const {
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
    } = config;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...{
          iTime: {
            value: 0,
          },
          iResolution: {
            value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
          },
          iMouse: {
            value: new THREE.Vector2(0, 0),
          },
        },
        ...uniforms,
      },
      side: THREE.DoubleSide,
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
    uniforms.iTime.value = time / 1000;
    uniforms.iResolution.value = new THREE.Vector3(
      window.innerWidth,
      window.innerHeight,
      1
    );
    uniforms.iMouse.value = this.base.interactionManager.mouse;
  }
}

export { ScreenQuad };
