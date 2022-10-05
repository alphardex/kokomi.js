import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 3);

    new kokomi.OrbitControls(this);

    const screenQuad = new kokomi.ScreenQuad(this, {
      shadertoyMode: true,
      vertexShader,
      fragmentShader,
      uniforms: {},
    });
    screenQuad.addExisting();
  }
}
