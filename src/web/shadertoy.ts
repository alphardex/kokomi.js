import { Base } from "../base/base";

import { ScreenQuad } from "../shapes";

const defaultFragmentShader = `
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
  create(fragmentShader: string) {
    const screenQuad = new ScreenQuad(this, {
      shadertoyMode: true,
      fragmentShader,
    });
    screenQuad.addExisting();
  }
}

const createSketch = (id = "sketch", fragmentShader: string) => {
  const sketch = new Sketch(`#${id}`);
  sketch.create(fragmentShader);
  return sketch;
};

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
  create() {
    this.createContainer();
    const fragmentShader = this.fragShader;
    const sketch = createSketch(this.containerId, fragmentShader);
    const canvas = sketch.renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.sketch = sketch;
  }
  get fragShader() {
    const fragScript = this.querySelector("[type=frag]");
    return fragScript?.textContent || defaultFragmentShader;
  }
  createContainer() {
    const container = document.createElement("div");
    container.id = this.containerId;
    container.style.width = "100%";
    container.style.height = "100%";
    this.appendChild(container);
    this.container = container;
  }
}

export { ShaderToyElement };
