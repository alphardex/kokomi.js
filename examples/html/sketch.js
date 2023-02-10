import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1);

    new kokomi.OrbitControls(this);

    const box1 = new kokomi.Box(this);
    box1.addExisting();
    box1.mesh.position.x = -0.25;

    this.update((time) => {
      box1.spin(time);
    });

    const html1 = new kokomi.Html(
      this,
      document.querySelector(".point-1"),
      box1.mesh.position.clone().add(new THREE.Vector3(0, 0.3, 0))
    );
    html1.addExisting();

    const box2 = new kokomi.Box(this);
    box2.addExisting();
    box2.mesh.position.x = 0.25;

    this.update((time) => {
      box2.spin(time);
    });

    const html2 = new kokomi.Html(
      this,
      document.querySelector(".point-2"),
      box2.mesh.position.clone().add(new THREE.Vector3(0, 0.3, 0))
    );
    html2.addExisting();
  }
}
