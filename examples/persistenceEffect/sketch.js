import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this);
    box.addExisting();

    this.update(() => {
      const t = this.clock.elapsedTime;
      box.mesh.position.x = Math.cos(t);
      box.mesh.position.y = Math.sin(t);
    });

    const pe = new kokomi.PersistenceEffect(this);
    pe.addExisting();
  }
}
