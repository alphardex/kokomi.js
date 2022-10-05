import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 1);

    new kokomi.OrbitControls(this);

    const cm = new kokomi.CustomMesh(this, {
      geometry: new THREE.PlaneGeometry(1, 1, 16, 16),
      vertexShader,
      fragmentShader,
    });
    cm.mesh.rotation.x = THREE.MathUtils.degToRad(-90);
    cm.addExisting();

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);
  }
}
