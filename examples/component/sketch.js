import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class MyBox extends kokomi.Component {
  // component's own state
  constructor(base) {
    super(base);

    const box = new kokomi.Box(base, {
      width: 1,
      height: 0.5,
    });
    this.box = box;
  }
  // component's own add
  addExisting() {
    this.box.addExisting();
  }
  // component's own animation
  update(time) {
    this.box.mesh.rotation.y = time / 1000;
  }
}

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 1);

    new kokomi.OrbitControls(this);

    const box = new MyBox(this);
    box.addExisting();
  }
}
