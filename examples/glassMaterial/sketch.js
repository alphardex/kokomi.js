import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this, {
      material: new kokomi.GlassMaterial(),
    });
    box.addExisting();

    this.update((time) => {
      box.spin(time);
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: "#cccccc" })
    );
    plane.position.set(0, 0, -0.25);
    this.scene.add(plane);

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);
  }
}
