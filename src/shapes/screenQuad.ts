import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

export interface PlaneConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
  shadertoyMode: boolean;
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
uniform vec4 iMouse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec3 color=vec3(p,0.);
    gl_FragColor=vec4(color,1.);
}
`;

const shadertoyPrepend = `
uniform float iGlobalTime;
uniform float iTime;
uniform float iTimeDelta;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform int iFrame;
uniform vec4 iDate;
uniform float iSampleRate;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform samplerCube iChannel0Cube;
uniform samplerCube iChannel1Cube;
uniform samplerCube iChannel2Cube;
uniform samplerCube iChannel3Cube;

uniform float iChannelTime[4];
`;

const shadertoyAppend = `
varying vec2 vUv;

void main(){
    mainImage(gl_FragColor,vUv*iResolution.xy);
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
      shadertoyMode = false,
    } = config;

    const finalFragmentShader = shadertoyMode
      ? `
    ${shadertoyPrepend}

    ${fragmentShader}

    ${shadertoyAppend}
    `
      : fragmentShader;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: finalFragmentShader,
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

export { ScreenQuad };
