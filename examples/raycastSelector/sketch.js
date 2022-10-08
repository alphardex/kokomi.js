import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const rs = new kokomi.RaycastSelector(this);

    // hit plane
    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 10, 10),
      new THREE.MeshBasicMaterial({
        wireframe: true,
        side: THREE.DoubleSide,
      })
    );
    this.scene.add(hitPlane);
    hitPlane.position.z = 0.9;
    // hitPlane.visible = false;

    // test sphere
    const testSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 10, 10),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ff0000"),
        wireframe: true,
      })
    );
    this.scene.add(testSphere);
    // testSphere.visible = false;

    // mouse
    this.container.addEventListener("mousemove", (e) => {
      const target = rs.onChooseIntersect(hitPlane);
      if (target) {
        const p = target.point;
        testSphere.position.copy(p);
      }
    });
  }
}
