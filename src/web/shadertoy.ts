import * as THREE from "three";

import { Base } from "../base/base";

import { ScreenQuad } from "../shapes";

import { getUniformFromAsset } from "./utils";

const defaultFragmentShader = /* glsl */ `
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}
`;

class Sketch extends Base {
  constructor(sel = "#sketch") {
    super(sel);

    this.resizer.disable();
  }
  create(fragmentShader: string, uniforms = {}) {
    const screenQuad = new ScreenQuad(this, {
      shadertoyMode: true,
      fragmentShader,
      uniforms,
    });
    screenQuad.addExisting();
  }
}

const createSketch = (id = "sketch", fragmentShader: string, uniforms = {}) => {
  const sketch = new Sketch(`#${id}`);
  sketch.create(fragmentShader, uniforms);
  return sketch;
};

/**
 * You can use `<shader-toy></shader-toy>` tag to setup a shadertoy environment in html.
 *
 * Demos: https://github.com/alphardex/shadertoy-playground
 */
class ShaderToyElement extends HTMLElement {
  container: HTMLElement | null;
  sketch: Sketch | null;
  constructor() {
    super();

    this.container = null;
    this.sketch = null;
  }
  static register() {
    if (!customElements.get("shader-toy")) {
      customElements.define("shader-toy", ShaderToyElement);
    }
  }
  connectedCallback() {
    this.create();
  }
  get elId() {
    return this.id || "sketch";
  }
  get containerId() {
    return `${this.elId}-container`;
  }
  get fragShader() {
    const fragScript = this.querySelector("[type=frag]");
    return fragScript?.textContent || defaultFragmentShader;
  }
  getTextureUniform(name: string) {
    const img = this.querySelector(`[name=${name}]`) as HTMLImageElement;
    return getUniformFromAsset(img, name, this);
  }
  get uniforms() {
    return {
      ...this.getTextureUniform("iChannel0"),
      ...this.getTextureUniform("iChannel1"),
      ...this.getTextureUniform("iChannel2"),
      ...this.getTextureUniform("iChannel3"),
    };
  }
  createContainer() {
    const container = document.createElement("div");
    container.id = this.containerId;
    container.style.width = "100%";
    container.style.height = "100%";
    this.appendChild(container);
    this.container = container;
  }
  create() {
    this.createContainer();
    const fragmentShader = this.fragShader;
    const uniforms = this.uniforms;
    const sketch = createSketch(this.containerId, fragmentShader, uniforms);
    const canvas = sketch.renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.sketch = sketch;
  }
}

export { ShaderToyElement };
