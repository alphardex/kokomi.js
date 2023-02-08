import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this);
    box.addExisting();

    const float = new kokomi.Float(this);
    float.addExisting();
    float.add(box.mesh);
  }
}
