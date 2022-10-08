import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    new kokomi.OrbitControls(this);

    // 100x100 px unit
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial()
    );
    this.scene.add(plane);
  }
}
