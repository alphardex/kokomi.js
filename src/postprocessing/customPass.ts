import * as THREE from "three";

import * as STDLIB from "three-stdlib";

import type { Base } from "../base/base";
import { Component } from "../components/component";

export interface CustomPassConfig {
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
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;

const defaultFragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec4 color=texture(tDiffuse,p);
    gl_FragColor=color;
}
`;

class CustomPass extends Component {
  composer: STDLIB.EffectComposer;
  customPass: STDLIB.ShaderPass;
  constructor(base: Base, config: Partial<CustomPassConfig> = {}) {
    super(base);

    const {
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
    } = config;

    const composer = new STDLIB.EffectComposer(base.renderer);
    this.composer = composer;

    const renderPass = new STDLIB.RenderPass(base.scene, base.camera);
    composer.addPass(renderPass);

    const customPass = new STDLIB.ShaderPass({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...{
          tDiffuse: {
            value: null,
          },
          iTime: {
            value: 0,
          },
          iResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          iMouse: {
            value: new THREE.Vector2(0, 0),
          },
        },
        ...uniforms,
      },
    });
    this.customPass = customPass;
    customPass.renderToScreen = true;
    composer.addPass(customPass);
  }
  addExisting(): void {
    this.base.composer = this.composer;
  }
  update(time: number): void {
    const uniforms = this.customPass.uniforms;
    uniforms.iTime.value = time / 1000;
    uniforms.iResolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );
    uniforms.iMouse.value = this.base.interactionManager.mouse;
  }
}

export { CustomPass };
