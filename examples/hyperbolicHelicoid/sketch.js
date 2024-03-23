import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 2);

    new kokomi.OrbitControls(this);

    const geometry = new kokomi.HyperbolicHelicoidGeometry(128, 128);
    const material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);
  }
}
