import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 2, 6);
    this.camera.fov = 45;
    this.camera.updateProjectionMatrix();

    new kokomi.OrbitControls(this);

    const sparkles = new kokomi.Sparkles(this, {
      size: 6,
      scale: [4, 2, 4],
      speed: 0.2,
      count: 40,
    });
    sparkles.addExisting();
  }
}
