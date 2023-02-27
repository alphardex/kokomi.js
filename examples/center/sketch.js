import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(3, 3, 3);

    new kokomi.OrbitControls(this);

    const g = new THREE.Group();
    this.scene.add(g);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial()
    );
    g.add(box);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      new THREE.MeshBasicMaterial()
    );
    sphere.position.set(0, 1, 0);
    g.add(sphere);

    const center = new kokomi.Center(this);
    center.addExisting();
    center.add(g);
  }
}
