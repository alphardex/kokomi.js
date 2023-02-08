import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 1);

    this.scene.background = new THREE.Color("#444444");

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this);
    box.addExisting();

    const cs = new kokomi.ContactShadows(this);
    cs.addExisting();
    cs.group.position.y = -0.101;
  }
}
