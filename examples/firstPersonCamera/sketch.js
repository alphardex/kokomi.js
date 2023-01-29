import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 2, 0);

    this.camera.fov = 60;
    this.camera.updateProjectionMatrix();

    // new kokomi.OrbitControls(this);

    const axesHelper = new THREE.AxesHelper();
    this.scene.add(axesHelper);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial()
    );
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
    plane.position.y = -0.01;

    const box = new kokomi.Box(this, {
      material: new THREE.MeshBasicMaterial({ color: "red" }),
      width: 4,
      height: 4,
      depth: 4,
    });
    box.addExisting();
    box.mesh.position.set(10, 2, 0);

    const fpc = new kokomi.FirstPersonCamera(this);
    fpc.addExisting();
  }
}
