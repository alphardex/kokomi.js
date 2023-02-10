import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 1);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this);
    box.addExisting();

    this.update((time) => {
      box.spin(time);
    });

    const ce = new kokomi.CustomEffect(this, {
      vertexShader,
      fragmentShader,
      uniforms: {
        uRGBShift: {
          value: 2,
        },
      },
    });
    ce.addExisting();
  }
}
