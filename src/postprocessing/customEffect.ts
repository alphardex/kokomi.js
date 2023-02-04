import * as THREE from "three";
import { EffectComposer, RenderPass, ShaderPass } from "three-stdlib";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { UniformInjector } from "../components/uniformInjector";

export interface CustomEffectConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
}

const defaultVertexShader = /* glsl */ `
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

const defaultFragmentShader = /* glsl */ `
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

/**
 * With this, you can just provide your vertex and fragment shader to make a customized postprocessing effect.
 *
 * Demo: https://kokomi-playground.vercel.app/entries/#volumetricLight
 */
class CustomEffect extends Component {
  composer: EffectComposer;
  customPass: ShaderPass;
  uniformInjector: UniformInjector;
  constructor(base: Base, config: Partial<CustomEffectConfig> = {}) {
    super(base);

    const {
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
    } = config;

    const composer = new EffectComposer(base.renderer);
    this.composer = composer;

    const renderPass = new RenderPass(base.scene, base.camera);
    composer.addPass(renderPass);

    const uniformInjector = new UniformInjector(base);
    this.uniformInjector = uniformInjector;

    const customPass = new ShaderPass({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...{
          tDiffuse: {
            value: null,
          },
        },
        ...uniformInjector.shadertoyUniforms,
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
    this.uniformInjector.injectShadertoyUniforms(uniforms);
  }
}

export { CustomEffect };
