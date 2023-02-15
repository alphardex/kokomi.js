import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    const camera = new kokomi.OrthographicCamera();
    this.camera = camera;
    this.interactionManager.camera = camera;

    this.camera.position.set(1, 1, 1);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this, {
      width: 1,
      height: 1,
      depth: 1,
    });
    box.addExisting();

    this.update((time) => {
      box.spin(time);
    });
  }
}
