import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 1);

    // new kokomi.OrbitControls(this);

    const axesHelper = new THREE.AxesHelper();
    this.scene.add(axesHelper);

    const box = new kokomi.Box(this);
    box.addExisting();

    this.camera.lookAt(box.mesh.position);

    window.addEventListener("keydown", (e) => {
      if (this.keyboard.isUpKeyDown) {
        box.mesh.position.z += 0.1;
      } else if (this.keyboard.isLeftKeyDown) {
        box.mesh.position.x += 0.1;
      } else if (this.keyboard.isRightKeyDown) {
        box.mesh.position.x -= 0.1;
      } else if (this.keyboard.isDownKeyDown) {
        box.mesh.position.z -= 0.1;
      }
    });

    const tpc = new kokomi.ThirdPersonCamera(this, box.mesh, {
      offset: new THREE.Vector3(0, 0.2, -2),
      lookAt: box.mesh.position.clone().add(new THREE.Vector3(0, 1, 5)),
    });
    tpc.addExisting();
  }
}
