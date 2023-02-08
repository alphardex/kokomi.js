import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 7);

    new kokomi.OrbitControls(this);

    const mesh = new THREE.Mesh();
    const geo = new THREE.TorusGeometry(3, 1, 32, 100);
    const mat = new kokomi.MeshTransmissionMaterial(this, mesh);
    mesh.geometry = geo;
    mesh.material = mat.material;
    this.scene.add(mesh);
  }
}
